const fs = require('fs');
const path = require('path');

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
            const filePath = path.join(__dirname, '../registered_users.json');

            // قراءة الملف الحالي أو إنشاء مصفوفة فارغة إذا لم يكن موجوداً
            let users = [];
            if (fs.existsSync(filePath)) {
                try {
                    users = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                } catch (e) {
                    users = [];
                }
            }

            // البحث عما إذا كان المستخدم مسجلاً مسبقاً
            let userIndex = users.findIndex(u => u.jid && u.jid.split('@')[0].split(':')[0] === cleanTarget);

            if (userIndex !== -1) {
                // تحديث اللقب والـ jid إذا كان موجوداً
                users[userIndex].nickname = name;
                users[userIndex].jid = target;
            } else {
                // إضافة مستخدم جديد إذا لم يكن موجوداً
                users.push({ jid: target, nickname: name });
            }

            // كتابة البيانات المحدثة في الملف المحلي
            fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf8');

            await sock.sendMessage(from, { text: `تم تسجيل اللقب: *${name}* بنجاح!` }, { quoted: msg });
        } catch (error) {
            console.error('خطأ أثناء حفظ اللقب محلياً:', error);
            await sock.sendMessage(from, { text: 'حدث خطأ أثناء حفظ البيانات.' }, { quoted: msg });
        }
    }
};
