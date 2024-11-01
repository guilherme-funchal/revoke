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
exports.DidRegistry = void 0;
const core_1 = require("@credo-ts/core");
const BaseContract_1 = require("./BaseContract");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const indy2_vdr_1 = require("indy2-vdr");
let DidRegistry = class DidRegistry extends BaseContract_1.BaseContract {
    constructor(client) {
        super(client);
    }
    addDelegate(id, delegateType, delegate, validity, signer) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield indy2_vdr_1.EthrDidRegistry.buildDidAddDelegateTransaction(this.client, signer.address, id, delegateType, delegate, validity);
            return this.signAndSubmit(transaction, signer);
        });
    }
    setAttribute(id, attribute, validity, signer) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield indy2_vdr_1.EthrDidRegistry.buildDidSetAttributeTransaction(this.client, signer.address, id, attribute, validity);
            return this.signAndSubmit(transaction, signer);
        });
    }
    resolveDid(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return indy2_vdr_1.EthrDidRegistry.resolveDid(this.client, id, null);
        });
    }
};
exports.DidRegistry = DidRegistry;
DidRegistry.config = {
    address: '0x0000000000000000000000000000000000018888',
    spec: JSON.parse(fs_1.default.readFileSync(path_1.default.resolve(__dirname, './abi/EthereumExtDidRegistry.json'), 'utf8')),
};
exports.DidRegistry = DidRegistry = __decorate([
    (0, core_1.injectable)()
], DidRegistry);
