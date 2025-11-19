const express = require('express');
const router = express.Router();
const controller = require('../controllers/oauth');
const validate = require('./../middleware/schemaValidator');

module.exports = router;

// router
//   .route('/login')
//   .get(
//     controller.login
//   );

router
  .route('/token')
  .post(
    validate(controller.schema.tokenRequest),
    controller.token
  );