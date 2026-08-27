const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'حفظ',
    description: 'حفظ صورة لاستخدامها في الفعالية (للمالك فقط)',
    async execute({ sock, msg, from, sender, args, isOwner }) {
        // التحقق من أن المستخدم مالك فقط
        if (!isOwner) return;

        const rawInput = args.join(' ');

        if (!rawInput) {
            return await sock.sendMessage(from, {
                text: '⚠️ يرجى كتابة اسم الشخصية (أو الأسماء تفصل بينها /) بعد الأمر!\nمثال: `.حفظ ميدوريا/ايزوكو/ديكو`'
            }, { quoted: msg });
        }

        const hasImage = msg.message?.imageMessage || msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage;

        if (!hasImage) {
            return await sock.sendMessage(from, { text: '⚠️ يرجى إرسال صورة أو الرد على صورة!' }, { quoted: msg });
        }

        const namesArray = rawInput.split('/').map(name => name.trim()).filter(Boolean);

        const context = msg.message?.extendedTextMessage?.contextInfo;
        const targetMessage = context?.quotedMessage ? {
            key: {
                remoteJid: from,
                fromMe: false,
                id: context.stanzaId,
                participant: context.participant
            },
            message: context.quotedMessage
        } : msg;

        try {
            // توليد معرف فريد للصورة بناءً على الوقت ورقم الرسالة
            const imageId = `${Date.now()}_${targetMessage.key.id || Math.random().toString(36).substring(7)}`;

            const filePath = path.join(__dirname, '../stored_images.json');

            // قراءة ملف الصور المخزنة الحالي أو إنشاء مصفوفة فارغة
            let storedImages = [];
            if (fs.existsSync(filePath)) {
                try {
                    storedImages = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                } catch (e) {
                    storedImages = [];
                }
            }

            // إضافة الصورة الجديدة للقائمة
            storedImages.push({
                imageId: imageId,
                names: namesArray,
                messageObject: targetMessage
            });

            // حفظ القائمة المحدثة في ملف JSON المحلي
            fs.writeFileSync(filePath, JSON.stringify(storedImages, null, 2), 'utf8');

            const namesText = namesArray.join(' - ');
            await sock.sendMessage(from, {
                text: `✅ تم حفظ الصورة بنجاح محلياً!\nالأسماء المقبولة للإجابة: (*${namesText}*)`
            }, { quoted: msg });
        } catch (error) {
            console.error('خطأ أثناء حفظ الصورة محلياً:', error);
            await sock.sendMessage(from, { text: '❌ حدث خطأ أثناء حفظ الصورة في الملفات.' }, { quoted: msg });
        }
    }
};
