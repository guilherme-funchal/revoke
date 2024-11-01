export interface IndyBesuModuleConfigOptions {
  chainId: number
  nodeAddress: string
}

export class IndyBesuModuleConfig {
  public readonly chainId!: number
  public readonly nodeAddress!: string

  constructor(options: IndyBesuModuleConfigOptions) {
    this.chainId = options.chainId
    this.nodeAddress = options.nodeAddress
  }
}
