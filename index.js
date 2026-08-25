const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Bot is active!'));
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs');
const path = require('path');
const { gameState, sleep, getFormattedUser, checkAnswer, nextRound, advanceType, handleCountdownSpam } = require('./gameManager');

// 👑 قائمة الملاّك الرئيسية
const OWNER_LIDS = [
    '86582883303620@lid',
    '203857015660599@lid',
    '12679481655486@lid'
];

let isBotOff = false;

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false, // تعطيل طباعة المربعات نهائياً
        logger: pino({ level: 'silent' })
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        // طباعة رابط الصورة المباشر فقط عند توليد الـ QR
        if (qr) {
            const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qr)}`;
            console.log('\n====================================');
            console.log('🔗 افتح هذا الرابط لمسح صورة الـ QR مباشرة:');
            console.log(qrImageUrl);
            console.log('====================================\n');
        }

        if (connection === 'close') {
            const statusCode = (lastDisconnect?.error)?.output?.statusCode;
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
            console.log('⚠️ تم قطع الاتصال...');
            if (shouldReconnect) {
                console.log('🔄 جاري إعادة الاتصال...\n');
                await sleep(5000);
                connectToWhatsApp();
            } else {
                console.log('❌ تم تسجيل الخروج. يرجى حذف مجلد auth_info وإعادة التشغيل.');
            }
        } else if (connection === 'open') {
            console.log('\n====================================');
            console.log('✅ تم الاتصال بالواتساب بنجاح! البوت يعمل الآن ⚡');
            console.log('====================================\n');
        }
    });

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;

        for (const msg of messages) {
            if (!msg.message) continue;

            const from = msg.key.remoteJid;
            const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
            const senderLid = msg.key.participant || msg.key.remoteJid;
            const senderJid = msg.key.participantAlt || msg.key.remoteJid;

            if (!text.trim()) continue;

            const isOwner = OWNER_LIDS.some(owner => {
                const cleanOwner = owner.split('@')[0];
                return owner === senderLid || owner === senderJid || senderLid.includes(cleanOwner) || senderJid.includes(cleanOwner);
            }) || msg.key.fromMe;

            let nukhbaList = [];
            try {
                if (fs.existsSync('nukhba.json')) {
                    nukhbaList = JSON.parse(fs.readFileSync('nukhba.json', 'utf8'));
                }
            } catch (e) {
                nukhbaList = [];
            }

            const isNukhba = isOwner || nukhbaList.some(item => {
                const savedLid = typeof item === 'string' ? item : item.lid;
                const savedNum = typeof item === 'string' ? item.split('@')[0] : item.number;
                return savedLid === senderLid || savedLid === senderJid || senderLid.includes(savedNum) || senderJid.includes(savedNum);
            });

            const cleanText = text.trim();

            if (isOwner) {
                if (cleanText === '.off') {
                    if (isBotOff) return await sock.sendMessage(from, { text: '⚠️ البوت متوقف بالفعل!' }, { quoted: msg });
                    isBotOff = true;
                    return await sock.sendMessage(from, { text: '🔇 تم إيقاف استقبال الأوامر.' }, { quoted: msg });
                }

                if (cleanText === '.on') {
                    if (!isBotOff) return await sock.sendMessage(from, { text: '✅ البوت شغال بالفعل!' }, { quoted: msg });
                    isBotOff = false;
                    return await sock.sendMessage(from, { text: '🔊 تم تفعيل البوت واستئناف استقبال الأوامر!' }, { quoted: msg });
                }
            }

            if (isBotOff) continue;

            const context = msg.message?.extendedTextMessage?.contextInfo;
            const participantJid = msg.key.participant || context?.participant || msg.key.participantAlt || senderLid;

            if (gameState.active && from === gameState.chatId) {
                await handleCountdownSpam(sock, participantJid, msg);
            }

            if (gameState.active && !gameState.paused && gameState.acceptingAnswers && from === gameState.chatId) {
                const userText = text.trim();

                if (checkAnswer(userText, gameState.validAnswers, gameState.currentType, participantJid)) {
                    gameState.acceptingAnswers = false;
                    if (gameState.roundTimer) clearTimeout(gameState.roundTimer);

                    gameState.scores[participantJid] = (gameState.scores[participantJid] || 0) + 1;
                    const currentPoints = gameState.scores[participantJid];

                    const mentions = [];
                    const scoreLines = Object.entries(gameState.scores).map(([jid, pts]) => {
                        const userInfo = getFormattedUser(jid);
                        if (userInfo.isMention) mentions.push(userInfo.jid);
                        return `${userInfo.text} ${pts}`;
                    });

                    await sock.sendMessage(from, {
                        text: scoreLines.join('\n'),
                        mentions: mentions.length > 0 ? mentions : undefined
                    }, { quoted: msg });

                    if (currentPoints >= gameState.targetPoints) {
                        gameState.active = false;
                        await sleep(500);
                        const userInfo = getFormattedUser(participantJid);
                        await sock.sendMessage(from, {
                            text: userInfo.isMention ? `@${participantJid.split('@')[0]} فنشششش` : `${userInfo.text} فنشششش`,
                            mentions: userInfo.isMention ? [participantJid] : []
                        });
                    } else {
                        advanceType();
                        await sleep(500);
                        nextRound(sock);
                    }
                }
            }

            if (!isNukhba) continue;

            const args = cleanText.split(/ +/);
            const commandName = args.shift().toLowerCase();

            const commandPath = path.join(__dirname, 'amr', `${commandName}.js`);
            if (fs.existsSync(commandPath)) {
                try {
                    const command = require(commandPath);
                    await command.execute({ sock, msg, from, sender: senderLid, args, isOwner, isNukhba });
                } catch (err) {
                    console.error(`خطأ أثناء تنفيذ الأمر ${commandName}:`, err);
                }
            }
        }
    });
}

connectToWhatsApp();
