/**
* Handler to be executed while sending a phone notification*
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {CustomPhoneProviderAPI} api - Methods and utilities to help change the behavior of sending a phone notification.
*/
exports.onExecuteCustomPhoneProvider = async (event, api) => {
  console.log('sms messager action');
  const axios = require('axios');
  const url = 'https://otp.awolcustomdemos.com/api/messages'
  const now = new Date();
  const body = {
      tenant: event.tenant.id,
      recipient: event.notification.recipient,
      body: event.notification.as_text,
      sender:"+1 234 567 8910",
      timestamp:  now.getTime()
  }
  const result = await axios.post(url, body);
  console.log('result', result)
  return;
};