const fs = require('fs');
const path = './registered_users.json';

module.exports = {
    name: 'سجل',
    execute: async ({ sock, msg, from, isNukhba }) => {
        if (!isNukhba) return;

        const context = msg.message?.extendedTextMessage?.contextInfo;
        const target = context?.participant;
        if (!target) return;

        const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
        const name = text.replace(/^سجل\s*/, '').trim();
        if (!name) return;

        let users = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : {};
        users[target] = name;
        fs.writeFileSync(path, JSON.stringify(users, null, 2));
    }
};
