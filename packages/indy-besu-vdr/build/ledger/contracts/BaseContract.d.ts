import { IndyBesuSigner } from '../IndyBesuSigner';
import { LedgerClient, Transaction } from 'indy2-vdr';
export declare class BaseContract {
    protected client: LedgerClient;
    constructor(client: LedgerClient);
    signAndSubmit(transaction: Transaction, signer: IndyBesuSigner): Promise<any>;
}
