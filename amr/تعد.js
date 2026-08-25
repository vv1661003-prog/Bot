const fs = require('fs');
const usedPath = './used_anime.json';

const animeList = [
    '٣ججك', '٣ون بيس', '٣ناروتو', '٣بليتش', '٣اتاك', '٣ديث نوت', 
    '٣خطايا', '٣د.ستون', '٣كيمتسو', '٣بلولوك', '٣هايكيو', '٣باسكت بول', 
    '٣بلاك كلوفر', '٣فيلاند', '٣نيفرلاند', '٣موشكوتنسي', '٣ماهيرو', '٣سباي اكس', 
    '٣هنتر', '٣حديقة الظل', '٣الكلاب الضالة', '٣كونان', '٣دراغون بول', '٣سولو', 
    '٣فولمتل', '٣فيريتيل', '٣مونستر', '٣شانسو مان', '٣كود غياس', '٣طوكيو غول', 
    '٣طوكيو ريفنجر'
];

module.exports = {
    name: 'تعد',
    execute: async ({ sock, msg, from, isNukhba, isOwner }) => {
        if (!isNukhba && !isOwner) return;

        let used = fs.existsSync(usedPath) ? JSON.parse(fs.readFileSync(usedPath)) : [];

        let available = animeList.filter(item => !used.includes(item));

        if (available.length === 0) {
            used = [];
            available = [...animeList];
        }

        const randomIndex = Math.floor(Math.random() * available.length);
        const selected = available[randomIndex];

        used.push(selected);
        fs.writeFileSync(usedPath, JSON.stringify(used, null, 2));

        await sock.sendMessage(from, { text: `*${selected}*` }, { quoted: msg });
    }
};
