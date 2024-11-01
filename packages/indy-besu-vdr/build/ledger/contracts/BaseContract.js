"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseContract = void 0;
class BaseContract {
    constructor(client) {
        this.client = client;
    }
    async signAndSubmit(transaction, signer) {
        await signer.signTransaction(transaction);
        const transactionHash = await this.client.submitTransaction(transaction);
        return this.client.getReceipt(transactionHash);
    }
}
exports.BaseContract = BaseContract;
//# sourceMappingURL=BaseContract.js.map