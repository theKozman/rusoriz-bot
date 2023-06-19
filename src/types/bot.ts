import { Context, SessionFlavor } from 'grammy';

export type TGroupConfig = {
  onDetectMode: 'deletion' | 'warning' | 'info';
};

export type TCustomContext = Context & SessionFlavor<TGroupConfig>;

export enum ECommands {
  START = 'start',
  CONFIG = 'config',
}
