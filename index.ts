import { createClient } from '@pinax/antelope-accounts';
import { get_table_by_scope } from './chain';
import * as fs from 'fs';

const CsvFilename = `accounts.csv`;
const CsvFields =[
  'account',
  'creator',
  'bytes',
  'created_at',
  'keys',
  'trx_id',
];


(async () => {
    const client = createClient( "http://yaro-accounts43.mar.eosn.io:8000" );
    fs.writeFileSync(CsvFilename, `${CsvFields.join(',')}\n`, { flag:'a+' });

    while(true) {
      const accounts = await getRandomAcounts();
      const origins = await client.getOrigins(accounts);
      for(const origin of origins) {
        fs.writeFileSync(CsvFilename, `${origin.account},${origin.creator},${origin.bytes},${origin.created_at},${origin.keys.join(' ')},${origin.trx_id}\n`, { flag:'a+' })
        if(!origin.creator) throw new Error(`No creator for ${origin.account}`)
      }
      process.stdout.write('.');
    }
})();


function generateAccountName(): string {
  const characters = "abcdefghijklmnopqrstuvwxyz12345";
  let result = "";
  for (let i = 0; i < 10; i++) { // generate 10 character name
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

async function getRandomAcounts() {
  const acc = generateAccountName();

  const res = await get_table_by_scope('eosio', 'userres', { lower_bound: acc, limit: 50 })
  if(!res?.rows || res.rows.length == 0) throw new Error(`Empty chain response for ${acc}`)

  return res.rows.map((row: any) => row.scope);
}