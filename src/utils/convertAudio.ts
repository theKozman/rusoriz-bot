import crypto from 'crypto';
import fs from 'fs';

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
var ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

export const convertAudio = async (path: string) => {
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
      .toFormat('wav')
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

  return filepath;
};
