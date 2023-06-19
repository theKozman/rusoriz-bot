import { Context, SessionFlavor } from 'grammy';

export type TGroupConfig = {
  onDetectMode: `${EDetectionModes}`;
};

export type TCustomContext = Context & SessionFlavor<TGroupConfig>;

export enum ECommands {
  START = 'start',
  CONFIG = 'config',
}

export enum EDetectionModes {
  DELETION = 'deletion',
  WARNING = 'warning',
  INFO = 'info',
}