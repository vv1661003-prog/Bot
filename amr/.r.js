const { GameImage } = require('../gameManager');

module.exports = {
    name: '.r',
    async execute({ sock, msg, from, args, isOwner, sender }) {
        if (!isOwner) return;

        const inputName = args.join(' ').trim();
        if (!inputName) return;

        try {
            const targets = inputName.split('/').map(n => n.trim().toLowerCase()).filter(Boolean);

            // البحث عن الصور التي تحتوي على الأسماء المطابقة لحذفها
            const allImages = await GameImage.find({});
            let deletedCount = 0;

            for (const img of allImages) {
                if (!img.names || !Array.isArray(img.names)) continue;

                const hasMatch = img.names.some(name => {
                    const cleanName = name.trim().toLowerCase();
                    return targets.some(target => cleanName === target || cleanName.includes(target));
                });

                if (hasMatch) {
                    await GameImage.deleteOne({ _id: img._id });
                    deletedCount++;
                }
            }

            if (deletedCount > 0) {
                await sock.sendMessage(from, { text: 'تم الحذف' }, { quoted: msg });
            }

        } catch (error) {
            console.error('خطأ أثناء حذف الصورة من قاعدة البيانات:', error);
        }
    }
};
