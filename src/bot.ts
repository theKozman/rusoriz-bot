import 'dotenv/config';
import { Bot, webhookCallback } from 'grammy';
import { ECommands } from './types';

const bot = new Bot(String(process.env.BOT_TOKEN));

bot.command(ECommands.START, (ctx) => {
  ctx.reply('Бот для розпізнавання і негайного видаляння повідомлень російською в телеграм групах. Для початку роботи потрібно додати бота в групу і надати йому права адміна');
});

bot.on('message', (ctx) => {
  const regex = new RegExp(/(([ыЫёЁъЪ])|(ьі))/gi);
  const result = regex.test(String(ctx.message.text));
  if (result) ctx.deleteMessage();
});

export default webhookCallback(bot, 'http');
bot.start();
