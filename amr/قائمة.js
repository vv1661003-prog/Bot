const fs = require('fs');
const path = './registered_users.json';

module.exports = {
    name: 'قائمة',
    execute: async ({ sock, msg, from, isNukhba }) => {
        if (!isNukhba) return;

        if (!fs.existsSync(path)) return;
        const users = JSON.parse(fs.readFileSync(path));
        const names = Object.values(users);
        if (names.length === 0) return;

        const list = names.map((n, i) => `${i + 1}- ${n}`).join('\n');
        await sock.sendMessage(from, { text: list }, { quoted: msg });
    }
};
