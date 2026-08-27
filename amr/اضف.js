const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'اضف',
    execute: async ({ sock, msg, from, isOwner }) => {
        if (!isOwner) return;

        const contextInfo = msg.message?.extendedTextMessage?.contextInfo;
        const isReply = !!contextInfo?.stanzaId;
        const targetLid = contextInfo?.participant || contextInfo?.mentionedJid?.[0];

        if (!targetLid) return;

        let targetNumber = targetLid.split('@')[0];
        if (contextInfo?.mentionedJid?.[0]?.includes('@s.whatsapp.net')) {
            targetNumber = contextInfo.mentionedJid[0].split('@')[0];
        }

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

            // التحقق مما إذا كان المستخدم موجوداً مسبقاً
            const exists = nukhbaUsers.some(user => {
                const userClean = (user.lid || user.jid || '').split('@')[0].split(':')[0];
                return userClean === cleanTarget;
            });

            if (exists) return;

            // إضافة المستخدم بنفس الهيكلية (lid و number)
            nukhbaUsers.push({
                lid: targetLid,
                number: targetNumber
            });

            // حفظ التحديثات في ملف nukhba.json الأصلي
            fs.writeFileSync(filePath, JSON.stringify(nukhbaUsers, null, 2), 'utf8');

            if (isReply) {
                const quotedMsgKey = {
                    remoteJid: from,
                    id: contextInfo.stanzaId,
                    participant: contextInfo.participant
                };
                await sock.sendMessage(from, { text: '*تمت الاضافة الى قائمة النخبة*' }, { quoted: { key: quotedMsgKey, message: contextInfo.quotedMessage } });
            } else {
                await sock.sendMessage(from, { text: `*تمت اضافة @${targetNumber} الى قائمة النخبة*`, mentions: [targetLid] }, { quoted: msg });
            }
        } catch (error) {
            console.error('خطأ أثناء إضافة عضو للنخبة:', error);
        }
    }
};
