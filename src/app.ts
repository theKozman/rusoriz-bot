import 'dotenv/config';
import { Bot, webhookCallback } from 'grammy';
import LanguageDetect from 'languagedetect';
import express from 'express';

const port = process.env.PORT || 3000;

export const bot = new Bot(String(process.env.BOT_TOKEN));

export const server = express();

export const main = () => {
  //server middlewares
  server.use(express.json());
  server.get('/', (req, res) => res.send('<h1>welcome!</h1>'));
  server.use(webhookCallback(bot, 'express'));

  server.listen(port, async () => {
    console.log(`server is listening to port ${port}`);

    const webhookUrl = `https://${process.env.DETA_SPACE_APP_HOSTNAME}`;

    await bot.api.deleteWebhook();
    await bot.api.setWebhook(webhookUrl, {
      drop_pending_updates: true,
    });
  });
};
