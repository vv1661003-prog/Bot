const fs = require('fs');

module.exports = {
    name: 'ازل',
    execute: async ({ sock, msg, from, isOwner }) => {
        if (!isOwner) return;

        const contextInfo = msg.message?.extendedTextMessage?.contextInfo;
        const isReply = !!contextInfo?.stanzaId;
        const targetLid = contextInfo?.participant || contextInfo?.mentionedJid?.[0];

        if (!targetLid) return;

        let nukhbaData = [];
        try {
            if (fs.existsSync('nukhba.json')) {
                nukhbaData = JSON.parse(fs.readFileSync('nukhba.json', 'utf8'));
            }
        } catch (e) {
            nukhbaData = [];
        }

        nukhbaData = nukhbaData.filter(item => (typeof item === 'string' ? item : item.lid) !== targetLid);
        fs.writeFileSync('nukhba.json', JSON.stringify(nukhbaData, null, 2));

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
    }
};
