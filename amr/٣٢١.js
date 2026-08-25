const fs = require('fs');
const path = require('path');

module.exports = {
    name: '٣٢١',
    async execute({ sock, msg, from, isOwner, isNukhba }) {
        if (!isNukhba && !isOwner) return;

        const folderPath = path.join(__dirname, '../images');

        if (!fs.existsSync(folderPath)) return;

        const files = fs.readdirSync(folderPath).filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));
        
        if (files.length === 0) return;

        const randomFile = files[Math.floor(Math.random() * files.length)];
        const imagePath = path.join(folderPath, randomFile);

        await sock.sendMessage(from, { 
            image: { url: imagePath }
        }, { quoted: msg });
    }
};
