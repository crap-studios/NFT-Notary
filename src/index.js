const express = require('express');
const { transferOwnership, lendUsageRights, revokeUsageRights } = require('./attest');
const { queryAttestations, queryUsageRights, queryUsageRightsAttestation } = require('./query');
const app = express();

const port = process.env.PORT;

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.post('/attest', async (req, res) => {
    let params = req.query;
    let tokenId = params['token_id'];
    let newOwner = params['new_owner'];
    let previousOwner = await queryAttestations(tokenId);
    let response = await
        transferOwnership(tokenId, previousOwner, newOwner);
    res.send(response);
});

app.get('/owner', async (req, res) => {
    let tokenId = req.query['token_id'];
    let owner = await queryAttestations(tokenId);
    res.send(owner);
});

app.post('/allowance', async (req, res) => {
    let tokenId = req.query['token_id'];
    let owner = req.query['owner'];
    let borrower = req.query['borrower'];
    let allow = req.query['allow'];
    let realOwner = await queryAttestations(tokenId);
    if (realOwner !== owner) res.send("Failure");
    let response = null;
    if (allow == 'true') {
        response = await lendUsageRights(tokenId, borrower);
    }
    else {
        let attestationId = await queryUsageRightsAttestation(tokenId, borrower);
        response = await revokeUsageRights(tokenId, attestationId);
    }
    res.send(response);
});

app.get('/allowance', async (req, res) => {
    let tokenId = req.query['token_id'];
    let user = req.query['borrower'];
    let owner = await queryUsageRights(tokenId, user);
    res.send(owner);
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});