const fs = require('fs');
const path = require('path');
const usersPath = './registered_users.json';
const storedImagesPath = './stored_images.json';
const usedImagesPath = './used_images.json'; // الملف الفرعي للصور المستخدمة

const animeList = [
    "استا", "اينوي", "اينو", "ارمين", "ايتشيغو", "ايروين", "ايرين", "ابو", "ايلين", "اوي",
    "ازوي", "اسوي", "ايلومي", "اسوما", "اول مايت", "ايرو", "ايرن", "اوسين", "اوكي", "اولمايت",
    "ايسي", "ايتاشي", "ايساغي", "بان", "باين", "بين", "بوا", "بوروتو", "بولما", "بيسكت",
    "بروك", "باكوغو", "باران", "بايرن", "برادلي", "باولي", "بولي", "برولي", "بوف", "براون",
    "بران", "بيكمان", "بيبو", "بيتو", "باتشيرا", "تين", "تيو", "توكيتو", "تانجيرو",
    "توجي", "توغي", "تاسك", "توشيرو", "تاشيغي", "تاشيجي", "توسين", "ترانكس", "تشوبر", "ثورز",
    "ثيو", "ثورفين", "ثورغيل", "ثوركيل", "جين", "جيلال", "جيرايا", "جولي", "جيرين", "جيمبي",
    "جينبي", "جارو", "جارا", "جينوس", "جوليا", "جون", "جيم", "جكارا", "جراي", "جاك",
    "دابي", "دورورو", "دوفلامينغو", "دين", "دوارين", "داروين", "داكي", "دوفي", "دداني", "ديو",
    "دواريمون", "دون", "رين", "ران", "راي", "روي", "ريم", "رام", "ريو", "روني",
    "رينا", "ريما", "رانبو", "زورو", "زورا", "زينو", "زينون", "زوي", "زابوزا", "زيرو",
    "زامس", "زيتسو", "زينيتسو", "ساي", "ساني", "ساسوري", "ساسكي", "ساروتوبي", "سونغ",
    "ساكورا", "سونا", "سانجي", "شين", "شيغاراكي", "شينوبو", "شيكامارو", "شيكاداي", "شيراهوشي", "شينو",
    "شينوا", "شينرا", "شينا", "غين", "غارو", "غارا", "غيوتارو", "غيو", "غينيا", "غابيمارو",
    "غون", "غراي", "غوتين", "فاي", "فريزا", "فوكسي", "فريرن", "فاران", "فو فو",
    "فرانكي", "رولو", "كين", "كاي", "كروكودايل", "كوكو", "كوكوشيبو", "كرلين", "كيسامي", "كايدو",
    "كينغ", "كوين", "كيد", "كاراسو", "كورونا", "كايزر", "لاو", "ليو", "ليوبولد", "لوفي",
    "ليون", "لورينز", "لولوش", "لوكي", "لوبو", "ماي", "ماكي", "ماكيما", "ميرويم", "ميرا",
    "ميوا", "ميو", "ميكاسا", "ماتشي", "ميرليونا", "مارسي", "موزان", "مارين", "ماين"
];

const questionsList = [
    { q: "سيف روجر؟", a: ["ايس"] },
    { q: "اقوى سياف؟", a: ["ميهوك"] },
    { q: "الهوكاجي6؟", a: ["كاكاشي", "هاتاكي"] },
    { q: "عراب الحريه؟", a: ["ايرين"] },
    { q: "بطل البحرية؟", a: ["غارب", "جارب"] },
    { q: "عائلة كيلوا؟", a: ["زولديك"] },
    { q: "كيرا؟", a: ["لايت"] },
    { q: "زيرو؟", a: ["لولوش"] },
    { q: "صائد الابطال؟", a: ["غارو", "جارو"] },
    { q: "قباعة القش؟", a: ["لوفي"] },
    { q: "قاتل ايس؟", a: ["اكاينو"] },
    { q: "صائد القراصنة؟", a: ["زورو"] },
    { q: "الكيوبي؟", a: ["كوراما"] },
    { q: "قاتل جيرايا؟", a: ["باين"] },
    { q: "اخو ايتاشي؟", a: ["ساسكي"] },
    { q: "قاتل اللحية البيضاء؟", a: ["تيتش"] },
    { q: "ملك القراصنة؟", a: ["روجر"] },
    { q: "اقوى مخلوق؟", a: ["كايدو"] },
    { q: "عرق جيمبي؟", a: ["يوجين"] },
    { q: "فاكهة تشوبر؟", a: ["انسان"] },
    { q: "افضل محقق؟", a: ["ال"] },
    { q: "خليفة ال؟", a: ["نير"] },
    { q: "خطائه الغضب؟", a: ["ميليوداس"] },
    { q: "حاكم بريطانيا؟", a: ["لولوش"] },
    { q: "اخو ادوارد؟", a: ["الفونس"] },
    { q: "قط ناتسو؟", a: ["هابي"] },
    { q: "العملاق العربه؟", a: ["بيك"] },
    { q: "العملاق المدرع؟", a: ["راينر"] },
    { q: "العملاق الضخم؟", a: ["ارمين"] },
    { q: "الثوري الثاني ؟", a: ["سابو"] },
    { q: "صاحب فاكهة ميرا ميرا؟", a: ["سابو"] },
    { q: "اسم لي الاول؟", a: ["روك"] },
    { q: "اسم فانجانس الاول؟", a: ["ويليام"] },
    { q: "شارلوك .......؟", a: ["هولمز"] },
    { q: "جاك .......؟", a: ["السفاح"] },
    { q: "موحد الصين؟", a: ["ايسي"] },
    { q: "زوجة غوكو؟", a: ["تشي تشي"] },
    { q: "حاكم الكون 7؟", a: ["بيروس"] },
    { q: "مستر برنس؟", a: ["سانجي"] },
    { q: "تلميذه تسونادي؟", a: ["ساكورا"] },
    { q: "الرصاصة الفضية؟", a: ["اكاي"] },
    { q: "ابنة موري ؟", a: ["ران"] },
    { q: "وميض كونوها؟", a: ["ميناتو"] },
    { q: "الاسد الذهبي؟", a: ["شيكي"] },
    { q: "مربية لوفي؟", a: ["دادان"] },
    { q: "امير السايان؟", a: ["فيجيتا"] },
    { q: "الساق السوداء؟", a: ["سانجي"] },
    { q: "القرد الاصفر؟", a: ["كيزارو"] },
    { q: "الساق الحمراء؟", a: ["زيف"] },
    { q: "قائد العناكب؟", a: ["كرولو"] },
    { q: "ابن اوسين؟", a: ["اوهون"] },
    { q: "اخطر رجل؟", a: ["دراغون"] },
    { q: "المتحكم في باين؟", a: ["ناغاتو"] },
    { q: "هاشيرا الرياح؟", a: ["سانيمي"] },
    { q: "والد ثورفين؟", a: ["ثورز"] },
    { q: "ام ايس؟", a: ["روج"] },
    { q: "ملك الظلام؟", a: ["رايلي"] },
    { q: "ملك الظلال؟", a: ["سونغ"] },
    { q: "ام ناروتو؟", a: ["كوشينا"] },
    { q: "رجل المنشار؟", a: ["دينجي"] },
    { q: "اخت نامي؟", a: ["نوجيكو"] },
    { q: "خطيئة الكبرياء؟", a: ["اسكانور"] },
    { q: "ملك اللعنات؟", a: ["سوكونا"] },
    { q: "الشيطان الابيض؟", a: ["جينتوكي"] },
    { q: "رقم هيسوكا؟", a: ["44", "٤٤"] },
    { q: "حبيبة بان؟", a: ["ايلين"] },
    { q: "نائب كايدو؟", a: ["كينغ", "كينج"] },
    { q: "نصف غول؟", a: ["كانيكي", "كين"] },
    { q: "قائد المعجزات؟", a: ["اكاشي"] },
    { q: "ملك الوحوش؟", a: ["كايدو"] },
    { q: "كلب الحمم؟", a: ["اكاينو"] },
    { q: "الرقم ثنين؟", a: ["هوكس"] },
    { q: "اقوى شامان؟", a: ["غوجو"] },
    { q: "اقوى مستخدم نين؟", a: ["نيترو", "نيتيرو"] },
    { q: "ملك النمل؟", a: ["ميرويم"] },
    { q: "ابن البحر؟", a: ["جيمبي", "جينبي"] },
    { q: "زوجت لويد؟", a: ["يور"] },
    { q: "بديل ساسكي؟", a: ["ساي"] },
    { q: "بنت ساسكي؟", a: ["سارادا"] },
    { q: "قاطع الرؤوس؟", a: ["كانكي"] },
    { q: "المحقق النائم؟", a: ["موري"] },
    { q: "نائب لاو؟", a: ["بيبو"] },
    { q: "ابن دراغون؟", a: ["لوفي"] },
    { q: "عين الصقر؟", a: ["ميهوك"] },
    { q: "حبيبة كانيكي؟", a: ["توكا"] },
    { q: "شينيغامي لايت؟", a: ["ريوك"] },
    { q: "تلميذ غاي؟", a: ["لي", "روك"] },
    { q: "ابنة شانكس؟", a: ["اوتا"] },
    { q: "وعاء سوكونا؟", a: ["يوجي", "ايتادوري"] },
    { q: "قاتل كايتو؟", a: ["بيتو"] },
    { q: "طائر تشين؟", a: ["اوكي"] },
    { q: "كلب ماكيما؟", a: ["دينجي"] },
    { q: "اخ شينرا؟", a: ["شو"] },
    { q: "السياف الاسود؟", a: ["غاتس"] }
];

let pools = {
    animeWords: [],
    questions: []
};

const defaultTypes = ['كتابة', 'تفكيك', 'صور', 'ترتيب', 'اسئله', 'تركيب', 'عكس'];

let gameState = {
    active: false,
    paused: false,
    targetPoints: 0,
    chatId: null,
    scores: {},
    activeTypes: [...defaultTypes],
    currentTypeIndex: 0,
    typeRound: 1,
    currentWord: '',
    validAnswers: [],
    currentType: '',
    roundTimer: null,
    acceptingAnswers: false,
    userProgress: {},
    isCountdownPeriod: false,
    countdownMessages: {},
    roundFrozenUsers: new Set()
};

const sleep = ms => new Promise(res => setTimeout(res, ms));

function shuffleString(str) {
    let a = str.split(''), n = a.length;
    for (let i = n - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a.join(' ');
}

function getFormattedUser(rawJid) {
    const users = fs.existsSync(usersPath) ? JSON.parse(fs.readFileSync(usersPath, 'utf8')) : {};
    const cleanJid = rawJid.split('@')[0].split(':')[0];

    const matchedKey = Object.keys(users).find(key => {
        const cleanKey = key.split('@')[0].split(':')[0];
        return key === rawJid || cleanKey === cleanJid;
    });

    if (matchedKey && users[matchedKey]) {
        return { text: users[matchedKey], isMention: false };
    } else {
        return { text: `@${cleanJid}`, isMention: true, jid: rawJid };
    }
}

async function handleCountdownSpam(sock, userId, msg) {
    if (!gameState.active || !gameState.isCountdownPeriod) return;

    gameState.countdownMessages[userId] = (gameState.countdownMessages[userId] || 0) + 1;

    if (gameState.countdownMessages[userId] > 2 && !gameState.roundFrozenUsers.has(userId)) {
        gameState.roundFrozenUsers.add(userId);
        await sock.sendMessage(gameState.chatId, {
            text: '*مجمد*'
        }, { quoted: msg });
    }
}

function checkAnswer(userText, validAnswers, currentType, userId) {
    if (!gameState.acceptingAnswers) return false;
    if (!userText || !validAnswers || !validAnswers.length) return false;

    if (gameState.roundFrozenUsers.has(userId)) {
        return false;
    }

    if (currentType === 'تفكيك') {
        const chars = userText.trim().split(/[^\u0621-\u064A]+/).filter(Boolean);

        return validAnswers.some(ans => {
            const cleanTargetChars = ans.replace(/[^\u0621-\u064A]/g, '').split('');
            if (chars.length !== cleanTargetChars.length) return false;

            const allSingleChars = chars.every(c => c.length === 1);
            if (!allSingleChars) return false;

            return chars.join('') === cleanTargetChars.join('');
        });
    } else if (currentType === 'كتابة') {
        if (!gameState.userProgress[userId]) {
            gameState.userProgress[userId] = [];
        }

        const userWords = userText
            .replace(/[^\u0621-\u064A\s]/g, ' ')
            .split(/\s+/)
            .filter(Boolean);

        validAnswers.forEach(ans => {
            const cleanAns = ans.replace(/[^\u0621-\u064A\s]/g, ' ').trim();
            if (userWords.includes(cleanAns) && !gameState.userProgress[userId].includes(cleanAns)) {
                gameState.userProgress[userId].push(cleanAns);
            }
        });

        return validAnswers.every(ans => gameState.userProgress[userId].includes(ans));
    } else {
        const userWords = userText
            .replace(/[^\u0621-\u064A\s]/g, ' ')
            .split(/\s+/)
            .filter(Boolean);

        return validAnswers.some(ans => {
            const ansWords = ans
                .replace(/[^\u0621-\u064A\s]/g, ' ')
                .split(/\s+/)
                .filter(Boolean);

            if (ansWords.length === 0) return false;

            if (ansWords.length === 1) {
                return userWords.includes(ansWords[0]);
            }

            const targetPhrase = ansWords.join(' ');
            const userPhrase = userWords.join(' ');
            return userPhrase.includes(targetPhrase);
        });
    }
}

// دالة اختيار الصورة مع النقل المباشر للملف الفرعي ومنع التكرار
function getAndMoveRandomImage() {
    let stored = fs.existsSync(storedImagesPath) ? JSON.parse(fs.readFileSync(storedImagesPath, 'utf8')) : [];
    let used = fs.existsSync(usedImagesPath) ? JSON.parse(fs.readFileSync(usedImagesPath, 'utf8')) : [];

    // إذا أصبحت الصور الأساسية فارغة، نقوم بنقل كل الصور الفرعية إلى الأساسية مجدداً
    if (stored.length === 0 && used.length > 0) {
        stored = [...used];
        used = [];
        fs.writeFileSync(storedImagesPath, JSON.stringify(stored, null, 2));
        fs.writeFileSync(usedImagesPath, JSON.stringify([], null, 2));
    }

    if (stored.length === 0) return null;

    // اختيار صورة عشوائية
    const randomIndex = Math.floor(Math.random() * stored.length);
    const selectedImageObj = stored.splice(randomIndex, 1)[0];

    // إضافة الصورة المختارة إلى ملف الصور المستخدمة
    used.push(selectedImageObj);

    // حفظ التحديثات في الملفين
    fs.writeFileSync(storedImagesPath, JSON.stringify(stored, null, 2));
    fs.writeFileSync(usedImagesPath, JSON.stringify(used, null, 2));

    return selectedImageObj;
}

async function nextRound(sock) {
    if (!gameState.active || gameState.paused) return;

    if (gameState.roundTimer) clearTimeout(gameState.roundTimer);
    gameState.acceptingAnswers = false;
    gameState.userProgress = {};

    gameState.countdownMessages = {};
    gameState.roundFrozenUsers.clear(); 
    gameState.isCountdownPeriod = true;

    try {
        const typesToUse = (gameState.activeTypes && gameState.activeTypes.length > 0) ? gameState.activeTypes : defaultTypes;
        const currentType = typesToUse[gameState.currentTypeIndex % typesToUse.length];
        gameState.currentType = currentType;

        if (gameState.typeRound === 1) {
            await sock.sendMessage(gameState.chatId, { text: `*${currentType} استعدو*` });
            await sleep(1000);
        }

        await sock.sendMessage(gameState.chatId, { text: '*3 2 1*' });
        await sleep(1000);

        if (currentType === 'صور') {
            const selectedImageObj = getAndMoveRandomImage();

            if (!selectedImageObj) {
                advanceType();
                return nextRound(sock);
            }

            gameState.validAnswers = [...selectedImageObj.names];

            await sock.sendMessage(gameState.chatId, {
                forward: selectedImageObj.messageObject,
                caption: `*صور ${gameState.typeRound}*`
            });

        } else if (currentType === 'اسئله') {
            if (pools.questions.length === 0) {
                pools.questions = [...questionsList];
            }
            const randomIndex = Math.floor(Math.random() * pools.questions.length);
            const randomItem = pools.questions.splice(randomIndex, 1)[0];
            gameState.validAnswers = [...randomItem.a];

            await sock.sendMessage(gameState.chatId, {
                text: `*اسئله ${gameState.typeRound}*\n\n*${randomItem.q}*`
            });

        } else if (currentType === 'كتابة') {
            if (pools.animeWords.length < 2) {
                pools.animeWords = [...animeList];
            }

            const idx1 = Math.floor(Math.random() * pools.animeWords.length);
            const word1 = pools.animeWords.splice(idx1, 1)[0];

            const idx2 = Math.floor(Math.random() * pools.animeWords.length);
            const word2 = pools.animeWords.splice(idx2, 1)[0];

            gameState.validAnswers = [word1, word2];

            await sock.sendMessage(gameState.chatId, {
                text: `*كتابة ${gameState.typeRound}*\n\n*${word1} ${word2}*`
            });

        } else {
            let word = '';

            if (pools.animeWords.length === 0) {
                pools.animeWords = [...animeList];
            }
            const randomIndex = Math.floor(Math.random() * pools.animeWords.length);
            word = pools.animeWords.splice(randomIndex, 1)[0];

            gameState.currentWord = word;

            let promptText = '';
            let answer = '';

            switch (currentType) {
                case 'تفكيك':
                    promptText = word;
                    answer = word.split('').join(' ');
                    break;
                case 'ترتيب':
                    let shuffled = shuffleString(word);
                    while (shuffled.replace(/ /g, '') === word && word.length > 1) {
                        shuffled = shuffleString(word);
                    }
                    promptText = shuffled;
                    answer = word;
                    break;
                case 'تركيب':
                    promptText = word.split('').join(' ');
                    answer = word;
                    break;
                case 'عكس':
                    promptText = word;
                    answer = word.split('').reverse().join('');
                    break;
            }

            gameState.validAnswers = [answer];

            await sock.sendMessage(gameState.chatId, {
                text: `*${currentType} ${gameState.typeRound}*\n\n*${promptText}*`
            });
        }

        gameState.isCountdownPeriod = false;
        gameState.acceptingAnswers = true;

        gameState.roundTimer = setTimeout(async () => {
            if (!gameState.active || gameState.paused || !gameState.acceptingAnswers) return;
            gameState.acceptingAnswers = false;

            try {
                await sock.sendMessage(gameState.chatId, { text: 'تم إلغاء الجولة' });
                await sleep(500);
                advanceType();
                nextRound(sock);
            } catch (err) {
                console.error("خطأ شبكة أثناء إلغاء الجولة، تم إيقاف الفعالية مؤقتاً:", err);
                gameState.paused = true;
            }
        }, 10000);

    } catch (error) {
        console.error("حدث خطأ في الاتصال، تم إيقاف الفعالية مؤقتاً لحماية التيرمكس:", error);
        gameState.paused = true;
    }
}

function advanceType() {
    gameState.typeRound++;
    if (gameState.typeRound > 5) {
        gameState.typeRound = 1;
        const typesToUse = (gameState.activeTypes && gameState.activeTypes.length > 0) ? gameState.activeTypes : defaultTypes;
        gameState.currentTypeIndex = (gameState.currentTypeIndex + 1) % typesToUse.length;
    }
}

module.exports = {
    gameState,
    sleep,
    getFormattedUser,
    handleCountdownSpam,
    checkAnswer,
    nextRound,
    advanceType,
    defaultTypes
};
