import {
  LegacyIndyCredentialFormatService,
  AnonCredsCredentialFormatService,
  AnonCredsModule,
} from "@credo-ts/anoncreds";
import { ariesAskar } from '@hyperledger/aries-askar-nodejs'
import { AskarModule, AskarMultiWalletDatabaseScheme } from '@credo-ts/askar'
import { IndyBesuAnonCredsRegistry, IndyBesuDidCreateOptions, IndyBesuDidRegistrar, IndyBesuDidResolver, IndyBesuModule } from '@credo-ts/indy-besu-vdr'
import {
  Agent,
  AutoAcceptCredential,
  ConnectionsModule,
  ConsoleLogger,
  CredentialsModule,
  HttpOutboundTransport,
  LogLevel,
  V2CredentialProtocol,
  CacheModule,
  InMemoryLruCache,
  WsOutboundTransport,
  utils,
} from "@credo-ts/core";
import { IndyVdrAnonCredsRegistry, IndyVdrModule } from "@credo-ts/indy-vdr";
import { HttpInboundTransport, agentDependencies } from "@credo-ts/node";
import { anoncreds } from "@hyperledger/anoncreds-nodejs";
import { indyVdr } from "@hyperledger/indy-vdr-nodejs";
import { GENESIS_TRANSACTIONS } from "./genesis";

export const holder = new Agent({
  config: {
    label: "Holder Agent",
    walletConfig: {
      id: `holder-agent-id-${utils.uuid()}`,
      key: "holder-agent-key",
    },
    logger: new ConsoleLogger(LogLevel.debug),
    endpoints: ["http://localhost:6007/didcomm"],
  },
  modules: {
    askar: new AskarModule({
      ariesAskar,
    }),
    anoncreds: new AnonCredsModule({
      registries: [new IndyBesuAnonCredsRegistry()],
      anoncreds,
    }),
    indyBesu: new IndyBesuModule({ chainId: 1337, nodeAddress: 'http://localhost:8545' }),
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
  dependencies: agentDependencies,
});

holder.registerInboundTransport(
  new HttpInboundTransport({
    port: 6007,
    path: "/didcomm",
  })
);
holder.registerOutboundTransport(new HttpOutboundTransport());
holder.registerOutboundTransport(new WsOutboundTransport());