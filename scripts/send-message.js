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

  const token = {
    data: {
      "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InZ4ZFpwVHdqT0MtZXZsRVVKWFlGOCJ9.eyJpc3MiOiJodHRwczovL2xvZ2luLm90cC5hd29sY3VzdG9tZGVtb3MuY29tLyIsInN1YiI6IktHYUxIeThGTnJCeTJOcVBzYUFRdUVhaXdqeVp5enRCQGNsaWVudHMiLCJhdWQiOiJodHRwczovL290cC5hd29sY3VzdG9tZGVtb3MuY29tL2FwaSIsImlhdCI6MTc4MDkzNjQxNiwiZXhwIjoxNzgxMDIyODE2LCJzY29wZSI6InJlYWQ6bWVzc2FnZXMgZGVsZXRlOm1lc3NhZ2VzIGNyZWF0ZTptZXNzYWdlIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIiwiYXpwIjoiS0dhTEh5OEZOckJ5Mk5xUHNhQVF1RWFpd2p5Wnl6dEIifQ.gErHOk1myRnfD4l0XaxoC9KQq2ImDV4INLrvXwoFdsvwTfB7c0QTYxsbHK0cS9LM1EDFnGVPkAv0eTh2HEtjw0Wq0M4JrqBLdsNzIlK1hfUKWvycn3tPkK-T3aABC6AYXB4LKAtleeQlvcPrN0hpZ2fWRXjfre32FR3YMkXc8Im3lnJWBOwmsebMA55P7vB_V2L3lpMv7VarDB8m1Jrk8cTvK3o9JKjArQ6bOvJ2jzfQM8PiCQGACF-STO4X_eVTFJRyKwM0RkEJMria6vw26hgNb18Rj7wlrD7NCL_YpbCM0OSVlidnllupcMipqDtSGh_8BNCyqwqjC3v9c1bmYA",
      "scope": "read:messages delete:messages create:message",
      "expires_in": 86400,
      "token_type": "Bearer",
      "fromCache": true
    }
  }
  return token

  // const body = {
  //   client_id: process.env.M2M_CLIENT_ID,
  //   client_secret: process.env.M2M_CLIENT_SECRET,
  // }
  // const options = {
  //   timeout: 1000,
  //   headers: [
  //     { 'Content-Type': 'application/json' },
  //     { 'Accept': 'application/json' }
  //   ] 
  // }
  // console.log('Fetching access token.')
  // const response = await axios.post(`${baseURL}/oauth/token`, body, options)
  // return response.data
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
    headers :[
      { 'Authorization': `Bearer ${accessToken}`},
      { 'Content-Type': 'application/json' },
      { 'Accept': 'application/json' }
    ]
  }
  console.log('sending sms messager test message');
  const response = await axios.post(`${baseURL}/api/messages`, body, options);
  return response
}
