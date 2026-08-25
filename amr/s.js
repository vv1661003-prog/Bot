module.exports = {
    name: 's',
    execute: async ({ sock, msg, from, isNukhba }) => {
        if (!isNukhba) return;
        await sock.sendMessage(from, { text: '*_𝐇𝐄𝐑𝐄 ⚡_*' }, { quoted: msg });
    }
};
