const express = require('express');
const router = express.Router();
const controller = require('../controllers/messages');
// const { verifyJWT, checkJWTScopes } = require('../middleware/auth');
const validate = require('./../middleware/schemaValidator');

const options = {
    customScopeKey: 'scope',
    customUserKey: 'auth',
    failWithError: true
  }

module.exports = router

router
  .route('/messages')
  // .all(verifyJWT)
  .get(
    // checkJWTScopes(['read:messages'], options),
    controller.list
  )
  .post(
    // checkJWTScopes(['create:messages'], options),
    controller.create
  )

router
  .route('/messages/:message_id')
  // .all(verifyJWT)
  .get(
    // checkJWTScopes(['read:messages'], options),
    controller.getById
  )
  .delete(
    // checkJWTScopes(['delete:messages'], options),
    controller.remove
  )