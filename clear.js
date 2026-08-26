const mongoose = require('mongoose');

// نفس رابط قاعدة البيانات الموجود في ملف البوت الخاص بك
const MONGO_URI = 'mongodb+srv://vv1661003_db_user:yj089KXrnbXbKjPB@cluster0.sqcjwcp.mongodb.net/?appName=Cluster0';

async function clearSession() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('⚡ متصل بـ MongoDB...');

        // حذف جدول/مجموعة الجلسات بالكامل أو بيانات الـ creds
        const SessionModel = mongoose.model('Session', new mongoose.Schema({ _id: String, data: String }));
        
        const result = await SessionModel.deleteMany({});
        console.log(`🗑️ تم حذف ${result.deletedCount} جلسة/بيانات اعتماد بنجاح!`);
        
        await mongoose.disconnect();
        console.log('🔌 تم قطع الاتصال بقاعدة البيانات.');
    } catch (err) {
        console.error('❌ حدث خطأ أثناء الحذف:', err);
    }
}

clearSession();
