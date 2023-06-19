import 'dotenv/config';
import { ECommands, ELangs, TStatRecord } from './types';
import LanguageDetect from 'languagedetect';
import { createStatsRecord } from './base';
import { bot, main } from './app';
import cld from 'cld';

const ld = new LanguageDetect();

const config = {
  ruMaxIndex: 2, // how far down russian should be down possible languages list to be considered detected (starts from 0)
  delta: 1.5, // how different ru and ua weights should be to be considered detected
  precisionPercent: 90, // how precise guess should be to pass
  minScore: 500, // lowest guess score to pass
};

/**
 * TODO: handle photos from bogdan
 * TODO: handle forwarded messages from bogdan
 */

bot.command(ECommands.START, (ctx) => {
  ctx.reply('Бот для розпізнавання і негайного видаляння повідомлень російською в телеграм групах. Для початку роботи потрібно додати бота в групу і надати йому права адміна');
});

bot.on('message:text', async (ctx) => {
  const reject = async (msg: string, data?: TStatRecord) => {
    if (data) {
      data.rejectReason = msg;
      await createStatsRecord(data);
    }
    await ctx.reply(`Russian not detected, reason: ${msg}`, { reply_to_message_id: ctx.msg.message_id });
  };

  let detection;
  try {
    detection = await cld.detect(ctx.message.text);
  } catch (err) {
    return await reject(`Can't detect any language`);
  }

  const ru = detection.languages.find((l) => l.name === ELangs.ru);
  const ua = detection.languages.find((l) => l.name === ELangs.ua);

  // Check if russian is detected
  if (!ru) return await reject(`${ELangs.ru} not found`);

  // Check if message has both ua and ru
  if (ru && ua) return await reject(`Both ${ELangs.ru} and ${ELangs.ua} detected`);

  // Check if precision percent is too low
  if (ru.percent < config.precisionPercent) return await reject(`${ELangs.ru} precision percent is too low`);

  // Check if score is high enough
  if (ru.score < config.minScore) return await reject(`${ELangs.ru} guess score is too low`);

  console.log(detection);
  await ctx.reply(`detected language: ${ru.name};\nreliable: ${detection?.reliable};\npercent: ${detection?.languages[0].percent};\nscore: ${detection?.languages[0].score}`, { reply_to_message_id: ctx.msg.message_id });
});

bot.start();
//main();
