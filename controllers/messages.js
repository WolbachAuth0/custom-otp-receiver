const cache = require('./../models/Cache')
const { v4: uuidv4 } = require('uuid')
const { respond, handleError } = require('./../middleware/responseFormatter');

module.exports = {
  list,
  getById,
  create,
  remove,
  schema: {
    message: {
      type: 'object',
      required: [
        'recipient', 'body', 'timestamp'
      ],
      properties: {
        tenant: { type: 'string' },
        recipient: { type: 'string' },
        body: { type: 'string' },
        sender: { type: 'string' },
        timestamp: { type: 'integer' },
      }
    }
  }
}

// return all messages from the cache
async function list (req, res) {
  try {
    const keys = await cache.listAllKeys();
    const message = `Found ${keys.length} messages matching your query.`;
    
    const data = [];
    for (let key of keys) {
      const jsonStr = await cache.getDataByKey({ key });
      const message_id = key.split(':')[1];
      const msg = Object.assign({ message_id }, JSON.parse(jsonStr));     
      data.push(msg);
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
    const data = Object.assign({ message_id }, JSON.parse(jsonStr));
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
    const result = await cache.setDataByKey({ key, ttl, data: req.body });

    if (result == 'OK') {
      const message = `Created new message with id: ${uuid}.`;
      const data = uuid
      respond(req, res).created({ message, data });
    } else {
      throw new Error(result)
    }
    
  } catch (error) {
    handleError(req, res, error);
  }
}

// remove a message from the cache
async function remove (req, res) {
  try {
    
    const { message_id } = req.params;
    console.log('attempting to delete key:', message_id);
    const data = cache.deleteKeys({ keys: [`message:${message_id}`] });
    const message = `Deleted message with id:${message_id}`;
    respond(req, res).ok({ message, data })
  } catch (error) {
    console.log(error)
    handleError(req, res, error);
  }
}

