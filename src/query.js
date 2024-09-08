const axios = require('axios');
const { decodeAbiParameters } = require("viem");

async function makeAttestationRequest(options) {
    const url = `https://testnet-rpc.sign.global/api/index/attestations`;
    const res = await axios.request({
        url,
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        },
        ...options,
    });
    if (res.status !== 200) {
        throw new Error(JSON.stringify(res));
    }
    return res.data;
}

async function queryAttestations(tokenId) {
    const response = await makeAttestationRequest({
        method: "GET",
        params: {
            mode: "onchain",
            schemaId: process.env.FULL_SCHEMA_ID,
            indexingValue: tokenId,
        },
    });

    if (!response.success) {
        return null;
    }

    if (response.data?.total === 0) {
        return null;
    }

    let attests = [];


    for (const att of response.data.rows) {
        if (!att.data) continue;

        let parsedData = {};

        try {
            const data = decodeAbiParameters(
                [att.dataLocation === "onchain" ? { components: att.schema.data, type: "tuple" } : { type: "string" }],
                att.data
            );
            parsedData = data[0];
            attests.push(parsedData);
        } catch (error) {
            try {
                const data = decodeAbiParameters(
                    att.dataLocation === "onchain" ? att.schema.data : [{ type: "string" }],
                    att.data
                );
                const obj = {};
                data.forEach((item, i) => {
                    obj[att.schema.data[i].name] = item;
                });
                parsedData = obj;
                attests.push(parsedData);
            } catch (error) {
                continue;
            }
        }
    }

    if (attests.length === 0) {
        return process.env.DEFAULT_OWNER
    }

    return attests[0].newOwner;
}

async function queryUsageRights(tokenId, user) {
    const response = await makeAttestationRequest({
        method: "GET",
        params: {
            mode: "onchain",
            schemaId: process.env.FULL_LENDER_SCHEMA_ID,
            indexingValue: tokenId,
        },
    });

    if (!response.success) {
        return null;
    }

    if (response.data?.total === 0) {
        return null;
    }

    let borrowers = [];


    for (const att of response.data.rows) {
        if (!att.data) continue;

        let parsedData = {};

        try {
            const data = decodeAbiParameters(
                [att.dataLocation === "onchain" ? { components: att.schema.data, type: "tuple" } : { type: "string" }],
                att.data
            );
            parsedData = data[0];
            borrowers.push(parsedData.borrower);
        } catch (error) {
            try {
                const data = decodeAbiParameters(
                    att.dataLocation === "onchain" ? att.schema.data : [{ type: "string" }],
                    att.data
                );
                const obj = {};
                data.forEach((item, i) => {
                    obj[att.schema.data[i].name] = item;
                });
                parsedData = obj;
                borrowers.push(parsedData.borrower);
            } catch (error) {
                continue;
            }
        }
    }

    for (const bor in borrowers) {
        if (bor === user) return true;
    }

    return false;
}

async function queryUsageRightsAttestation(tokenId, user) {
    const response = await makeAttestationRequest({
        method: "GET",
        params: {
            mode: "onchain",
            schemaId: process.env.FULL_LENDER_SCHEMA_ID,
            indexingValue: tokenId,
        },
    });

    if (!response.success) {
        return null;
    }

    if (response.data?.total === 0) {
        return null;
    }

    for (const att of response.data.rows) {
        if (!att.data) continue;

        let parsedData = {};

        try {
            const data = decodeAbiParameters(
                [att.dataLocation === "onchain" ? { components: att.schema.data, type: "tuple" } : { type: "string" }],
                att.data
            );
            parsedData = data[0];
            if(parsedData.borrower === user) return att.attestationId;
        } catch (error) {
            try {
                const data = decodeAbiParameters(
                    att.dataLocation === "onchain" ? att.schema.data : [{ type: "string" }],
                    att.data
                );
                const obj = {};
                data.forEach((item, i) => {
                    obj[att.schema.data[i].name] = item;
                });
                parsedData = obj;
                if (parsedData.borrower === user) return att.attestationId;
            } catch (error) {
                continue;
            }
        }
    }

    return null;
}

module.exports = { queryAttestations, queryUsageRights, queryUsageRightsAttestation };