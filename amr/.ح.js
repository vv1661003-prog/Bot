const fs = require('fs');
const path = require('path');

const WARNINGS_FILE = path.join(__dirname, '../warnings.json');

function getWarnings() {
    try {
        if (fs.existsSync(WARNINGS_FILE)) {
            return JSON.parse(fs.readFileSync(WARNINGS_FILE, 'utf8'));
        }
    } catch (e) {}
    return { lastReset: new Date().toDateString(), users: {} };
}

function saveWarnings(data) {
    fs.writeFileSync(WARNINGS_FILE, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = {
    name: '.ح',
    async execute({ sock, msg, from, sender, args, isOwner }) {
        // مخصص للمالك فقط
        if (!isOwner) return;

        const isGroup = from.endsWith('@g.us');
        if (!isGroup) return;

        // يجب كتابة .ح انذار ليعمل الأمر
        if (!args[0] || args[0].toLowerCase() !== 'انذار') return;

        let targetJid = null;
        const context = msg.message?.extendedTextMessage?.contextInfo;

        if (context?.participant) {
            targetJid = context.participant;
        } else if (context?.mentionedJid && context.mentionedJid.length > 0) {
            targetJid = context.mentionedJid[0];
        }

        if (!targetJid) {
            return await sock.sendMessage(from, { text: '⚠️ يرجى الرد على رسالة الشخص أو منشنته لخصم الإنذار.' }, { quoted: msg });
        }

        const data = getWarnings();
        const currentCount = data.users[targetJid] || 0;

        if (currentCount <= 0) {
            return await sock.sendMessage(from, { text: '⚠️ هذا العضو ليس لديه أي إنذارات لخصمها.' }, { quoted: msg });
        }

        const newCount = currentCount - 1;
        if (newCount === 0) {
            delete data.users[targetJid];
        } else {
            data.users[targetJid] = newCount;
        }
        saveWarnings(data);

        const mentionTag = `@${targetJid.split('@')[0]}`;
        await sock.sendMessage(from, {
            text: `✅ تم حذف إنذار لـ ${mentionTag}\nعدد الإنذارات المتبقية: 5/${newCount}`,
            mentions: [targetJid]
        }, { quoted: msg });
    }
};
