"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndyBesuDidResolver = void 0;
const core_1 = require("@credo-ts/core");
const ledger_1 = require("../ledger");
const DidUtils_1 = require("./DidUtils");
class IndyBesuDidResolver {
    constructor() {
        this.allowsCaching = false;
        this.supportedMethods = ['ethr'];
    }
    async resolve(agentContext, did) {
        var _a, _b, _c;
        const didRegistry = agentContext.dependencyManager.resolve(ledger_1.DidRegistry);
        try {
            const result = await didRegistry.resolveDid(did);
            agentContext.config.logger.trace(`Resolved DID: ${JSON.stringify(result)}`);
            console.log(result);
            const didDocument = new core_1.DidDocument(result.didDocument);
            // JSON-LD credential issuance won't work if 'https://w3id.org/security/v3-unstable' context is added
            const context = result.didDocument['@context'].filter((value) => value !== 'https://w3id.org/security/v3-unstable');
            didDocument.context = context;
            didDocument.verificationMethod = (_a = didDocument.verificationMethod) === null || _a === void 0 ? void 0 : _a.map((method) => {
                return new core_1.VerificationMethod(method);
            });
            (_b = didDocument.verificationMethod) === null || _b === void 0 ? void 0 : _b.forEach((method) => {
                this.updateContext(didDocument, method);
            });
            didDocument.service = (_c = didDocument.service) === null || _c === void 0 ? void 0 : _c.map((service) => {
                return new core_1.DidDocumentService(service);
            });
            return {
                didDocument: didDocument,
                didDocumentMetadata: {},
                didResolutionMetadata: {},
            };
        }
        catch (error) {
            return {
                didDocument: null,
                didDocumentMetadata: {},
                didResolutionMetadata: {
                    error: 'unknownError',
                    message: `resolver_error: Unable to resolve did '${did}': ${error}`,
                },
            };
        }
    }
    updateContext(didDocument, method) {
        const keyContext = (0, DidUtils_1.getKeyContext)(DidUtils_1.VerificationKeyType[method.type]);
        if (!didDocument.context.includes(keyContext)) {
            if (Array.isArray(didDocument.context)) {
                didDocument.context.push(keyContext);
            }
            else {
                didDocument.context = [didDocument.context, keyContext];
            }
        }
    }
}
exports.IndyBesuDidResolver = IndyBesuDidResolver;
//# sourceMappingURL=IndyBesuDidResolver.js.map