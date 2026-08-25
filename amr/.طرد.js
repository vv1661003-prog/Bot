module.exports = {
    name: '.طرد',
    async execute({ sock, msg, from, args, isOwner, isNukhba }) {
        if (!isOwner) return;

        const isGroup = from.endsWith('@g.us');
        if (!isGroup) return;

        let targetJid = null;
        const contextInfo = msg.message?.extendedTextMessage?.contextInfo;

        if (contextInfo?.participant) {
            targetJid = contextInfo.participantAlt || contextInfo.participant;
        } else if (contextInfo?.mentionedJid && contextInfo.mentionedJid.length > 0) {
            targetJid = contextInfo.mentionedJid[0];
        } else if (args.length > 0) {
            const raw = args.join('').replace(/[^0-9]/g, '');
            if (raw) targetJid = `${raw}@s.whatsapp.net`;
        }

        if (!targetJid) return;

        try {
            await sock.groupParticipantsUpdate(from, [targetJid], 'remove');
        } catch (err) {
        }
    }
};

