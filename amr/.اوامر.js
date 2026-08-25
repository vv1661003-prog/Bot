const fs = require('fs');
const path = require('path');

module.exports = {
    name: '.اوامر',
    execute: async ({ sock, msg, from, sender, isOwner }) => {
        if (!isOwner) return;

        const amrFolder = path.join(__dirname);

        if (!fs.existsSync(amrFolder)) return;

        const files = fs.readdirSync(amrFolder);

        const commands = files
            .filter(file => file.endsWith('.js'))
            .map(file => file.replace(/\.js$/, ''));

        if (commands.length === 0) return;

        const resultText = commands.join('\n');

        await sock.sendMessage(from, { text: resultText }, { quoted: msg });
    }
};
