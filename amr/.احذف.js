const fs = require('fs');
const usersPath = './registered_users.json';
const pointsPath = './game_points.json';

module.exports = {
    name: '.احذف',
    execute: async ({ sock, msg, from, isNukhba }) => {
        if (!isNukhba) return;

        const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
        const nameToDelete = text.replace(/^\.\s*احذف\s*/, '').trim();
        if (!nameToDelete) return;

        if (!fs.existsSync(usersPath)) {
            await sock.sendMessage(from, { text: 'مو موجود' }, { quoted: msg });
            return;
        }

        let users = JSON.parse(fs.readFileSync(usersPath));
        
        const targetJid = Object.keys(users).find(jid => users[jid] === nameToDelete);

        if (!targetJid) {
            await sock.sendMessage(from, { text: 'مو موجود' }, { quoted: msg });
            return;
        }

        delete users[targetJid];
        fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));

        if (fs.existsSync(pointsPath)) {
            let points = JSON.parse(fs.readFileSync(pointsPath));
            if (points[targetJid]) {
                delete points[targetJid];
                fs.writeFileSync(pointsPath, JSON.stringify(points, null, 2));
            }
        }
    }
};
