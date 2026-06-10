const checkJWTScopes = require('express-jwt-authz')
const { expressjwt: jwt } = require("express-jwt")
const jwks = require('jwks-rsa')   


/**
 * Verify JWT issued via Authorization Code Flow w/PKCE to user
 * 
 * NOTE: This expects the token issuer to be the custom domain.
 */ 
const verifyJWT = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_CUSTOM_DOMAIN}/.well-known/jwks.json`
  }),
  audience: process.env.AUDIENCE,
  issuer: [
    `https://${process.env.AUTH0_CUSTOM_DOMAIN}/`,
    `https://${process.env.AUTH0_DOMAIN}/`
  ],
  algorithms: ['RS256']
})

function checkJWTPermissions (permissions) {
  const customScopeKey = 'permissions'
  const failWithError = true
  return checkJWTScopes(permissions, { customScopeKey, failWithError })
}

module.exports = {
  verifyJWT,
  checkJWTScopes,
  checkJWTPermissions
}