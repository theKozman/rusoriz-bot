import { Composer } from 'grammy';
import cld from 'cld';
import { detect } from '../utils/ruDetection';
import { ELangs, TCustomContext, TErrorType, TStatRecord } from '../types';
import { config } from '../config';
import { EPhrases } from '../phrases';
import { reverse, spellCorrection } from '../utils';

export const languageDetect = new Composer<TCustomContext>();

languageDetect.on(['message:text', 'edited_message:text', 'message:caption'], async (ctx) => {
  const reject = async (msg: string) => {
    if (ctx.session.onDetectMode !== 'info') return;
    await ctx.reply(`Russian not detected, reason: ${msg}`, { reply_to_message_id: ctx.msg.message_id });
  };

  const text = String(ctx?.message?.text || ctx.update?.edited_message?.text);

  let tried = false;
  const tryDetect = async (
    text: string
  ): Promise<void | {
    detection: DetectLanguage;
    ru: Language;
    ua: Language | undefined;
    en: Language | undefined;
  }> => {
    let result;
    try {
      result = await detect(text);
    } catch (err: any) {
      if (err?.msg && err?.type) {
        const type = err.type as TErrorType;
        if (type === 'no-lang-found') {
          // if no language, high chance it's translit
          // TODO: handle if it's not translit and dictionary somehow converts it to russian
          let correctedText = spellCorrection(reverse(text));
          if (!tried) {
            tried = true;
            return await tryDetect(correctedText);
          }
        }
      }
      return reject(err.msg || `Can't identify error: ${err}`);
    }
    return result;
  };
  const detectResult = await tryDetect(text);

  if (!detectResult) return;

  const { ru, detection } = detectResult;

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
