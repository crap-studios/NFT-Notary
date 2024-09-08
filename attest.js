const { SignProtocolClient, EvmChains, SpMode } = require("@ethsign/sp-sdk");
const { json } = require("express");
const { privateKeyToAccount } = require("viem/accounts");

let privateKey = process.env.PRIVATE_KEY;

const client = new SignProtocolClient(SpMode.OnChain, {
    chain: EvmChains.baseSepolia,
    account: privateKeyToAccount(privateKey),
});

async function createNotaryAttestation(tokenId, newOwner, oldOwner) {
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
        console.log(res);
        return "Success";
    } catch (e) {
        console.log(e);
        return "Failed";
    }

};

module.exports = { createNotaryAttestation };