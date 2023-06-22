import { Composer } from 'grammy';
import { TCustomContext } from '../types';
import { reverse } from '../utils';
import { spellCorrection } from '../utils/spellCorrection';

export const deTranslit = new Composer<TCustomContext>();

deTranslit.on('message:text', async (ctx) => {
  const reversed = reverse(String(ctx?.message?.text));
  const corrected = spellCorrection(reversed);
  await ctx.reply(`reversed: ${reversed}\ncorrected: ${corrected}`, { reply_to_message_id: ctx.message.message_id });
});
