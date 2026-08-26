const fs = require('fs');
const path = require('path');

const usersPath = './registered_users.json';
const totalScoresPath = './total_scores.json';
const finishesPath = './finishes.json';

module.exports = {
    name: '.رانكي',
    async execute({ sock, msg, from, sender }) {
        try {
            const cleanSender = sender.split('@')[0].split(':')[0];

            // جلب اللقب
            let nickname = 'غير مسجل';
            if (fs.existsSync(usersPath)) {
                const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
                const matchedKey = Object.keys(users).find(key => key.split('@')[0].split(':')[0] === cleanSender);
                if (matchedKey && users[matchedKey]) {
                    nickname = users[matchedKey];
                }
            }

            // جلب النقاط التراكمية
            let totalPoints = 0;
            if (fs.existsSync(totalScoresPath)) {
                const totalScores = JSON.parse(fs.readFileSync(totalScoresPath, 'utf8'));
                const matchedKey = Object.keys(totalScores).find(key => key.split('@')[0].split(':')[0] === cleanSender);
                if (matchedKey) {
                    totalPoints = totalScores[matchedKey] || 0;
                }
            }

            // جلب الفنشات
            let finishCount = 0;
            if (fs.existsSync(finishesPath)) {
                const finishes = JSON.parse(fs.readFileSync(finishesPath, 'utf8'));
                const matchedKey = Object.keys(finishes).find(key => key.split('@')[0].split(':')[0] === cleanSender);
                if (matchedKey) {
                    finishCount = finishes[matchedKey] || 0;
                }
            }

            const responseText = `*اللقب:* ${nickname}\n*النقاط:* ${totalPoints}\n*الفنشات:* ${finishCount}`;

            await sock.sendMessage(from, { text: responseText }, { quoted: msg });

        } catch (error) {
            console.error('خطأ في تنفيذ أمر .رانكي:', error);
        }
    }
};
