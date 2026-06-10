const express = require('express');
const router = express.Router();
const controller = require('../controllers/clients');
const { verifyJWT, checkJWTScopes } = require('../middleware/auth');
const validate = require('./../middleware/schemaValidator');

const options = {
  customScopeKey: 'scope',
  customUserKey: 'auth',
  failWithError: true
}

module.exports = router

router.route('/')
  .all(verifyJWT)
  .post(
    checkJWTScopes(['create:clients'], options),
    // schemaValidator(),
    controller.createM2MClient
  )

router.route('/user/:user_id')
  .all(verifyJWT)
  .get(
    checkJWTScopes(['read:clients'], options),
    controller.getClientsOfUser
  )

router.route('/:client_id')
  .all(verifyJWT)  
  // .get(
  //   checkJWTScopes(['read:clients'], options),
  //   controller.getM2MClientById
  // )
  .delete(
    checkJWTScopes(['delete:clients'], options),
    controller.deleteM2MClientById
  )