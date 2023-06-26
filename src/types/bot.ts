import { FileFlavor } from '@grammyjs/files';
import { Context, SessionFlavor } from 'grammy';

export type TGroupData = {
  config: {
    onDetectMode: `${EDetectionModes}`;
  };
  cachedMessages: Array<TCachedMessage>;
};

export type TCustomContext = FileFlavor<Context> & SessionFlavor<TGroupData>;

export type TCachedMessage = {
  authorId: number;
  test: string;
};

export enum ECommands {
  START = 'start',
  CONFIG = 'config',
}

export enum EDetectionModes {
  DELETION = 'deletion',
  WARNING = 'warning',
  INFO = 'info',
}
