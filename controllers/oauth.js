const http = require('axios')
const cache = require('../models/Cache');
const { respond } = require('../middleware/responseFormatter');
const { logger } = require('../models/Logger');

module.exports = {
  token,
  schema: {
    tokenRequest: {
      type: 'object',
      properties: {
        client_id: { type: 'string' },
        client_secret: { type: 'string' }
      }
    }
  }
}

function handleError (req, res, error) {
  if (error?.status == 400) {
    const message = error.message;
    const data = error?.stack || {}
    respond(req, res).badRequest({ message, data })
  } else if (error?.status == 403) {
    const message = error?.response?.data.error || error.message;
    const data = {
      description: error?.response?.data?.error_description || error.message
    }
    respond(req, res).forbidden({ message, data })
  } else {
    respond(req, res).serverError(error)
  }
}

async function getToken (req, res) {
  // set the cache key to be the client_id + client_secret combination
  // const key = `${req.body.client_id}:${req.body.client_secret}`
  const key = req.body.client_id
  let data = {}
  let payload = {}
  
  try {
    // try to get the token data from the REDIS cache
    data = await cache.getDataByKey({ key })
    if (!data) {
      logger.info(`cache miss! key: ${key}`)
      // if the data wasn't in the cache, then get a new token
      const response = await getM2MToken(req.body)
      // and cache it in REDIS
      payload = response.data
      cache.setDataByKey({ key, ttl: payload.expires_in, data: payload })
      // flag the response as NOT from cache - FOR DEMO PURPOSE ONLY!
      payload.fromCache = false
    } else {
      // we will return the payload to the requestor.
      logger.info(`cache hit! key: ${key}`)
      payload = JSON.parse(data)
      // flag the response as from cache - FOR DEMO PURPOSE ONLY!
      payload.fromCache = true
    }

    res.status(200).json(payload)
  } catch (error) {
    handleError(req, res, error)
  }
}

/**
 * The /oauth/token endpoint is used to fetch an access token with client credentials.
 * 
 * @param {*} req Express.js request object
 * @param {*} res Express.js response object
 */
async function token (req, res) {
  try {
    const response = await getM2MToken(req.body)
    const message = 'Fetched access token from authorization server.'
    const data = response.data
    respond(req, res).ok({ message, data })
  } catch (error) {
    handleError(req, res, error)
  }
}

async function getM2MToken ({ client_id, client_secret }) {
  const request = {
    method: 'post',
    url: `${process.env.AUTH0_CUSTOM_DOMAIN}/oauth/token`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    data: new URLSearchParams({
      client_id,
      client_secret,
      audience: process.env.AUDIENCE,
      grant_type: 'client_credentials'
    })
  }
  const response = await http(request)
  return response
}