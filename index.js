const express = require('express');
const { createNotaryAttestation } = require('./attest');
const app = express();

const port = process.env.PORT;

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.get('/attest', async (req, res) => {
    let params = req.params;
    let tokenId = params['token_id'];
    let newOwner = params['new_owner'];
    let response = await
        createNotaryAttestation(52, '0x0a36550aA7233CF7a92cA3fA3df0279148a4a2C9', '0x8aEfD4112B7Db84B38aeA9354C0bd6e6Dd9620bf');
    res.send(response);

});

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});