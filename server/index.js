const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const PORT = 4000;
const app = express();

const accountSid = 'ACf4f9ddf033bc0e0305ff99072afe9a35';
const authToken = 'c3f28ae8610e2202d93009a2492997d7';
const keySid = 'SK06f15069145644bbedacfa9c132fb078';
const secret = 'vaQnavG78Ft60zy0fzvwhnPNJtVO1Z0B';

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
