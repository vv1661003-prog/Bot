const { gameState } = require('../gameManager');

module.exports = {
    name: '.انهي',
    async execute({ sock, msg, from, isOwner, isNukhba }) {
        if (!isOwner && !isNukhba) return;

        if (!gameState.active) return;
        if (gameState.roundTimer) clearTimeout(gameState.roundTimer);

        gameState.active = false;
        gameState.paused = false;

        // ❄️ تصفير قائمة المجمدين كاملاً والمؤقت وعداد التجميد
        if (gameState.finishFrozenUsers) gameState.finishFrozenUsers.clear();
        if (gameState.roundFrozenUsers) gameState.roundFrozenUsers.clear();
        gameState.userFreezeCounts = {};
        gameState.countdownMessages = {};

        await sock.sendMessage(from, { text: 'تم إنهاء الفعالية' }, { quoted: msg });
    }
};
