
const { respond, handleError } = require('./../middleware/responseFormatter');
const { logger } = require('./../models/Logger');

const client = require('./../models/Client')

module.exports = {
  createM2MClient,
  getClientsOfUser,
  getM2MClientById,
  deleteM2MClientById,
  schema: {
    client: {
      type: 'object',
      required: [
        'user_id', 'name'
      ],
      properties: {
        user_id: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
      }
    }
  }
}

/**
 * Create a new M2M client for the user.
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next 
 */
async function createM2MClient (req, res, next) {
  try {
    const user_id = req.body.user_id;
    const name = `OTP-client:${req.body.name}`;
    const { message, data } = await client.create({ user_id, name, description })

    // then update user metadata ...
    const item = { client_id: data.client_id, name, description }
    await client.addClientToUser({ user_id }, item)

    // respond with new client data first ...
    respond(req, res).ok({ message, data });
  } catch (error) {
    handleError(req, res, error);
  }
}

async function getClientsOfUser (req, res, next) {
  try {
    const user_id = req.params.user_id
    const { message, data } = await client.getClientsOfUser(user_id)
    respond(req, res).ok({ message, data });
  } catch (error) {
    handleError(req, res, error);
  }
}

async function getM2MClientById (req, res, next) {
  const client_id = req.params.client_id || null

  const client = new Client()
  const payload = await client.read({ client_id })
  const json = responseFormatter(req, res, payload)
  res.status(payload.status).json(json)
}

async function deleteM2MClientById (req, res, next) {
  const client_id = req.params.client_id
  const user_id = req.user.sub

  const client = new Client()
  const payload = await client.remove({ client_id, user_id })
  const json = responseFormatter(req, res, payload)
  res.status(payload.status).json(json)
}
