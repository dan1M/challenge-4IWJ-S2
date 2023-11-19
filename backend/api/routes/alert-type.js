const express = require('express');

const alertTypeController = require('../controllers/alert-type');

const isAdmin = require('../middleware/is-admin');

const router = express.Router();

router.post('/', isAdmin, alertTypeController.create);

module.exports = router;
