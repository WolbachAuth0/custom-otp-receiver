const path = require('path')

// import the env variables FIRST - Before you do anything else
require('dotenv').config({ path: path.join(__dirname, './../.env') });

const axios = require('axios');
// const baseURL = 'https://otp.awolcustomdemos.com'
const baseURL = 'http://localhost:3000'

sendMessage()

async function sendMessage () {
  console.log('sending sms messager test message');
  const url = 'https://otp.awolcustomdemos.com/api/messages'
  const now = new Date();
  const body = {
      tenant: 'javascript',
      recipient: '+1 413 325 3439',
      body: 'Test message from custom javascript',
      sender:"+1 234 567 8910",
      timestamp:  now.getTime()
  }
  const result = await axios.post(url, body);
  console.log('result', result)
}


