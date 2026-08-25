const fs = require('fs');
const usersPath = './registered_users.json';
const pointsPath = './game_points.json';

module.exports = {
    name: '.',
    execute: async ({ sock, msg, from, isNukhba }) => {
        if (!isNukhba) return;

        const context = msg.message?.extendedTextMessage?.contextInfo;
        const target = context?.participant;
        if (!target) return;

        const users = fs.existsSync(usersPath) ? JSON.parse(fs.readFileSync(usersPath)) : {};
        let points = fs.existsSync(pointsPath) ? JSON.parse(fs.readFileSync(pointsPath)) : {};

        points[target] = (points[target] || 0) + 1;
        fs.writeFileSync(pointsPath, JSON.stringify(points, null, 2));

        const entries = Object.entries(points);
        const totalPoints = entries.reduce((sum, [, pts]) => sum + pts, 0);

        const mentions = [];

        const listText = entries
            .map(([jid, pts]) => {
                if (users[jid]) {
                    return `${users[jid]} ${pts}`;
                } else {
                    mentions.push(jid);
                    return `@${jid.split('@')[0]} ${pts}`;
                }
            })
            .join('\n');

        const resultText = `${listText}\n\n${totalPoints}`;

        await sock.sendMessage(from, { 
            text: resultText,
            mentions: mentions.length > 0 ? mentions : undefined
        }, { quoted: msg });
    }
};
