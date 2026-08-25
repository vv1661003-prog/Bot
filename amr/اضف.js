const fs = require('fs');

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

        let nukhbaData = [];
        try {
            if (fs.existsSync('nukhba.json')) {
                nukhbaData = JSON.parse(fs.readFileSync('nukhba.json', 'utf8'));
            }
        } catch (e) {
            nukhbaData = [];
        }

        const exists = nukhbaData.some(item => (typeof item === 'string' ? item : item.lid) === targetLid);
        if (exists) return;

        nukhbaData.push({ lid: targetLid, number: targetNumber });
        fs.writeFileSync('nukhba.json', JSON.stringify(nukhbaData, null, 2));

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
    }
};
