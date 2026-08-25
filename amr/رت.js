const fs = require('fs');
const usedPath = './used_rt_names.json';

const namesList = [
    'لوفي', 'زورو', 'سانجي', 'نامي', 'تشوبر', 'روبين', 'فرانكي', 'يوسوب', 'بروك', 'جينبي',
    'جينتوكي', 'مادارا', 'ايتاتشي', 'كاكاشي', 'ساسكي', 'ناروتو', 'غوكو', 'فيجيتا', 'غون', 'كيلوا',
    'كورابيكا', 'هيسوكا', 'ليفاي', 'إيرين', 'ميكاسا', 'أرمين', 'اروين', 'سايتاما', 'جينوس', 'غوجو',
    'سوكونا', 'ميغومي', 'ايتادوري', 'تانجيرو', 'نيزوكو', 'زينيتسو', 'إينوسكي', 'غيو', 'رينغوكو', 'المايت',
    'ميدوريا', 'باكوغو', 'تودوروكي', 'تومبا', 'ميريم', 'نيتيرو', 'كينغ', 'سيتاما', 'لايت', 'إل',
    'ريوك', 'رين', 'كانيكي', 'توكا', 'ميكامي', 'يوري', 'موزان', 'اشيد', 'توبيراما', 'هاشيراما',
    'ميناتو', 'أوبيتو', 'شيكمارو', 'جيرايا', 'تسونادي', 'أوروتشيمارو', 'بين', 'ناغاتو', 'كونان', 'ديكو'
];

module.exports = {
    name: 'رت',
    execute: async ({ sock, msg, from, isNukhba, isOwner }) => {
        if (!isNukhba && !isOwner) return;

        let used = fs.existsSync(usedPath) ? JSON.parse(fs.readFileSync(usedPath)) : [];

        let available = namesList.filter(item => !used.includes(item));

        if (available.length === 0) {
            used = [];
            available = [...namesList];
        }

        const randomIndex = Math.floor(Math.random() * available.length);
        const selected = available[randomIndex];

        used.push(selected);
        fs.writeFileSync(usedPath, JSON.stringify(used, null, 2));

        const spacedName = selected.split('').join(' ');

        await sock.sendMessage(from, { text: `*${spacedName}*` }, { quoted: msg });
    }
};
