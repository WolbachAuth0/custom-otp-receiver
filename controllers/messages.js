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
    const data = await cache.listAllKeys();
    const message = `Found ${data.length} messages matching your query.`;
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
    const data = await cache.getDataByKey({ key });

    if (!data) {
      const message = `Message with id: ${message_id} not found.`;
      return respond(req, res).notFound({ message });
    }

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
    const response = await cache.setDataByKey({ key, ttl, data: req.body });
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