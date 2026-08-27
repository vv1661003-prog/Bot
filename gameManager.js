const fs = require('fs');
const path = require('path');

const animeList = [
    "استا", "اينوي", "اينو", "ارمين", "ايتشيغو", "ايروين", "ايرين", "ابو", "ايلين", "اوي",
    "ازوي", "اسوي", "ايلومي", "اسوما", "اول مايت", "ايرو", "ايرن", "اوسين", "اوكي", "اولمايت",
    "ايسي", "ايتاشي", "ايساغي", "بان", "باين", "بين", "بوا", "بوروتو", "بولما", "بيسكت",
    "بروك", "باكوغو", "باران", "بايرن", "برادلي", "باولي", "بولي", "برولي", "بوف", "براون",
    "بران", "بيكمان", "بيبو", "بيتو", "باتشيرا", "تن تن", "تين", "تيو", "توكيتو", "تانجيرو",
    "توجي", "توغي", "تاسك", "توشيرو", "تاشيغي", "تاشيجي", "توسين", "ترانكس", "تشوبر", "ثورز",
    "ثيو", "ثورفين", "ثورغيل", "ثوركيل", "جين", "جيلال", "جيرايا", "جولي", "جيرين", "جيمبي",
    "جينبي", "جارو", "جارا", "جينوس", "جوليا", "جون", "جيم", "جكارا", "جراي", "جاك",
    "دابي", "دورورو", "دوفلامينغو", "دين", "دوارين", "داروين", "داكي", "دوفي", "دداني", "ديو",
    "دواريمون", "دون", "رين", "ران", "راي", "روي", "ريم", "رام", "ريو", "روني",
    "رينا", "ريما", "رانبو", "زورو", "زورا", "زينو", "زينون", "زوي", "زابوزا", "زيرو",
    "زامس", "زيتسو", "زينيتسو", "ساي", "ساني", "ساسوري", "ساسكي", "ساروتوبي", "سونغ", "سي سي",
    "ساكورا", "سونا", "سانجي", "شين", "شيغاراكي", "شينوبو", "شيكامارو", "شيكاداي", "شيراهوشي", "شينو",
    "شينوا", "شينرا", "شينا", "غين", "غارو", "غارا", "غيوتارو", "غيو", "غينيا", "غابيمارو",
    "غون", "غراي", "غوتين", "في في", "فاي", "فريزا", "فوكسي", "فريرن", "فاران", "فو فو",
    "فرانكي", "رولو", "كين", "كاي", "كروكودايل", "كوكو", "كوكوشيبو", "كرلين", "كيسامي", "كايدو",
    "كينغ", "كوين", "كيد", "كاراسو", "كورونا", "كايزر", "لاو", "ليو", "ليوبولد", "لوفي",
    "ليون", "لورينز", "لولوش", "لوكي", "لوبو", "ماي", "ماكي", "ماكيما", "ميرويم", "ميرا",
    "ميوا", "ميو", "مي مي", "ميكاسا", "ماتشي", "ميرليونا", "مارسي", "موزان", "مارين", "ماين"
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
    { q: "ح حبيبة كانيكي؟", a: ["توكا"] },
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

// ==========================================
// دوال التعامل مع ملفات JSON المحلية (محصنة)
// ==========================================

const readJson = (filename) => {
    try {
        const filePath = path.join(__dirname, filename);
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            if (!data || data.trim() === '') return [];
            const parsed = JSON.parse(data);
            
            if (Array.isArray(parsed)) return parsed;
            if (parsed && typeof parsed === 'object') return [parsed];
        }
    } catch (e) {
        console.error(`خطأ في قراءة الملف ${filename}:`, e);
    }
    return [];
};

const writeJson = (filename, data) => {
    try {
        const filePath = path.join(__dirname, filename);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {
        console.error(`خطأ في كتابة الملف ${filename}:`, e);
    }
};

// ==========================================
// الدوال المحدثة للعمل محلياً
// ==========================================

async function getFormattedUser(rawJid) {
    try {
        const cleanJid = rawJid.split('@')[0].split(':')[0];
        const users = readJson('registered_users.json');
        const userDoc = users.find(u => u.jid === rawJid || u.jid.startsWith(cleanJid));

        if (userDoc && userDoc.nickname) {
            return { text: userDoc.nickname, isMention: false };
        } else {
            return { text: `@${cleanJid}`, isMention: true, jid: rawJid };
        }
    } catch (err) {
        console.error("خطأ جلب بيانات المستخدم:", err);
        const cleanJid = rawJid.split('@')[0].split(':')[0];
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

async function getAndMoveRandomImage() {
    try {
        let images = readJson('stored_images.json');
        let usedImages = readJson('used_images.json');

        if (!images || images.length === 0) return null;

        let available = images.filter(img => !usedImages.includes(img.imageId));

        if (available.length === 0) {
            usedImages = [];
            writeJson('used_images.json', usedImages);
            available = images;
        }

        const randomIndex = Math.floor(Math.random() * available.length);
        const selectedImage = available[randomIndex];

        if (selectedImage) {
            usedImages.push(selectedImage.imageId);
            writeJson('used_images.json', usedImages);
        }

        return selectedImage;
    } catch (err) {
        console.error("خطأ في جلب الصور محلياً:", err);
        return null;
    }
}

async function handleFinishAndUpdateGroup(sock, chatId, winnerJid) {
    try {
        const cleanWinner = winnerJid.split('@')[0].split(':')[0];

        // 1. تحديث الفنشات باستخدام مطابقة الـ JID النظيفة
        let finishes = readJson('finishes.json');
        let finishDoc = finishes.find(f => {
            const cleanF = f.jid.split('@')[0].split(':')[0];
            return cleanF === cleanWinner;
        });

        if (finishDoc) {
            finishDoc.count = (finishDoc.count || 0) + 1;
            finishDoc.jid = winnerJid;
        } else {
            finishes.push({ jid: winnerJid, count: 1 });
        }
        writeJson('finishes.json', finishes);

        // 2. تحديث النقاط
        let totalScores = readJson('total_scores.json');
        for (const [userJid, pts] of Object.entries(gameState.scores)) {
            const cleanUser = userJid.split('@')[0].split(':')[0];
            let scoreDoc = totalScores.find(s => {
                const cleanS = s.jid.split('@')[0].split(':')[0];
                return cleanS === cleanUser;
            });
            if (scoreDoc) {
                scoreDoc.score = (scoreDoc.score || 0) + pts;
                scoreDoc.jid = userJid;
            } else {
                totalScores.push({ jid: userJid, score: pts });
            }
        }
        writeJson('total_scores.json', totalScores);

        // 3. جلب الألقاب والأسماء من registered_users.json
        const allUsers = readJson('registered_users.json');
        const userMap = {};
        allUsers.forEach(u => {
            const clean = u.jid.split('@')[0].split(':')[0];
            userMap[clean] = u.nickname;
        });

        const getNick = (jid) => {
            const clean = jid.split('@')[0].split(':')[0];
            return userMap[clean] || `@${clean}`;
        };

        totalScores.sort((a, b) => b.score - a.score);
        const sortedScores = totalScores.slice(0, 3);
        const top1 = sortedScores[0] ? { name: getNick(sortedScores[0].jid), pts: sortedScores[0].score } : { name: 'لا يوجد', pts: 0 };
        const top2 = sortedScores[1] ? { name: getNick(sortedScores[1].jid), pts: sortedScores[1].score } : { name: 'لا يوجد', pts: 0 };
        const top3 = sortedScores[2] ? { name: getNick(sortedScores[2].jid), pts: sortedScores[2].score } : { name: 'لا يوجد', pts: 0 };

        finishes.sort((a, b) => b.count - a.count);
        const topFinisherDoc = finishes[0];
        const topFinisher = topFinisherDoc ? { name: getNick(topFinisherDoc.jid), count: topFinisherDoc.count } : { name: 'لا يوجد', count: 0 };

        const newDescription = `*╎ᏚᏢᎪᏒᎿᎪ ◟🔆◞ ╎*

*˼‏⚖️˹ •⪼⏌ ⇂ فـكـرة الـجـروب ⇃⎾*

*❏╎بكل بساطة بيساعدك تطور مستواك وتتونس .*

~*❖━━━┄⋄┄━━━╃ 𓆩🔆𓆪 ╄━━━┄⋄┄━━━❖*~

*˼‏⚖️˹ •⪼⏌ ⇂ الـقـوانـيـن ⇃⎾*

*❏╎لا تسب وخلك محترم تُحترم.*
*❏╎لا تسبام نهائيا.*
*❏╎هبد اوامر = طرد مؤقت*
*❏╎يتم تحسين البوت بين كل فتره وفتره واذا كانت هناك نصايح تفضل وقولها.*
*❏╎للتعرف على اوامر البوت ارسل .اوامر*

~*❖━━━┄⋄┄━━━╃ 𓆩🔆𓆪 ╄━━━┄⋄┄━━━❖*~

*˼‏🪽˹ •⪼⏌ ⇂ الــتصـنـيـف ⇃⎾*

*❏ الــنـقـاط.*

*˼‏الاول˹╎${top1.name}*
*النقاط:${top1.pts}*


*˼‏الثاني˹╎${top2.name}*
*النقاط:${top2.pts}*

*˼‏الثالث˹╎${top3.name}*
*النقاط:${top3.pts}*

*❏اقـوى مـفـنـش :${topFinisher.name}*
*الفنشات:${topFinisher.count}*


*عشان تعرف نقاطك وفنشاتك اكتب .رانكي*
~*❖━━━┄⋄┄━━━╃ 𓆩🔆𓆪 ╄━━━┄⋄┄━━━❖*~

*˼‏🪽˹ •⪼⏌ ⇂ الــرابــط ⇃⎾*

*「 https://chat.whatsapp.com/BZVgL9MZwroGBM34haO2DD?s=cl&p=a&mlu=4&amv=0 」*

~*❖━━━┄⋄┄━━━╃ 𓆩🔆𓆪 ╄━━━┄⋄┄━━━❖*~

*❏↵الـمـسـؤول╎دافـنـشـي 🔆*

*╎ᏚᏢᎪᏒᎿᎪ ◟🔆◞ ╎*`;

        await sock.groupUpdateDescription(chatId, newDescription);

    } catch (error) {
        console.error('خطأ أثناء تحديث النقاط والتصنيف في وصف المجموعة محلياً:', error);
    }
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
            const selectedImageObj = await getAndMoveRandomImage();

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
    handleFinishAndUpdateGroup,
    nextRound,
    advanceType,
    defaultTypes
};
