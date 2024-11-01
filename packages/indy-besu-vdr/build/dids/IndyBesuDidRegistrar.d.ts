import { DidDocument } from '@credo-ts/core';
import { AgentContext, Buffer, DidCreateOptions, DidCreateResult, DidDeactivateOptions, DidDeactivateResult, DidRegistrar, DidUpdateOptions, DidUpdateResult, Key } from '@credo-ts/core';
import { IndyBesuEndpoint, VerificationKey } from './DidUtils';
export declare class IndyBesuDidRegistrar implements DidRegistrar {
    readonly supportedMethods: string[];
    create(agentContext: AgentContext, options: IndyBesuDidCreateOptions): Promise<DidCreateResult>;
    update(agentContext: AgentContext, options: IndyBesuDidUpdateOptions): Promise<DidUpdateResult>;
    deactivate(agentContext: AgentContext, options: IndyBesuDidDeactivateOptions): Promise<DidDeactivateResult>;
}
export interface IndyBesuDidCreateOptions extends DidCreateOptions {
    method: 'ethr';
    did?: string;
    didDocument?: DidDocument;
    options?: {
        endpoints?: IndyBesuEndpoint[];
        verificationKeys?: VerificationKey[];
    };
    secret?: {
        didPrivateKey: Buffer;
    };
}
export interface IndyBesuDidUpdateOptions extends DidUpdateOptions {
    options: {
        accountKey: Key;
    };
}
export interface IndyBesuDidDeactivateOptions extends DidDeactivateOptions {
    options: {
        accountKey: Key;
    };
}
