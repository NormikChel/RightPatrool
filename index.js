import { BskyAgent } from '@atproto/api';

const USERNAME = process.env.BLUESKY_USER;
const PASSWORD = process.env.BLUESKY_PASS;

if (!USERNAME || !PASSWORD) {
  console.error('Ошибка: не заданы логин или пароль в переменных окружения!');
  process.exit(1);
}

const agent = new BskyAgent({ service: 'https://bsky.social' });

// Цели для автоматической маркировки
const TARGET_DIDS = [
  'did:plc:mv7rnemycyx4smyragqjtubf', // stevetownsend0.bsky.social
  'did:plc:uac6er53o2pvr5y2qmvaf7hw'  // pef-moderation.org
];

// Паттерны для поиска защитников и подсосов
const TRIGGER_PATTERNS = [
  'stevetownsend0.bsky.social',
  'pef-moderation.org',
  'did:plc:mv7rnemycyx4smyragqjtubf',
  'did:plc:uac6er53o2pvr5y2qmvaf7hw'
];

async function ensureLabelerDefinition() {
  try {
    console.log('Проверяем официальную запись лейбера в профиле...');
    const repo = agent.session?.did;
    
    // Пытаемся получить существующую запись лейбера
    try {
      await agent.com.atproto.repo.getRecord({
        repo: repo,
        collection: 'com.atproto.label.defs',
        rkey: 'self'
      });
      console.log('Запись лейбера уже существует, всё ровно.');
      return;
    } catch (e) {
      console.log('Запись лейбера не найдена, создаем новую...');
    }

    // Создаем дефиницию лейбера в репозитории аккаунта
    await agent.com.atproto.repo.putRecord({
      repo: repo,
      collection: 'com.atproto.label.defs',
      rkey: 'self',
      record: {
        $type: 'com.atproto.label.defs',
        blur: 'content',
        severity: 'alert',
        defaultVisibility: 'hide',
        locales: [
          {
            lang: 'ru',
            name: 'Right Patrol Labeler',
            description: 'Автоматический патруль для фильтрации демагогов и вредителей.'
          }
        ]
      }
    });
    console.log('Официальный статус лейбера успешно прописан в профиле! 🤝😎🤣');
  } catch (err) {
    console.error('Не удалось зарегистрировать дефиницию лейбера:', err.message);
  }
}

async function main() {
  try {
    console.log(`Авторизуемся как ${USERNAME}...`);
    await agent.login({ identifier: USERNAME, password: PASSWORD });
    console.log('Залетели в сессию! 🤝😎🤣');

    // Регистрируем профиль как сервис меток
    await ensureLabelerDefinition();

    // 1. Метим главных фигурантов
    for (const targetDid of TARGET_DIDS) {
      try {
        await agent.com.atproto.label.createLabel({
          uri: targetDid,
          val: 'right-patrol-target',
          neg: false
        });
        console.log(`Пометили главного врага: ${targetDid}`);
      } catch (err) {
        console.error(`Не удалось пометить ${targetDid}:`, err.message);
      }
    }

    // 2. Ищем подсосов по паттернам и выдаем клеймо
    console.log('Сканируем ленту на предмет защитников...');
    
    for (const pattern of TRIGGER_PATTERNS) {
      try {
        const searchRes = await agent.app.bsky.feed.searchPosts({
          q: pattern,
          limit: 25
        });

        for (const post of searchRes.data.posts) {
          const authorDid = post.author.did;
          if (TARGET_DIDS.includes(authorDid) || authorDid === agent.session?.did) continue;

          console.log(`Найден подсос: ${post.author.handle} (${authorDid})`);
          
          await agent.com.atproto.label.createLabel({
            uri: authorDid,
            val: 'pef-sympathizer',
            neg: false
          });
          console.log(`Клеймили защитника: ${post.author.handle}`);
        }
      } catch (searchErr) {
        console.error(`Ошибка при поиске по паттерну "${pattern}":`, searchErr.message);
      }
    }

    console.log('Патруль зачистку закончил.');

  } catch (err) {
    console.error('Критическая ошибка:', err);
    process.exit(1);
  }
}

main();