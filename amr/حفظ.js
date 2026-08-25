const fs = require('fs');

module.exports = {
    name: 'حفظ',
    description: 'حفظ صورة لاستخدامها في الفعالية (للمالك فقط)',
    async execute({ sock, msg, from, sender, args, isOwner }) {
        // التحقق من أن المنفذ مالك فقط
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

        const jsonPath = './stored_images.json';
        let storedImages = fs.existsSync(jsonPath) ? JSON.parse(fs.readFileSync(jsonPath, 'utf8')) : [];

        storedImages.push({
            names: namesArray,
            messageObject: targetMessage
        });

        fs.writeFileSync(jsonPath, JSON.stringify(storedImages, null, 2));

        const namesText = namesArray.join(' - ');
        await sock.sendMessage(from, { 
            text: `✅ تم حفظ الصورة بنجاح!\nالأسماء المقبولة للإجابة: (*${namesText}*)` 
        }, { quoted: msg });
    }
};
