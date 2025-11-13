const path = require('path')


// import the env variables FIRST - Before you do anything else
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.join(__dirname, './.env') });
}

const server = require('./server')
const { logger } = require('./models/Logger')
const cache = require('./models/Cache')

startup(server)

async function startup(server) {
  logger.info(`loaded environment variables from ${process.env.NODE_ENV} settings.`)
  logger.info(`starting server in ${process.env.NODE_ENV} mode.`)

  try {
    await cache.connect()
    logger.info(`successfully connected to REDIS`)
  } catch (error) {
    logger.warn('An error occurred while connecting to REDIS.')
    logger.error(error)
  }

  // gracefully handle shutdown
  process.once('SIGINT', async () => { await shutdown(cache) })
  process.once('SIGTERM', async () => { await shutdown(cache) })
  process.once('SIGUSR2', async () => { await shutdown(cache) })

  // serve the api on the same port as the front-end in production, but on a different port in development.
  const port = process.env.NODE_ENV === 'development' ? 4000 : process.env.PORT || 8080
  server.listen(port, () => {
    logger.info(`application is listening on port: ${port}`)
  })
}

/**
 * Gracefully stop the server and release resources (e.g. REDIS connection)
 */
async function shutdown(cache) {
  try {
    logger.info(`Initiate graceful shutdown ...`)
    await cache.disconnect()
    logger.info('Shutdown complete.')
  } catch (error) {
    logger.info('Graceful shutdown wasn\'t graceful ...')
    console.error(error)
  }
  process.kill(process.pid, 'SIGUSR2')
  process.exit()
}

// export the startup and shutdown methods so that unit tests can import them
module.exports = {
  startup,
  shutdown
}
