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

/**
 * TODO: handle photos
 * TODO: handle forwarded messages
 * TODO: add admin edit rights
 * TODO: filter forwarded messages, etc
 * TODO: allow setting custom warning message
 */

bot.use(
  session({
    initial: (): TGroupConfig => ({
      onDetectMode: 'warning',
    }),
    storage: freeStorage<TGroupConfig>(bot.token),
  })
);

bot.use(start);

bot.use(config);

bot.use(configCallback);

bot.use(languageDetect);

bot.start({ drop_pending_updates: true });
//main();
