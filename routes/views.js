const express = require('express');
const router = express.Router();
const controller = require('../controllers/views');

module.exports = router;

router
  .route('/')
  .get(
    controller.messages
  );

router
  .route('/tenants')
  .get(
    controller.tenants
  );

router
  .route('/tenants/:tenant_name')
  .get(
    controller.messages
  );

// router
//   .route('/docs')
//   .get(
//     controller.docs
//   );

// router
//   .route('/openapi')
//   .get(
//     controller.specification
//   );