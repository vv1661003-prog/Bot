const mongoose = require('mongoose');

const NukhbaUser = mongoose.models.NukhbaUser || mongoose.model('NukhbaUser', new mongoose.Schema({
    lid: { type: String, required: true, unique: true },
    number: { type: String, required: true }
}));

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
            await NukhbaUser.deleteOne({ lid: new RegExp(`^${cleanTarget}`) });

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
            console.error('خطأ أثناء إزالة عضو من النخبة:', error);
        }
    }
};
