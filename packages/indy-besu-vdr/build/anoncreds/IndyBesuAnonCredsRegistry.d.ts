import { KeyType } from '@credo-ts/core';
import type { AnonCredsRegistry, GetCredentialDefinitionReturn, GetRevocationStatusListReturn, GetRevocationRegistryDefinitionReturn, GetSchemaReturn, RegisterCredentialDefinitionOptions, RegisterCredentialDefinitionReturn, RegisterSchemaReturn, RegisterSchemaOptions, RegisterRevocationRegistryDefinitionOptions, RegisterRevocationRegistryDefinitionReturn, RegisterRevocationStatusListOptions, RegisterRevocationStatusListReturn } from '@credo-ts/anoncreds';
import type { AgentContext } from '@credo-ts/core';
export declare class IndyBesuAnonCredsRegistry implements AnonCredsRegistry {
    registerRevocationRegistryDefinition(agentContext: AgentContext, options: RegisterRevocationRegistryDefinitionOptions): Promise<RegisterRevocationRegistryDefinitionReturn>;
    registerRevocationStatusList(agentContext: AgentContext, options: RegisterRevocationStatusListOptions): Promise<RegisterRevocationStatusListReturn>;
    methodName: string;
    readonly supportedIdentifier: RegExp;
    getSchema(agentContext: AgentContext, schemaId: string): Promise<GetSchemaReturn>;
    registerSchema(agentContext: AgentContext, options: IndyBesuRegisterSchemaOptions): Promise<RegisterSchemaReturn>;
    getCredentialDefinition(agentContext: AgentContext, credentialDefinitionId: string): Promise<GetCredentialDefinitionReturn>;
    registerCredentialDefinition(agentContext: AgentContext, options: IndyBesuRegisterCredentialDefinitionOptions): Promise<RegisterCredentialDefinitionReturn>;
    getRevocationRegistryDefinition(agentContext: AgentContext, revocationRegistryDefinitionId: string): Promise<GetRevocationRegistryDefinitionReturn>;
    getRevocationStatusList(agentContext: AgentContext, revocationRegistryId: string, timestamp: number): Promise<GetRevocationStatusListReturn>;
}
export interface IndyBesuRegisterSchemaOptions extends RegisterSchemaOptions {
    options: {
        accountKey: {
            publicKeyBase58: string;
            keyType: KeyType;
        };
    };
}
export interface IndyBesuRegisterCredentialDefinitionOptions extends RegisterCredentialDefinitionOptions {
    options: {
        accountKey: {
            publicKeyBase58: string;
            keyType: KeyType;
        };
    };
}
