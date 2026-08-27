const fs = require('fs');
const path = require('path');

module.exports = {
    name: '.r',
    async execute({ sock, msg, from, args, isOwner, sender }) {
        if (!isOwner) return;

        const inputName = args.join(' ').trim();
        if (!inputName) return;

        try {
            const targets = inputName.split('/').map(n => n.trim().toLowerCase()).filter(Boolean);
            const filePath = path.join(__dirname, '../stored_images.json');

            // قراءة ملف الصور المخزنة محلياً
            let storedImages = [];
            if (fs.existsSync(filePath)) {
                try {
                    storedImages = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                } catch (e) {
                    storedImages = [];
                }
            }

            let deletedCount = 0;

            // تصفية الصور للاحتفاظ بما لا يطابق الأسماء المطلوبة، وحذف المطابق
            const remainingImages = storedImages.filter(img => {
                if (!img.names || !Array.isArray(img.names)) return true;

                const hasMatch = img.names.some(name => {
                    const cleanName = name.trim().toLowerCase();
                    return targets.some(target => cleanName === target || cleanName.includes(target));
                });

                if (hasMatch) {
                    deletedCount++;
                    return false; // حذف الصورة من القائمة
                }
                return true; // الاحتفاظ بها
            });

            // حفظ القائمة المحدثة في الملف المحلي إذا تم حذف شيء
            if (deletedCount > 0) {
                fs.writeFileSync(filePath, JSON.stringify(remainingImages, null, 2), 'utf8');
                await sock.sendMessage(from, { text: 'تم الحذف' }, { quoted: msg });
            }

        } catch (error) {
            console.error('خطأ أثناء حذف الصورة محلياً:', error);
        }
    }
};
