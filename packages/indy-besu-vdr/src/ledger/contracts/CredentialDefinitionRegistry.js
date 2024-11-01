"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredentialDefinitionRegistry = void 0;
const fs_1 = __importDefault(require("fs"));
const indy2_vdr_1 = require("indy2-vdr");
const path_1 = __importDefault(require("path"));
const BaseContract_1 = require("./BaseContract");
const core_1 = require("@credo-ts/core");
let CredentialDefinitionRegistry = class CredentialDefinitionRegistry extends BaseContract_1.BaseContract {
    constructor(client) {
        super(client);
    }
    createCredentialDefinition(id, credDef, signer) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield indy2_vdr_1.CredentialDefinitionRegistry.buildCreateCredentialDefinitionTransaction(this.client, signer.address, id, credDef);
            return this.signAndSubmit(transaction, signer);
        });
    }
    resolveCredentialDefinition(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return indy2_vdr_1.CredentialDefinitionRegistry.resolveCredentialDefinition(this.client, id);
        });
    }
};
exports.CredentialDefinitionRegistry = CredentialDefinitionRegistry;
CredentialDefinitionRegistry.config = {
    address: '0x0000000000000000000000000000000000004444',
    spec: JSON.parse(fs_1.default.readFileSync(path_1.default.resolve(__dirname, './abi/CredentialDefinitionRegistry.json'), 'utf8')),
};
exports.CredentialDefinitionRegistry = CredentialDefinitionRegistry = __decorate([
    (0, core_1.injectable)()
], CredentialDefinitionRegistry);
