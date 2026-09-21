import { BskyAgent } from '@atproto/api';

const USERNAME = process.env.BLUESKY_USER;
const PASSWORD = process.env.BLUESKY_PASS;

if (!USERNAME || !PASSWORD) {
  console.error('Ошибка: не заданы логин или пароль в переменных окружения!');
  process.exit(1);
}

const agent = new BskyAgent({ service: 'https://bsky.social' });

// Цели для автоматической маркировки (сами враги)
const TARGET_DIDS = [
  'did:plc:mv7rnemycyx4smyragqjtubf', // stevetownsend0.bsky.social
  'did:plc:uac6er53o2pvr5y2qmvaf7hw'  // pef-moderation.org
];

// Паттерны для поиска подсосов (упоминания и ссылки)
const TRIGGER_PATTERNS = [
  'stevetownsend0.bsky.social',
  'pef-moderation.org',
  'did:plc:mv7rnemycyx4smyragqjtubf',
  'did:plc:uac6er53o2pvr5y2qmvaf7hw'
];

async function main() {
  try {
    console.log(`Авторизуемся как ${USERNAME}...`);
    await agent.login({ identifier: USERNAME, password: PASSWORD });
    console.log('Залетели в сессию! 🤝😎🤣');

    // 1. Сначала метим самих главных фигурантов
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

    // 2. Ищем тех, кто постит ссылки или упоминает их, и выдаем метку пособника
    console.log('Сканируем ленту на предмет подсосов и защитников...');
    
    for (const pattern of TRIGGER_PATTERNS) {
      try {
        const searchRes = await agent.app.bsky.feed.searchPosts({
          q: pattern,
          limit: 25
        });

        for (const post of searchRes.data.posts) {
          const authorDid = post.author.did;
          // Себя и главных врагов не трогаем в этом цикле
          if (TARGET_DIDS.includes(authorDid) || authorDid === agent.session?.did) continue;

          console.log(`Найден подсос: ${post.author.handle} (${authorDid}), упоминает ${pattern}`);
          
          await agent.com.atproto.label.createLabel({
            uri: authorDid,
            val: 'pef-sympathizer', // Клеймо пособника
            neg: false
          });
          console.log(`Успешно клеймили защитника: ${post.author.handle}`);
        }
      } catch (searchErr) {
        console.error(`Ошибка при поиске по паттерну "${pattern}":`, searchErr.message);
      }
    }

    console.log('Патруль зачистку закончил, уходим в закат.');

  } catch (err) {
    console.error('Критическая ошибка:', err);
    process.exit(1);
  }
}

main();