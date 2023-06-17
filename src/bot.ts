import 'dotenv/config';
import { ECommands, ELangs, TStatRecord } from './types';
import LanguageDetect from 'languagedetect';
import { createStatsRecord } from './base';
import { bot, main } from './app';

const ld = new LanguageDetect();

const config = {
  ruMaxIndex: 2, // how far down russian should be down possible languages list to be considered detected (starts from 0)
  delta: 1.5, // how different ru and ua weights should be to be considered detected
};

/**
 * TODO: handle photos from bogdan
 * TODO: handle forwarded messages from bogdan
 */

bot.command(ECommands.START, (ctx) => {
  ctx.reply('Бот для розпізнавання і негайного видаляння повідомлень російською в телеграм групах. Для початку роботи потрібно додати бота в групу і надати йому права адміна');
});

bot.on('message:text', async (ctx) => {
  // TODO: only direct messages from users
  const reject = async (msg: string, data?: TStatRecord) => {
    if (data) {
      data.rejectReason = msg;
      await createStatsRecord(data);
    }
    await ctx.reply(`Russian not detected, reason: ${msg}`, { reply_to_message_id: ctx.msg.message_id });
  };

  const detection = ld.detect(String(ctx.message.text)) || [];

  if (detection.length === 0) return await reject(`Can't detect any language`);

  const ru = detection.find((l) => l[0] === ELangs.ru);
  const ua = detection.find((l) => l[0] === ELangs.ua);

  if (!ru?.length || !ua?.length) return await reject(`${ELangs.ru} or ${ELangs.ua} not found`);

  const ruIndex = detection.indexOf(ru);
  const uaIndex = detection.indexOf(ua);

  if (ruIndex > uaIndex)
    return reject(`${ELangs.ua}(${uaIndex}) has higher index than ${ELangs.ru}(${ruIndex})`, {
      messageId: ctx.message.message_id,
      ruWeight: ru[1],
      ruIndex,
      uaWeight: ua[1],
      uaIndex,
      message: ctx.message.text,
      rejected: true,
      config,
    });

  if (ruIndex > config.ruMaxIndex)
    return reject(`${ELangs.ru} index is too low (${ruIndex})`, {
      messageId: ctx.message.message_id,
      ruWeight: ru[1],
      ruIndex,
      uaWeight: ua[1],
      uaIndex,
      message: ctx.message.text,
      rejected: true,
      config,
    });

  const delta = ru[1] / ua[1];

  if (delta < config.delta)
    return reject(`Delta is too small (${delta})`, {
      messageId: ctx.message.message_id,
      ruWeight: ru[1],
      ruIndex,
      uaWeight: ua[1],
      uaIndex,
      message: ctx.message.text,
      rejected: true,
      config,
    });

  await createStatsRecord({
    messageId: ctx.message.message_id,
    ruWeight: ru[1],
    ruIndex,
    uaWeight: ua[1],
    uaIndex,
    message: ctx.message.text,
    rejected: false,
    config,
  });

  await ctx.reply(`russian detected\nruIndex: ${ruIndex};\nuaIndex: ${uaIndex}\nruWeight ${ru[1]};\nuaWeight: ${ua[1]}\ndelta: ${delta};`, { reply_to_message_id: ctx.msg.message_id });
});

bot.start();
//main();
