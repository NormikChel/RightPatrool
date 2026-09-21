import { BskyAgent } from '@atproto/api';

const USERNAME = process.env.BLUESKY_USER;
const PASSWORD = process.env.BLUESKY_PASS;

if (!USERNAME || !PASSWORD) {
  console.error('Ошибка: не заданы логин или пароль в переменных окружения!');
  process.exit(1);
}

const agent = new BskyAgent({ service: 'https://bsky.social' });

async function main() {
  try {
    console.log(`Пробуем авторизоваться как ${USERNAME}...`);
    
    await agent.login({
      identifier: USERNAME,
      password: PASSWORD,
    });

    console.log('Успешно залетели в сессию Bluesky! 🤝😎🤣');

    // ТВОЯ ЛОГИКА ЛЕЙБЕРА ЗДЕСЬ
    // Например: поиск аккаунтов, проверка по спискам и выдача меток
    console.log('Скрипт отработал штатно, уходим в закат.');

  } catch (err) {
    console.error('Ошибка при работе лейбера:', err);
    process.exit(1);
  }
}

main();