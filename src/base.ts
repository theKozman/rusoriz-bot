// import { Deta } from 'deta';
// import { TStatRecord } from './types';

// const deta = Deta();

// export const db = deta.Base('rusoriz_db');

// export const createStatsRecord = async (data: TStatRecord) => {
//   const { ...parsedData } = data;
//   try {
//     await db.put(parsedData);
//   } catch (err) {
//     //TODO: Error handling
//     console.error(err);
//     return err;
//   }
// };

// export const listAllRecords = async () => {
//   const { items } = await db.fetch();
//   return items;
// };
