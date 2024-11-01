export interface IndyBesuModuleConfigOptions {
    chainId: number;
    nodeAddress: string;
}
export declare class IndyBesuModuleConfig {
    readonly chainId: number;
    readonly nodeAddress: string;
    constructor(options: IndyBesuModuleConfigOptions);
}
