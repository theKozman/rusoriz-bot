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

bot.on('callback_query:data', async (ctx) => {
  // make sure that only i can change config in gachistan
  // TODO: make only user that added bot able to do that and add permissions?
  if (ctx.chat?.id === ID.gachistan && ctx.from.id !== ID.kozman) return;
  ctx.session.onDetectMode = ctx.callbackQuery.data as EDetectionModes;
  await ctx.answerCallbackQuery({
    text: EPhrases.MODE_CHANGED,
  });
});

bot.use(languageDetect);

bot.start({ drop_pending_updates: true });
//main();
