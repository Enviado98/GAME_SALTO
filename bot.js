const TelegramBot = require('node-telegram-bot-api');
const token = 'TU_TELEGRAM_BOT_TOKEN'; // <--- Pon tu token
const bot = new TelegramBot(token, { polling: true });

const WEB_APP_URL = 'https://saltar-al-top.onrender.com'; // <--- URL de Render

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, '¡Bienvenido a Saltar al Top! Pulsa el botón para jugar.', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Jugar Saltar al Top', web_app: { url: WEB_APP_URL } }]
      ]
    }
  });
});
