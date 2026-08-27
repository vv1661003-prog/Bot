const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'ازل',
    execute: async ({ sock, msg, from, isOwner }) => {
        if (!isOwner) return;

        const contextInfo = msg.message?.extendedTextMessage?.contextInfo;
        const isReply = !!contextInfo?.stanzaId;
        const targetLid = contextInfo?.participant || contextInfo?.mentionedJid?.[0];

        if (!targetLid) return;

        try {
            const cleanTarget = targetLid.split('@')[0].split(':')[0];
            const filePath = path.join(__dirname, '../nukhba.json');

            // قراءة ملف nukhba.json المحلي
            let nukhbaUsers = [];
            if (fs.existsSync(filePath)) {
                try {
                    nukhbaUsers = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                } catch (e) {
                    nukhbaUsers = [];
                }
            }

            // تصفية القائمة لإزالة العضو المطابق للـ cleanTarget
            const updatedUsers = nukhbaUsers.filter(user => {
                const userClean = (user.lid || user.jid || '').split('@')[0].split(':')[0];
                return userClean !== cleanTarget;
            });

            // حفظ القائمة الجديدة بعد الحذف في ملف nukhba.json
            fs.writeFileSync(filePath, JSON.stringify(updatedUsers, null, 2), 'utf8');

            const targetNumber = targetLid.split('@')[0];

            if (isReply) {
                const quotedMsgKey = {
                    remoteJid: from,
                    id: contextInfo.stanzaId,
                    participant: contextInfo.participant
                };
                await sock.sendMessage(from, { text: '*تمت الإزالة من قائمة النخبة*' }, { quoted: { key: quotedMsgKey, message: contextInfo.quotedMessage } });
            } else {
                await sock.sendMessage(from, { text: `*تمت إزالة @${targetNumber} من قائمة النخبة*`, mentions: [targetLid] }, { quoted: msg });
            }
        } catch (error) {
            console.error('خطأ أثناء إزالة عضو من النخبة محلياً:', error);
        }
    }
};
