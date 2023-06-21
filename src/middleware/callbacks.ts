import { Composer } from 'grammy';
import { EDetectionModes, ID, TCustomContext } from '../types';
import { EPhrases } from '../phrases';

export const configCallback = new Composer<TCustomContext>();

configCallback.on('callback_query:data', async (ctx) => {
  // TODO: make only user that added bot able to do that and add permissions?
  // make sure that only i can change config in gachistan
  console.log(ctx.chat?.id === ID.gachistan);
  console.log(ctx.from?.id !== ID.kozman);
  if (ctx.chat?.id === ID.gachistan && ctx.from.id !== ID.kozman) {
    return await ctx.answerCallbackQuery({
      text: EPhrases.MODE_PERMISSION_DENIED,
    });
  }
  ctx.session.onDetectMode = ctx.callbackQuery.data as EDetectionModes;
  await ctx.answerCallbackQuery({
    text: EPhrases.MODE_CHANGED,
  });
});
