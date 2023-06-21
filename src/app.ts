import 'dotenv/config';
import { Bot } from 'grammy';
import { TCustomContext } from './types';

const port = process.env.PORT || 3000;

export const bot = new Bot<TCustomContext>(String(process.env.BOT_TOKEN));
