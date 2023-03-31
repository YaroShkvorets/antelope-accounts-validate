import { JsonRpc } from 'eosjs';
import { GetTableByScopeResult } from 'eosjs/dist/eosjs-rpc-interfaces';


const rpc = new JsonRpc("http://eos-dev11.mar.eosn.io:8888");

export async function get_table_by_scope(code: string, table: string, options: any = {}): Promise<GetTableByScopeResult> {
    const lower_bound = options.lower_bound;
    const upper_bound = options.upper_bound;
    const limit = options.limit;

    try {
      const result = await rpc.get_table_by_scope( { json: true, code, table, lower_bound, upper_bound, limit } );
      return result;
    } catch (e: any) {
      console.error("getters:get_table_by_scope", {code, table, error: e.json?.error?.details ?? 'get_table_by_scope error'});
    }
    return ({more: false, rows: []} as any)
}
