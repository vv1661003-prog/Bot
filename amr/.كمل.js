const { gameState, sleep, nextRound } = require('../gameManager');

module.exports = {
    name: 'كمل',
    async execute({ sock, msg, from, sender, isOwner, isNukhba }) {
        // التحقق من الصلاحيات
        if (!isOwner && !isNukhba) return;

        // التحقق مما إذا كانت الفعالية قائمة ومتوقفة مؤقتاً بالفعل
        if (!gameState.active || !gameState.paused) return;

        // إلغاء إيقاف الفعالية
        gameState.paused = false;

        await sock.sendMessage(from, { text: 'جاري استئناف الفعالية...' }, { quoted: msg });
        await sleep(500);

        // بدء الجولة التالية
        nextRound(sock);
    }
};
