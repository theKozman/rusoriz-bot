import 'dotenv/config';
import { ECommands, EDetectionModes, ELangs, ID, TGroupConfig, TStatRecord } from './types';
//import { createStatsRecord } from './base';
import { bot } from './app';
import { session } from 'grammy';
import { freeStorage } from '@grammyjs/storage-free';
import { EPhrases } from './phrases';
import { groupConfigKeyboard } from './menus';
import { languageDetect } from './middleware/languageDetect';
import { config, start } from './middleware/commands';
import { configCallback } from './middleware/callbacks';
import { listModels } from './whisper';
import { audioLanguageDetect } from './middleware/audioLanguageDetect';
import { hydrateFiles } from '@grammyjs/files';

/**
 * TODO: handle photos
 * TODO: handle forwarded messages
 * TODO: add admin edit rights
 * TODO: filter forwarded messages, etc
 * TODO: allow setting custom warning message
 * TODO: projects is getting pretty big, rollup maybe?
 */

bot.use(
  session({
    initial: (): TGroupConfig => ({
      onDetectMode: 'warning',
    }),
    storage: freeStorage<TGroupConfig>(bot.token),
  })
);

bot.api.config.use(hydrateFiles(bot.token));

bot.use(start);

bot.use(config);

bot.use(configCallback);

bot.use(languageDetect);

bot.use(audioLanguageDetect);

bot.start({ drop_pending_updates: true });

//main();
