const express = require('express');
const router = express.Router();
const AppointmentController = require('../controllers/appointmentController');

router.post('/book', AppointmentController.book);
router.get('/', AppointmentController.getAll);

module.exports = router;
