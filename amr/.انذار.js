const fs = require('fs');
const path = require('path');

const WARNINGS_FILE = path.join(__dirname, '../warnings.json');

function getWarnings() {
    try {
        if (fs.existsSync(WARNINGS_FILE)) {
            const data = JSON.parse(fs.readFileSync(WARNINGS_FILE, 'utf8'));
            const today = new Date();
            if (data.lastReset) {
                const lastResetDate = new Date(data.lastReset);
                if (today.getDay() === 5 && today.toDateString() !== lastResetDate.toDateString()) {
                    return { lastReset: today.toDateString(), users: {} };
                }
            }
            return data;
        }
    } catch (e) {
        console.error('خطأ في قراءة ملف الإنذارات:', e);
    }
    return { lastReset: new Date().toDateString(), users: {} };
}

function saveWarnings(data) {
    fs.writeFileSync(WARNINGS_FILE, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = {
    name: '.انذار',
    async execute({ sock, msg, from, sender, isOwner }) {
        // مخصص للمالك فقط
        if (!isOwner) return;

        const isGroup = from.endsWith('@g.us');
        if (!isGroup) return;

        let targetJid = null;
        const context = msg.message?.extendedTextMessage?.contextInfo;

        if (context?.participant) {
            targetJid = context.participant;
        } else if (context?.mentionedJid && context.mentionedJid.length > 0) {
            targetJid = context.mentionedJid[0];
        }

        if (!targetJid) {
            return await sock.sendMessage(from, { text: '⚠️ يرجى الرد على رسالة الشخص أو منشنته لإعطائه إنذار.' }, { quoted: msg });
        }

        const data = getWarnings();
        const currentCount = (data.users[targetJid] || 0) + 1;
        data.users[targetJid] = currentCount;
        saveWarnings(data);

        const mentionTag = `@${targetJid.split('@')[0]}`;

        if (currentCount >= 5) {
            delete data.users[targetJid];
            saveWarnings(data);

            await sock.sendMessage(from, {
                text: `انذار ل ${mentionTag}\nعدد الانذارات: 5/5\n\nوصل العضو للحد الأقصى وتم طرده تلقائياً!`,
                mentions: [targetJid]
            }, { quoted: msg });

            try {
                await sock.groupParticipantsUpdate(from, [targetJid], 'remove');
            } catch (err) {
                await sock.sendMessage(from, { text: '❌ تعذر طرد العضو، تأكد من رفع البوت لمشرف (Admin).' });
            }
        } else {
            const template = `انذار ل ${mentionTag}\nعدد الانذارات: 5/${currentCount}\n\nملاحظة:اذا حصلت 5 انذارت البوت بيطردك تلقائياً // تنحذف الانذارات اسبوعيا كل جمعة`;

            await sock.sendMessage(from, {
                text: template,
                mentions: [targetJid]
            }, { quoted: msg });
        }
    }
};
