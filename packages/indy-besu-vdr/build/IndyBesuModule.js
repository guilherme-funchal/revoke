"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndyBesuModule = void 0;
const IndyBesuModuleConfig_1 = require("./IndyBesuModuleConfig");
const ledger_1 = require("./ledger");
const indy2_vdr_1 = require("indy2-vdr");
class IndyBesuModule {
    constructor(options) {
        this.config = new IndyBesuModuleConfig_1.IndyBesuModuleConfig(options);
    }
    register(dependencyManager) {
        const client = new indy2_vdr_1.LedgerClient(this.config.chainId, this.config.nodeAddress, [ledger_1.DidRegistry.config, ledger_1.SchemaRegistry.config, ledger_1.CredentialDefinitionRegistry.config], null);
        dependencyManager.registerInstance(indy2_vdr_1.LedgerClient, client);
        dependencyManager.registerSingleton(ledger_1.DidRegistry);
        dependencyManager.registerSingleton(ledger_1.SchemaRegistry);
        dependencyManager.registerSingleton(ledger_1.CredentialDefinitionRegistry);
    }
    async initialize(agentContext) {
        const client = agentContext.dependencyManager.resolve(indy2_vdr_1.LedgerClient);
        await client.ping();
    }
}
exports.IndyBesuModule = IndyBesuModule;
//# sourceMappingURL=IndyBesuModule.js.map