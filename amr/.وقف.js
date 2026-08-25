const { gameState } = require('../gameManager');

module.exports = {
    name: '.وقف',
    async execute({ sock, msg, from, isOwner, isNukhba }) {
        if (!isOwner && !isNukhba) return;

        if (!gameState.active || gameState.paused) return;
        gameState.paused = true;
        if (gameState.roundTimer) clearTimeout(gameState.roundTimer);
        gameState.acceptingAnswers = false;
        await sock.sendMessage(from, { text: 'تم إيقاف الفعالية مؤقتاً' }, { quoted: msg });
    }
};
