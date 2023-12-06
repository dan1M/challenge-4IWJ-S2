const express = require('express');

const alertTypeController = require('../controllers/alert-type');

const isAdmin = require('../middleware/is-admin');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post('/', isAdmin, alertTypeController.create);

router.get('/:alertTypeId', isAuth, alertTypeController.findOne);

module.exports = router;
