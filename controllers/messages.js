const cache = require('./../models/Cache')
const { v4: uuidv4 } = require('uuid')
const { respond, handleError } = require('./../middleware/responseFormatter');

module.exports = {
  list,
  getById,
  create,
  remove,
}

// return all messages from the cache
async function list (req, res) {
  try {
    const keys = await cache.listAllKeys();
    const message = `Found ${keys.length} messages matching your query.`;
    
    const data = [];
    for (let key of keys) {
      const jsonStr = await cache.getDataByKey({ key });
      data.push(JSON.parse(jsonStr));
    }

    respond(req, res).ok({ message, data });
  } catch (error) {
    handleError(req, res, error);
  }
}

// retrieve a message from the cache
async function getById (req, res) {
  try {
    const { message_id } = req.params;
    const key = `message:${message_id}`;
    const jsonStr = await cache.getDataByKey({ key });

    if (!jsonStr) {
      const message = `Message with id: ${message_id} not found.`;
      return respond(req, res).notFound({ message });
    }
    const data = JSON.parse(jsonStr);
    const message = `Found message with id: ${message_id}`;
    respond(req, res).ok({ message, data });
  } catch (error) {
    handleError(req, res, error);
  }
}

// recieve a message and add it to the cache
async function create (req, res) {
  try {
    const uuid = uuidv4();
    const key = `message:${uuid}`;
    const ttl = 3600;
    const message = `Created new message with id: ${uuid}.`;
    const data = await cache.setDataByKey({ key, ttl, data: req.body });
    respond(req, res).created({ message, data });
  } catch (error) {
    handleError(req, res, error);
  }
}

// remove a message from the cache
async function remove (req, res) {
  try {
    const { message_id } = req.params;
    const data = cache.deleteKeys({ keys: [`message:${message_id}`] });
    const message = `Deleted message with id:${message_id}`;
    respond(req, res).ok({ message, data })
  } catch (error) {
    handleError(req, res, error);
  }
}

/*
event.notification

Includes the following properties:

from String. The E.164 compliant phone number for the sender.

locale String. The locale we rendered the message in, for example en_US, as defined in the BCP-47 specification.

message_type String.
The type of message that is being sent, like otp_verify or blocked_account.

Possible values include:

otp_verify
otp_enroll
blocked_account
change_password
password_breach

recipient String. The E.164 compliant phone number for the recipient.

delivery_method Enum. The way the message should be delivered. Could be text or voice.

code String. The One-Time Password for some message_types (e.g. otp_verify, otp_enroll).

as_text String. The rendered text ready to be delivered as a text message.

as_voice String. The rendered text ready to be delivered as a voice text message.
*/