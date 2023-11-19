const express = require('express');

const alertsController = require('../controllers/alerts');

const isAdmin = require('../middleware/is-admin');

const router = express.Router();

router.post('/', isAdmin, alertsController.create);

module.exports = router;
