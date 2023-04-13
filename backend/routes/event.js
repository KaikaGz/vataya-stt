// REQUIRE CONTROLLER
const express = require('express');
const event = require('../controllers/event');
const validate = require('../middlewares/validate');
const eventValidation = require('../validations/event');
const { authenticateJwt } = require('../services/authen');

const router = express.Router();

router.route('/').post(authenticateJwt, validate(eventValidation.post), event.post);
router.route('/getEvent').post(authenticateJwt, validate(eventValidation.getEvent), event.getEvent);
router.route('/getTodayEventHourly').get(authenticateJwt, event.getTodayEventHourly);
router.route('/getOneLatest').get(authenticateJwt, event.getOneLatest);
router.route('/getDaily').post(authenticateJwt, validate(eventValidation.getDaily), event.getDaily);
module.exports = router;
