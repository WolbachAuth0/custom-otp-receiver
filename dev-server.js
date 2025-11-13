const path = require('path')

// import the env variables FIRST - Before you do anything else
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.join(__dirname, './.env') });
}

const express = require('express')
const serveStatic = require('serve-static')
const cors = require('cors')
const helmet = require('helmet')

// Import ErrorHandler
const { globalErrorHandler } = require('./middleware/responseFormatter')
const enforceHTTPS = require('./middleware/enforceHTTPS')
const { routerLogger, errorLogger } = require('./models/Logger')

const app = express()

// middleware ...
app.use(express.json())
app.use(routerLogger)
app.use(cors())
app.use(helmet({ contentSecurityPolicy: false }))

 // Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', './views'); 

// enforce https in production
if(process.env.NODE_ENV === 'production') {
  app.use(enforceHTTPS)
}

// Serve static files from the public directory
app.use('/assets', serveStatic(path.join(__dirname, './public')));

// Routes
app.use('/', require('./routes/develop'));

// override express error handler
app.use('/', require('./routes/errors'));

app.use(globalErrorHandler) 
// express-winston errorLogger AFTER the other routes have been defined.
app.use(errorLogger)

// serve the api on the same port as the front-end in production, but on a different port in development.
const port = process.env.NODE_ENV === 'development' ? 4000 : process.env.PORT || 8080
app.listen(port, () => {
  console.log(`application is listening on port: ${port}`)
})