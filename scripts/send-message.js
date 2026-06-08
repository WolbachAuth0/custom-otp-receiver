const path = require('path')
// import the env variables FIRST - Before you do anything else
require('dotenv').config({ path: path.join(__dirname, './../.env') });

const axios = require('axios');
const baseURL = 'https://otp.awolcustomdemos.com';

main();

async function main () {
  try {
    const tokenResponse = await fetchToken();
    const accessToken = tokenResponse.data.access_token;
    const response = await sendMessage(accessToken);
    console.log(response.data)
  } catch (error) {
    console.log(error);
  }
}

async function fetchToken () {
  const body = {
    client_id: process.env.M2M_CLIENT_ID,
    client_secret: process.env.M2M_CLIENT_SECRET,
  }
  const options = {
    timeout: 1000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }
  console.log('Fetching access token.')
  const response = await axios.post(`${baseURL}/oauth/token`, body, options)
  return response.data
}

async function sendMessage (accessToken) {
  const now = new Date();
  const body = {
    tenant: 'javascript',
    recipient: '+1 413 325 3439',
    body: 'Test message from custom javascript',
    sender:"+1 234 567 8910",
    timestamp:  now.getTime()
  }
  const options = {
    timeout: 1000,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }
  console.log('sending sms messager test message');
  const response = await axios.post(`${baseURL}/api/messages`, body, options);
  return response
}
