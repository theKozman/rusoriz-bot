import { Composer } from 'grammy';
import { EDetectionModes, ID, TCustomContext } from '../types';
import { EPhrases } from '../phrases';

export const callback = new Composer<TCustomContext>();

callback.on('callback_query:data', async (ctx) => {
  // make sure that only i can change config in gachistan
  // TODO: make only user that added bot able to do that and add permissions?
  if (ctx.chat?.id === ID.gachistan && ctx.from.id !== ID.kozman) return;
  ctx.session.onDetectMode = ctx.callbackQuery.data as EDetectionModes;
  await ctx.answerCallbackQuery({
    text: EPhrases.MODE_CHANGED,
  });
});
