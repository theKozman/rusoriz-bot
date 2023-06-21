import { Composer } from 'grammy';
import { ECommands, TCustomContext } from '../types';
import { EPhrases } from '../phrases';
import { groupConfigKeyboard } from '../menus';

export const start = new Composer<TCustomContext>();
export const config = new Composer<TCustomContext>();

start.command(ECommands.START, (ctx) => {
  ctx.reply(EPhrases.START);
});

config.command(ECommands.CONFIG, (ctx) => {
  ctx.reply(
    `
    Режим відповіді на російську: ${ctx.session.onDetectMode}\nЗмінити режим:
    `,
    { reply_markup: groupConfigKeyboard }
  );
});
