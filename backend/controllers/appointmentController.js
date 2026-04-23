const AppointmentService = require('../services/appointmentService');

class AppointmentController {
  static async book(req, res) {
    try {
      const { vetId, petId, startTime, endTime, reason } = req.body;
      
      if (!vetId || !petId || !startTime || !endTime) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const appointment = await AppointmentService.bookAppointment(
        vetId, 
        petId, 
        new Date(startTime), 
        new Date(endTime), 
        reason
      );

      res.status(201).json(appointment);
    } catch (error) {
      if (error.message.includes('Double Booking')) {
        return res.status(409).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const appointments = await AppointmentService.getAppointments();
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AppointmentController;
