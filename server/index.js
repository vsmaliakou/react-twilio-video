const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const PORT = 4000;
const app = express();

const accountSid = '';
const authToken = '';
const keySid = '';
const secret = '';

const client = twilio(accountSid, authToken);

app.use(cors());
app.use(bodyParser.json());

app.post('/token', (req, res) => {
  const { identity } = req.body;

  const token = new twilio.jwt.AccessToken(
    accountSid,
    keySid,
    secret,
    { identity: identity }
  );

  const grant = new twilio.jwt.AccessToken.VideoGrant();
  token.addGrant(grant);

  res.json({ token: token.toJwt() });
});

app.listen(PORT, () => console.log(`server started on port ${PORT}`))
