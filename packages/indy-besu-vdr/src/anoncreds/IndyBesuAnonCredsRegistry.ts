import { KeyType } from '@credo-ts/core'
import type {
  AnonCredsRegistry,
  GetCredentialDefinitionReturn,
  GetRevocationStatusListReturn,
  GetRevocationRegistryDefinitionReturn,
  GetSchemaReturn,
  RegisterCredentialDefinitionOptions,
  RegisterCredentialDefinitionReturn,
  RegisterSchemaReturn,
  RegisterSchemaOptions,
  AnonCredsSchema,
  RegisterRevocationRegistryDefinitionOptions,
  RegisterRevocationRegistryDefinitionReturn,
  RegisterRevocationStatusListOptions,
  RegisterRevocationStatusListReturn,
} from '@credo-ts/anoncreds'
import type { AgentContext } from '@credo-ts/core'
import { Key, CredoError, JsonTransformer } from '@credo-ts/core'
import { CredentialDefinitionRegistry, IndyBesuSigner, SchemaRegistry } from '../ledger'
import { buildCredentialDefinitionId, buildSchemaId } from './AnonCredsUtils'
import { CredentialDefinitionValue } from './Trasformers'

export class IndyBesuAnonCredsRegistry implements AnonCredsRegistry {
  registerRevocationRegistryDefinition(agentContext: AgentContext, options: RegisterRevocationRegistryDefinitionOptions): Promise<RegisterRevocationRegistryDefinitionReturn> {
    throw new Error('Method not implemented.')
  }
  registerRevocationStatusList(agentContext: AgentContext, options: RegisterRevocationStatusListOptions): Promise<RegisterRevocationStatusListReturn> {
    throw new Error('Method not implemented.')
  }
  public methodName = 'indy2'

  public readonly supportedIdentifier = new RegExp('')

  public async getSchema(agentContext: AgentContext, schemaId: string): Promise<GetSchemaReturn> {
    try {
      const schemaRegistry = agentContext.dependencyManager.resolve(SchemaRegistry)

      const schema = (await schemaRegistry.resolveSchema(schemaId)) as AnonCredsSchema

      return {
        schema,
        schemaId,
        resolutionMetadata: {},
        schemaMetadata: {},
      }
    } catch (error) {
      return {
        schemaId,
        resolutionMetadata: {
          error: 'unknownError',
          message: `unable to resolve schema: ${error.message}`,
        },
        schemaMetadata: {},
      }
    }
  }

  public async registerSchema(
    agentContext: AgentContext,
    options: IndyBesuRegisterSchemaOptions
  ): Promise<RegisterSchemaReturn> {
    try {
      const schemaRegistry = agentContext.dependencyManager.resolve(SchemaRegistry)
      const key = Key.fromPublicKeyBase58(options.options.accountKey.publicKeyBase58, options.options.accountKey.keyType)

      const signer = new IndyBesuSigner(key, agentContext.wallet)

      const schemaId = buildSchemaId(options.schema)

      await schemaRegistry.createSchema(schemaId, options.schema, signer)

      return {
        schemaState: {
          state: 'finished',
          schema: options.schema,
          schemaId: schemaId,
        },
        registrationMetadata: {},
        schemaMetadata: {},
      }
    } catch (error) {
      return {
        schemaMetadata: {},
        registrationMetadata: {},
        schemaState: {
          state: 'failed',
          schema: options.schema,
          reason: `Faield registering schema: ${error.message}`,
        },
      }
    }
  }

  public async getCredentialDefinition(
    agentContext: AgentContext,
    credentialDefinitionId: string
  ): Promise<GetCredentialDefinitionReturn> {
    try {
      const credentialDefinitionRegistry = agentContext.dependencyManager.resolve(CredentialDefinitionRegistry)

      const credentialDefinition = await credentialDefinitionRegistry.resolveCredentialDefinition(
        credentialDefinitionId
      )

      return {
        credentialDefinition: {
          issuerId: credentialDefinition.issuerId,
          schemaId: credentialDefinition.schemaId,
          type: 'CL',
          tag: credentialDefinition.tag,
          value: JsonTransformer.deserialize(credentialDefinition.value, CredentialDefinitionValue),
        },
        credentialDefinitionId,
        resolutionMetadata: {},
        credentialDefinitionMetadata: {},
      }
    } catch (error) {
      return {
        credentialDefinitionId,
        resolutionMetadata: {
          error: 'unknownError',
          message: `unable to resolve credential definition: ${error.message}`,
        },
        credentialDefinitionMetadata: {},
      }
    }
  }

  public async registerCredentialDefinition(
    agentContext: AgentContext,
    options: IndyBesuRegisterCredentialDefinitionOptions
  ): Promise<RegisterCredentialDefinitionReturn> {
    try {
      const credentialDefinitionRegistry = agentContext.dependencyManager.resolve(CredentialDefinitionRegistry)

      const createCredentialDefinition = options.credentialDefinition

      const schema = await this.getSchema(agentContext, createCredentialDefinition.schemaId)
      if (!schema.schema) {
        throw new CredoError(`Schema not found for schemaId: ${createCredentialDefinition.schemaId}`)
      }

      const key = Key.fromPublicKeyBase58(options.options.accountKey.publicKeyBase58, options.options.accountKey.keyType)

      const signer = new IndyBesuSigner(key, agentContext.wallet)
      const createCredentialDefinitionId = buildCredentialDefinitionId(createCredentialDefinition)

      await credentialDefinitionRegistry.createCredentialDefinition(
        createCredentialDefinitionId,
        {
          issuerId: createCredentialDefinition.issuerId,
          schemaId: createCredentialDefinition.schemaId,
          credDefType: 'CL',
          tag: createCredentialDefinition.tag,
          value: JsonTransformer.serialize(createCredentialDefinition.value),
        },
        signer
      )

      return {
        credentialDefinitionState: {
          state: 'finished',
          credentialDefinition: options.credentialDefinition,
          credentialDefinitionId: createCredentialDefinitionId,
        },
        registrationMetadata: {},
        credentialDefinitionMetadata: {},
      }
    } catch (error) {
      return {
        credentialDefinitionMetadata: {},
        registrationMetadata: {},
        credentialDefinitionState: {
          state: 'failed',
          credentialDefinition: options.credentialDefinition,
          reason: `unknownError: ${error.message}`,
        },
      }
    }
  }

  getRevocationRegistryDefinition(
    agentContext: AgentContext,
    revocationRegistryDefinitionId: string
  ): Promise<GetRevocationRegistryDefinitionReturn> {
    throw new Error('Method not implemented.')
  }

  getRevocationStatusList(
    agentContext: AgentContext,
    revocationRegistryId: string,
    timestamp: number
  ): Promise<GetRevocationStatusListReturn> {
    throw new Error('Method not implemented.')
  }
}

export interface IndyBesuRegisterSchemaOptions extends RegisterSchemaOptions {
  options: {
    accountKey: {
      publicKeyBase58: string
      keyType: KeyType
    }
  }
}

export interface IndyBesuRegisterCredentialDefinitionOptions extends RegisterCredentialDefinitionOptions {
  options: {
    accountKey: {
      publicKeyBase58: string
      keyType: KeyType
    }
  }
}
