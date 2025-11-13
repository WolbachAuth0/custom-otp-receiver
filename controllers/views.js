const path = require('path');
const cache = require('../models/Cache');
const { respond, httpCodes } = require('../middleware/responseFormatter');

module.exports = {
  messages,
  docs,
  specification
}

function handleError (req, res, error) {
  let statusCode = 500 // default
  let data = {
    statusCode,
    statusText: httpCodes[statusCode],
    message: 'Server Error',
    imageSRC: '/assets/500-ServerError.png',
  }
  // handle special cases ...
  if (String(error.message).includes('Cast to ObjectId failed')) {
    statusCode = 404
    data = {
      statusCode,
      statusText: httpCodes[statusCode],
      message: 'The resource was not found.',
      imageSRC: '/assets/404-NotFound.png'
    }
  } else if (error?.status == 401) {
    statusCode = 401
    data = {
      statusCode,
      statusText: httpCodes[statusCode],
      message: 'Unauthorized',
      imageSRC: '/assets/401-Unauthorized.png'
    }
  } else if (error?.status == 403) {
    statusCode = 403
    data = {
      statusCode,
      statusText: httpCodes[statusCode],
      message: 'Access denied.',
      imageSRC: '/assets/403-Forbidden.png'
    }
  } else {
    console.log(error)
  }
  
  data.error = error
  res.render('error', data)
}

async function messages (req, res) {
  try {
    // fetch sms messages from queue
    const keys = await cache.listAllKeys();
    
    const messages = [];
    for (let key of keys) {
      const jsonStr = await cache.getDataByKey({ key });
      const message_id = key.split(':')[1];
      const message = Object.assign({ message_id }, JSON.parse(jsonStr));
      messages.push(message)
    }

    // send data to template and render
    const data = {
      messages
    }
    res.render('messages', data);
  } catch (error) {
    handleError(req, res, error);
  }
}

function docs (req, res) {
  res.sendFile(path.join(__dirname, './../views/redoc.html'))
}

function specification (req, res) {
  const message = 'OpenAPI 3.0 specification for the Quotations API.'
  const data = require('../data/openapi.json')
  respond(req, res).ok({ message, data }) 
}

