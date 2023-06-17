export type TStatRecord = {
  messageId: number;
  ruWeight: number;
  ruIndex: number;
  uaWeight: number;
  uaIndex: number;
  message: string;
  rejected: boolean;
  rejectReason?: string;
  config: {
    delta: number;
    ruMaxIndex: number;
  };
};
