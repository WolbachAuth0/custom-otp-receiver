const express = require('express');
const router = express.Router();
const controller = require('../controllers/develop');

module.exports = router;

router
  .route('/')
  .get(
    controller.messages
  );
