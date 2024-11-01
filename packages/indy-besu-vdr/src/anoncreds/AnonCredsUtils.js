"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCredentialDefinitionId = exports.buildSchemaId = void 0;
function buildSchemaId(schema) {
    return `${schema.issuerId}/anoncreds/v0/SCHEMA/${schema.name}/${schema.version}`;
}
exports.buildSchemaId = buildSchemaId;
function buildCredentialDefinitionId(credentialDefinition) {
    return `${credentialDefinition.issuerId}/anoncreds/v0/CLAIM_DEF/${credentialDefinition.schemaId}/${credentialDefinition.tag}`;
}
exports.buildCredentialDefinitionId = buildCredentialDefinitionId;
