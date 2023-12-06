const express = require('express');

const alertsController = require('../controllers/alerts');

const isAdmin = require('../middleware/is-admin');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post('/', isAdmin, alertsController.create);

router.get('/:userId', isAuth, alertsController.getUserAlerts);

router.patch('/:userId', isAuth, alertsController.updateUserAlerts);

module.exports = router;
