import { HttpInboundTransport, agentDependencies } from "@credo-ts/node";
import { AskarModule } from "@credo-ts/askar";
import { ariesAskar } from "@hyperledger/aries-askar-nodejs";
import { anoncreds } from "@hyperledger/anoncreds-nodejs";
import { IndyBesuAnonCredsRegistry, IndyBesuDidCreateOptions, IndyBesuDidRegistrar, IndyBesuDidResolver, IndyBesuModule } from '@credo-ts/indy-besu-vdr'
import {
  AnonCredsCredentialFormatService,
  AnonCredsModule,
  LegacyIndyCredentialFormatService,
} from "@credo-ts/anoncreds";
import {
  Agent,
  AutoAcceptCredential,
  ConnectionsModule,
  ConsoleLogger,
  CredentialsModule,
  DidsModule,
  HttpOutboundTransport,
  LogLevel,
  V2CredentialProtocol,
  KeyType,
  Key,
  TypedArrayEncoder,
  CacheModule,
  InMemoryLruCache,
  WsOutboundTransport,
  utils,
} from "@credo-ts/core";
import { indyVdr } from "@hyperledger/indy-vdr-nodejs";
import { GENESIS_TRANSACTIONS } from "./genesis";
import { FullTailsFileService } from "./tails/tails-service";
import axios from "axios";
import * as dotenv from 'dotenv';
dotenv.config();


export const issuer = new Agent({
  
  config: {
    label: "Issuer Agent",
    walletConfig: {
      id: `issuer-agent-id-${utils.uuid()}`,
      key: "issuer-agent-key",
    },
    logger: new ConsoleLogger(LogLevel.debug),
    endpoints: ["http://localhost:6006/didcomm"],
  },
  dependencies: agentDependencies,
  modules: {
    anoncreds: new AnonCredsModule({
      registries: [new IndyBesuAnonCredsRegistry()],
      anoncreds,
      tailsFileService: new FullTailsFileService({
        tailsDirectoryPath:
          process.env.TAILS_DIRECTORY_PATH,
        tailsServerBaseUrl: process.env.TAILS_SERVER_BASE_URL,
      }),
    }),
    askar: new AskarModule({
      ariesAskar,
    }),
    indyBesu: new IndyBesuModule({ chainId: 1337, nodeAddress: 'http://localhost:8545' }),
    dids: new DidsModule({
      registrars: [new IndyBesuDidRegistrar()],
      resolvers: [new IndyBesuDidResolver()],
    }),
    connections: new ConnectionsModule({
      autoAcceptConnections: true,
    }),
    credentials: new CredentialsModule({
      autoAcceptCredentials: AutoAcceptCredential.ContentApproved,
      credentialProtocols: [
        new V2CredentialProtocol({
          credentialFormats: [
            new LegacyIndyCredentialFormatService(),
            new AnonCredsCredentialFormatService(),
          ],
        }),
      ],
    }),
    cache: new CacheModule({
      cache: new InMemoryLruCache({ limit: 100 }),
    }),
  },
});

// Register a simple `WebSocket` outbound transport
issuer.registerOutboundTransport(new WsOutboundTransport());

issuer.registerOutboundTransport(new HttpOutboundTransport());

// Register a simple `Http` outbound transport
issuer.registerInboundTransport(
  new HttpInboundTransport({
    port: 6006,
    path: "/didcomm",
  })
);

// Declara `issuerId` no escopo do módulo para exportá-lo
export let issuerId: string | undefined;
export let didKey: Key | undefined;

export const didRegisterAndImport = async (agent: Agent) => {
  await registerBcovrinDid(agent);
};

const registerBcovrinDid = async (
  agent: Agent,
): Promise<void> => {
  const createdDid = await agent.dids.create<IndyBesuDidCreateOptions>({ method: 'ethr' })
  console.log("createdDid", createdDid)
  const seed = "stringstringstringstringstringst"
  //await importDid(agent, "bcovrin:testnet", String(createdDid), seed);
  //console.log("importDid", importDid);
  issuerId = createdDid.didState.did
  didKey = createdDid.didState.secret?.didKey as Key
};

const importDid = async (
  agent: Agent,
  didMethod: string,
  did: string,
  seed: string
) => {
  await agent.dids.import({
    did: `did:indy:${didMethod}:${did}`,
    overwrite: true,
    privateKeys: [
      {
        keyType: KeyType.Ed25519,
        privateKey: TypedArrayEncoder.fromString(seed),
      },
    ],
  });
};
