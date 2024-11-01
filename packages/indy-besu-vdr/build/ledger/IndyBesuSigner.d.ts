import { Key, Wallet } from '@credo-ts/core';
import { Transaction } from 'indy2-vdr';
export declare class IndyBesuSigner {
    readonly key: Key;
    readonly address: string;
    private readonly wallet;
    constructor(key: Key, wallet: Wallet);
    signTransaction(transaction: Transaction): Promise<void>;
    private sign;
}
