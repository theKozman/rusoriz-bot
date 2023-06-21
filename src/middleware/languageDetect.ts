import { Composer } from 'grammy';
import cld from 'cld';
import { ELangs, TCustomContext, TStatRecord } from '../types';
import { config } from '../config';
import { EPhrases } from '../phrases';

export const languageDetect = new Composer<TCustomContext>();

languageDetect.on(['message:text', 'edited_message:text'], async (ctx) => {
  const reject = async (msg: string, data?: TStatRecord) => {
    if (ctx.session.onDetectMode !== 'info') return;

    if (data) {
      data.rejectReason = msg;
      // await createStatsRecord(data);
    }

    await ctx.reply(`Russian not detected, reason: ${msg}`, { reply_to_message_id: ctx.msg.message_id });
  };

  let detection;
  try {
    detection = await cld.detect(String(ctx.message?.text || ctx.update?.edited_message?.text));
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

  switch (ctx.session.onDetectMode) {
    case 'warning': {
      return await ctx.reply(EPhrases.WARN_RU_USED, { reply_to_message_id: ctx.msg.message_id });
    }
    case 'info': {
      return await ctx.reply(`detected language: ${ru.name};\nreliable: ${detection?.reliable};\npercent: ${detection?.languages[0].percent};\nscore: ${detection?.languages[0].score}`, { reply_to_message_id: ctx.msg.message_id });
    }
    case 'deletion': {
      return await ctx.deleteMessage();
    }
  }
});
