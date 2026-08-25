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

// 👑 قائمة الملاّك الرئيسية (الأساسي + الجدد)
const OWNER_LIDS = [
    '86582883303620@lid',
    '203857015660599@lid',
    '12679481655486@lid'
];

// 🛑 متغير وضع الإيقاف/التشغيل
let isBotOff = false;
let pairingRequested = false;

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: pino({ level: 'silent' })
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        // طلب كود الإقران عند جاهزية الاتصال وعدم التسجيل المسبق
        if (qr && !sock.authState.creds.registered && !pairingRequested) {
            pairingRequested = true;
            const phoneNumber = process.env.PHONE_NUMBER;

            if (!phoneNumber) {
                console.error('❌ خطأ: لم يتم ضبط متغير البيئة PHONE_NUMBER في Render!');
                return;
            }

            // انتظار قصير لتأكيد استقرار websocket
            await sleep(3000);

            try {
                const code = await sock.requestPairingCode(phoneNumber.trim());
                console.log('\n====================================');
                console.log(`🔑 رمز الاقتران الخاص بك هو: [ ${code} ]`);
                console.log('====================================\n');
            } catch (err) {
                console.error('❌ حدث خطأ أثناء طلب رمز الإقران:', err);
                pairingRequested = false;
            }
        }

        if (connection === 'close') {
            pairingRequested = false;
            const statusCode = (lastDisconnect?.error)?.output?.statusCode;
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
            console.log('⚠️ تم قطع الاتصال...');
            if (shouldReconnect) {
                console.log('🔄 جاري إعادة الاتصال بالواتساب...\n');
                await sleep(5000);
                connectToWhatsApp();
            } else {
                console.log('❌ تم تسجيل الخروج. يرجى حذف مجلد auth_info وإعادة التشغيل.');
            }
        } else if (connection === 'open') {
            pairingRequested = false;
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
                    if (isBotOff) {
                        return await sock.sendMessage(from, { text: '⚠️ البوت متوقف بالفعل!' }, { quoted: msg });
                    }
                    isBotOff = true;
                    return await sock.sendMessage(from, { text: '🔇 تم إيقاف استقبال الأوامر.\nلن يستجيب البوت لأي أمر حتى كتابة *.on*' }, { quoted: msg });
                }

                if (cleanText === '.on') {
                    if (!isBotOff) {
                        return await sock.sendMessage(from, { text: '✅ البوت شغال بالفعل!' }, { quoted: msg });
                    }
                    isBotOff = false;
                    return await sock.sendMessage(from, { text: '🔊 تم تفعيل البوت واستئناف استقبال جميع الأوامر بنجاح!' }, { quoted: msg });
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
                        if (userInfo.isMention) {
                            mentions.push(userInfo.jid);
                        }
                        return `${userInfo.text} ${pts}`;
                    });

                    const scoreListText = scoreLines.join('\n');

                    await sock.sendMessage(from, {
                        text: scoreListText,
                        mentions: mentions.length > 0 ? mentions : undefined
                    }, { quoted: msg });

                    if (currentPoints >= gameState.targetPoints) {
                        gameState.active = false;
                        await sleep(500);

                        const userInfo = getFormattedUser(participantJid);

                        if (!userInfo.isMention) {
                            await sock.sendMessage(from, {
                                text: `${userInfo.text} فنشششش`
                            });
                        } else {
                            await sock.sendMessage(from, {
                                text: `@${participantJid.split('@')[0]} فنشششش`,
                                mentions: [participantJid]
                            });
                        }
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
