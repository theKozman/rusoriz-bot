import 'dotenv/config';
import { Composer } from 'grammy';
import { detect } from '../ruDetection';
import { ELangs, TCustomContext, TErrorType, TStatRecord } from '../types';
import { EPhrases } from '../phrases';
import { reverse, spellCorrection } from '../utils';
import crypto from 'crypto';
import fs from 'fs';
import { transcribe } from '../whisper';
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
var ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(process.env.FFMPEG_PATH);

export const audioLanguageDetect = new Composer<TCustomContext>();

// ! this mess needs A LOT of refactoring
audioLanguageDetect.on(['message:voice'], async (ctx) => {
  const minute = 60;
  const reject = async (msg: string) => {
    if (ctx.session.onDetectMode !== 'info') return;
    await ctx.reply(`Russian not detected, reason: ${msg}`, { reply_to_message_id: ctx.msg.message_id });
  };

  // Get Audio

  // dont process audios longer than a minute for now
  // duration in seconds
  if (ctx.msg.voice.duration > minute) return;

  const file = await ctx.getFile(); // valid for at least 1 hour
  const path = file.getUrl();

  console.log('ffmpegPath:', ffmpegPath);
  console.log(path);
  const filename = String(crypto.randomBytes(16).toString('hex'));
  const filepath = `./tmp/${filename}.mp3`;
  const outStream = fs.createWriteStream(filepath);

  await new Promise<void>((res) => {
    ffmpeg(path)
      .input(path)
      .audioQuality(96)
      .audioChannels(1)
      .toFormat('mp3')
      .on('error', (error: any) => console.log(`Encoding Error: ${error.message}`))
      .on('exit', () => {
        console.log('Audio recorder exited');
        res();
      })
      .on('close', () => console.log('Audio recorder closed'))
      .on('end', () => {
        console.log('Audio Transcoding succeeded !');
        res();
      })
      .pipe(outStream, { end: true });
  });

  outStream.end();

  // Get Transcription

  const transcript = await transcribe(filepath);

  await new Promise<void>((res) =>
    fs.unlink(filepath, () => {
      res();
    })
  );

  ctx.reply(String(transcript));

  const text = '';

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
          return await tryDetect(correctedText);
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
