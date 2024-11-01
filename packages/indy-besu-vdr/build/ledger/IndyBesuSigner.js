"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndyBesuSigner = void 0;
const askar_1 = require("@credo-ts/askar");
const core_1 = require("@credo-ts/core");
const ethers_1 = require("ethers");
class IndyBesuSigner {
    constructor(key, wallet) {
        this.key = key;
        this.address = (0, ethers_1.computeAddress)(`0x${core_1.TypedArrayEncoder.toHex(key.publicKey)}`);
        this.wallet = wallet;
    }
    async signTransaction(transaction) {
        const bytesToSign = transaction.getSigningBytes();
        const signature = await this.sign(bytesToSign);
        transaction.setSignature({
            recovery_id: signature.yParity,
            signature: (0, ethers_1.getBytes)((0, ethers_1.concat)([signature.r, signature.s])),
        });
    }
    // Since the Askar library does not return a recovery ID, we have to use the Ethers library for signing.
    async sign(data) {
        if (!(this.wallet instanceof askar_1.AskarWallet)) {
            throw new core_1.CredoError('Incorrect wallete type: Indy-Besu VDR currently only support the Askar wallet');
        }
        const keyEntry = await this.wallet.withSession((s) => s.fetchKey({ name: this.key.publicKeyBase58 }));
        if (!keyEntry) {
            throw new core_1.WalletError('Key entry not found');
        }
        const key = new ethers_1.SigningKey(keyEntry.key.secretBytes);
        const signature = key.sign(data);
        keyEntry.key.handle.free();
        return signature;
    }
}
exports.IndyBesuSigner = IndyBesuSigner;
//# sourceMappingURL=IndyBesuSigner.js.map