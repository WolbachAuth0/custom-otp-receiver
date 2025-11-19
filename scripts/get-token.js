const path = require('path')
// import the env variables FIRST - Before you do anything else
require('dotenv').config({ path: path.join(__dirname, './../.env') });

const axios = require('axios');

getToken()

async function getToken () {
  const request = {
    method: 'post',
    url: `${process.env.AUTH0_DOMAIN}/oauth/token`,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    data: new URLSearchParams({
      client_id: process.env.M2M_CLIENT_ID,
      client_secret: process.env.M2M_CLIENT_SECRET,
      audience: process.env.AUDIENCE,
      grant_type: 'client_credentials'
    })
  }
  const response = await axios(request)

  console.log('response.data', response.data)
}

