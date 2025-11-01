require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors()); // or restrict to your Flutter Web URL
app.use(express.json());

app.post('/runCode', async (req, res) => {
  const { code, language, versionIndex } = req.body;

  if (!code || !language || versionIndex === undefined) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  try {
 const response = await axios.post('https://api.jdoodle.com/v1/execute', {
  clientId: process.env.JOODLE_CLIENT_ID,
  clientSecret: process.env.JOODLE_CLIENT_SECRET,
  script: code,
  language,
  versionIndex: Number(versionIndex)  // ensure this is a number
});


    res.json(response.data); // send JDoodle output back to frontend
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'JDoodle API error', details: err.response?.data });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`JDoodle Proxy running on port ${PORT}`));
