import cld from 'cld';
import { ELangs, TErrorType } from '../types';
import { config } from '../config';
import { ruSymbols, uaSymbols } from '../constants';

const fail = (type: TErrorType, msg: string) => {
  return {
    type,
    msg: new Error(msg),
  };
};

export const detect = async (text: string) => {
  let options: { languageHint?: string } = {};
  let detection;

  // hint detection based on unique letters
  const ruMatch = text.match(ruSymbols) || [];
  const uaMatch = text.match(uaSymbols) || [];
  if (ruMatch > uaMatch) options.languageHint = ELangs.ru;
  if (ruMatch < uaMatch) options.languageHint = ELangs.ua;
  try {
    detection = await cld.detect(text, options || undefined);
  } catch (err) {
    throw fail('no-lang-found', `Can't detect any language`);
  }

  const ru = detection.languages.find((l) => l.name === ELangs.ru);
  const ua = detection.languages.find((l) => l.name === ELangs.ua);
  const en = detection.languages.find((l) => l.name === ELangs.en);

  // Check if russian is detected
  if (!ru) throw { type: '', msg: new Error(`${ELangs.ru} not found, got ${detection.languages[0].name}`) };

  // Check if message has both ua and ru
  if (ru && ua) throw new Error(`Both ${ELangs.ru} and ${ELangs.ua} detected`);

  // Check if precision percent is too low
  if (ru.percent < config.precisionPercent) throw new Error(`${ELangs.ru} precision percent is too low (${ru.percent})`);

  // Check if score is high enough
  if (ru.score < config.minScore) throw new Error(`${ELangs.ru} guess score is too low (${ru.score})`);

  return { detection, ru, ua, en };
};
