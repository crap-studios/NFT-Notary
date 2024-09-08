const { SignProtocolClient, EvmChains, SpMode } = require("@ethsign/sp-sdk");
const { json } = require("express");
const { privateKeyToAccount } = require("viem/accounts");

let privateKey = process.env.PRIVATE_KEY;

const client = new SignProtocolClient(SpMode.OnChain, {
    chain: EvmChains.baseSepolia,
    account: privateKeyToAccount(privateKey),
});

async function transferOwnership(tokenId, oldOwner, newOwner) {
    try {
        const res = await client.createAttestation({
            schemaId: process.env.SCHEMA_ID,
            data: {
                "token_id": tokenId,
                "previousOwner": oldOwner,
                "newOwner": newOwner
            },
            indexingValue: tokenId
        });
        return "Success";
    } catch (e) {
        console.log(e);
        return "Failed";
    }

};

async function lendUsageRights(tokenId, borrower) {
    try {
        const res = await client.createAttestation({
            schemaId: process.env.LENDER_SCHEMA_ID,
            data: {
                "token_id": tokenId,
                "borrower": borrower
            },
            indexingValue: tokenId
        });
        return "Success";
    } catch (e) {
        console.log(e);
        return "Failed";
    }

};

async function revokeUsageRights(tokenId, attestationId) {
    try {
        const res = await client.revokeAttestation(
            attestationId
        );
        return "Success";
    } catch (e) {
        console.log(e);
        return "Failed";
    }

};

module.exports = { transferOwnership, lendUsageRights, revokeUsageRights };