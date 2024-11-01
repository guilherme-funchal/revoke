import { AgentContext, DidResolutionResult, DidResolver } from '@credo-ts/core';
export declare class IndyBesuDidResolver implements DidResolver {
    readonly allowsCaching = false;
    readonly supportedMethods: string[];
    resolve(agentContext: AgentContext, did: string): Promise<DidResolutionResult>;
    private updateContext;
}
