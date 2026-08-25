const { gameState, sleep, nextRound, defaultTypes } = require('../gameManager');

// خريطة الاختصارات للفعاليات
const typeAliases = {
    'كت': 'كتابة',
    'كتابة': 'كتابة',
    'تف': 'تفكيك',
    'تفكيك': 'تفكيك',
    'صو': 'صور',
    'صور': 'صور',
    'رت': 'ترتيب',
    'ترتيب': 'ترتيب',
    'سس': 'اسئله',
    'اس': 'اسئله',
    'اسئله': 'اسئله',
    'أسئلة': 'اسئله',
    'رك': 'تركيب',
    'تركيب': 'تركيب',
    'عك': 'عكس',
    'عكس': 'عكس',
    'اول': 'اول حرف',
    'أول': 'اول حرف',
    'اول حرف': 'اول حرف',
    'اخر': 'اخر حرف',
    'آخر': 'اخر حرف',
    'اخر حرف': 'اخر حرف'
};

module.exports = {
    name: '.فنشش',
    async execute({ sock, msg, from, args, isOwner, isNukhba }) {
        if (!isOwner && !isNukhba) return;

        const isGroup = from.endsWith('@g.us');
        if (!isGroup) return;

        if (gameState.active) {
            return await sock.sendMessage(from, { text: 'الفعالية شغالة بالفعل' }, { quoted: msg });
        }

        const target = parseInt(args[0]);
        if (isNaN(target) || target <= 0) return;

        // استخراج الفعاليات المطلوبة إن وجدت
        let selectedTypes = [];
        if (args.length > 1) {
            for (let i = 1; i < args.length; i++) {
                const arg = args[i].trim();
                if (typeAliases[arg] && !selectedTypes.includes(typeAliases[arg])) {
                    selectedTypes.push(typeAliases[arg]);
                }
            }
        }

        // إذا ما دخل أي اختصار صحيح يرجع للمتنوع العادي
        if (selectedTypes.length === 0) {
            selectedTypes = [...defaultTypes];
        }

        gameState.active = true;
        gameState.paused = false;
        gameState.targetPoints = target;
        gameState.chatId = from;
        gameState.scores = {};
        gameState.activeTypes = selectedTypes; // تعيين الفعاليات المحددة
        gameState.currentTypeIndex = 0;
        gameState.typeRound = 1;

        await sock.sendMessage(from, { text: `فنش ${target} تجهزو` });
        await sleep(500);
        await sock.sendMessage(from, { text: '3' });
        await sleep(500);
        await sock.sendMessage(from, { text: '2' });
        await sleep(500);
        await sock.sendMessage(from, { text: '1' });
        await sleep(500);

        nextRound(sock);
    }
};

