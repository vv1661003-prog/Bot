const fs = require('fs');
const path = './game_points.json';

module.exports = {
    name: 'نحسب',
    execute: async ({ sock, msg, from, isNukhba }) => {
        if (!isNukhba) return;

        fs.writeFileSync(path, JSON.stringify({}, null, 2));
    }
};
