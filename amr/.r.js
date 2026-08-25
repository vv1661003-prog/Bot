const fs = require('fs');
const storedImagesPath = './stored_images.json';
const usedImagesPath = './used_images.json'; // الملف الفرعي للصور المستخدمة

module.exports = {
    name: '.r',
    async execute({ sock, msg, from, args, isOwner, sender }) {
        // إذا لم يكن المالك يتم تجاهل الرسالة والسكوت تماماً
        if (!isOwner) return;

        // دمج الكلمات المدخلة بعد الأمر
        const inputName = args.join(' ').trim();
        if (!inputName) return;

        try {
            // تفكيك الأسماء إذا كانت مفصولة بـ /
            const targets = inputName.split('/').map(n => n.trim().toLowerCase()).filter(Boolean);

            let deleted = false;

            // دالة مساعدة لفلترة وحذف الصورة من أي ملف
            const removeImageFromFile = (filePath) => {
                if (!fs.existsSync(filePath)) return false;
                
                let images = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                const initialCount = images.length;

                images = images.filter(img => {
                    if (!img.names || !Array.isArray(img.names)) return true;

                    const hasMatch = img.names.some(name => {
                        const cleanName = name.trim().toLowerCase();
                        return targets.some(target => cleanName === target || cleanName.includes(target));
                    });

                    return !hasMatch;
                });

                if (images.length < initialCount) {
                    fs.writeFileSync(filePath, JSON.stringify(images, null, 2), 'utf8');
                    return true;
                }
                return false;
            };

            // الحذف من الملف الأساسي
            const deletedFromStored = removeImageFromFile(storedImagesPath);
            // الحذف من الملف الفرعي (المستخدمة)
            const deletedFromUsed = removeImageFromFile(usedImagesPath);

            deleted = deletedFromStored || deletedFromUsed;

            // إذا تم الحذف من أي من الملفين
            if (deleted) {
                await sock.sendMessage(from, { text: 'تم الحذف' }, { quoted: msg });
            }

        } catch (error) {
            console.error('خطأ أثناء حذف الصورة:', error);
        }
    }
};
