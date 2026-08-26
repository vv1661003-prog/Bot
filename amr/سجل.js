const { RegisteredUser } = require('../gameManager');

module.exports = {
    name: 'سجل',
    execute: async ({ sock, msg, from, sender, isNukhba }) => {
        if (!isNukhba) return;

        const context = msg.message?.extendedTextMessage?.contextInfo;
        const target = context?.participant;
        if (!target) return;

        const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
        const name = text.replace(/^سجل\s*/, '').trim();
        if (!name) return;

        try {
            const cleanTarget = target.split('@')[0].split(':')[0];

            // التحديث إذا كان موجوداً أو الإنشاء إذا كان جديداً في MongoDB
            await RegisteredUser.findOneAndUpdate(
                { jid: new RegExp(`^${cleanTarget}`) },
                { nickname: name, jid: target },
                { upsert: true, new: true }
            );

            await sock.sendMessage(from, { text: `تم تسجيل اللقب: *${name}* بنجاح!` }, { quoted: msg });
        } catch (error) {
            console.error('خطأ أثناء حفظ اللقب في MongoDB:', error);
            await sock.sendMessage(from, { text: 'حدث خطأ أثناء حفظ البيانات.' }, { quoted: msg });
        }
    }
};
