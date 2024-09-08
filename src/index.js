const express = require('express');
const { createNotaryAttestation } = require('./attest');
const { queryAttestations } = require('./query');
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
        createNotaryAttestation(tokenId, previousOwner, newOwner);
    res.send(response);
});

app.get('/owner', async (req, res) => {
    let tokenId = req.query['token_id'];
    let owner = await queryAttestations(tokenId);
    res.send(owner);
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});