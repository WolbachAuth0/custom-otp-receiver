const { httpCodes } = require('../middleware/responseFormatter');

module.exports = {
  messages,
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
    // send fake data to develop page    
    const messages = [
      {
        message_id: "c7784d7d-e1c5-414d-b3de-691abc6c004f",
        recipient: "+14133253439",
        body: "Your phone provider has been configured successfully. Phone notifications will be sent using custom",
        sender: "+1 234 567 8910",
        timestamp: 1763065712534
      },
      {
        message_id: "1bf81eb8-f01d-4624-b77d-4f917d36d3ca",
        recipient: "+14133253439",
        body: "093836 is your verification code for Client Credentials Demo",
        sender: "+1 234 567 8910",
        timestamp: 1763065721101
      }
    ];

    messages.sort((a, b) => b.timestamp - a.timestamp);
    // send data to template and render
    const data = {
      messages
    }
    res.render('develop', data);
  } catch (error) {
    handleError(req, res, error);
  }
}