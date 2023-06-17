import { listAllRecords } from './base';
import fs from 'fs';

(async () => {
  const result = await listAllRecords();
  fs.writeFile('./output.json', JSON.stringify(result), () => {});
})();
