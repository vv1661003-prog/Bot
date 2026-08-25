module.exports = {
    name: 'مخفي',
    async execute({ sock, msg, from, sender, isOwner, isNukhba }) {
        // التحقق من صلاحيات المالك والنخبة
        if (!isOwner && !isNukhba) return;

        // استخراج النص بعد كلمة .مخفي
        const body = msg.message?.conversation || 
                     msg.message?.extendedTextMessage?.text || '';
        
        const text = body.slice(body.indexOf(' ') + 1).trim();

        // التأكد من أن المستخدم كتب نصاً مع الأمر
        if (!text || body.trim() === '.مخفي') {
            return await sock.sendMessage(from, { 
                text: 'الرجاء كتابة نص مع الأمر، مثال:\n*.مخفي السلام عليكم*' 
            }, { quoted: msg });
        }

        try {
            // جلب بيانات المجموعة للحصول على جميع الأعضاء
            const groupMetadata = await sock.groupMetadata(from);
            const participants = groupMetadata.participants.map(p => p.id);

            // إرسال النص مع إخفاء المنشن لجميع الأعضاء
            await sock.sendMessage(from, {
                text: text,
                mentions: participants
            });

        } catch (error) {
            console.error('خطأ في أمر مخفي:', error);
            await sock.sendMessage(from, { 
                text: 'حدث خطأ، تأكد من استخدام الأمر داخل مجموعة وأن البوت مشرف (مشرف/Admin).' 
            }, { quoted: msg });
        }
    }
};

