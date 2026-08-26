const mongoose = require('mongoose');

// تعريف جدول النخبة في قاعدة البيانات إذا لم يكن موجوداً
const NukhbaUser = mongoose.models.NukhbaUser || mongoose.model('NukhbaUser', new mongoose.Schema({
    lid: { type: String, required: true, unique: true },
    number: { type: String, required: true }
}));

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

            // التحقق مما إذا كان المستخدم موجوداً مسبقاً في النخبة
            const exists = await NukhbaUser.findOne({ lid: new RegExp(`^${cleanTarget}`) });
            if (exists) return;

            // إضافة المستخدم لقاعدة البيانات
            await NukhbaUser.create({
                lid: targetLid,
                number: targetNumber
            });

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
