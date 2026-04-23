const { sequelize, Appointment, Vet } = require('../models');
const { Op } = require('sequelize');

class AppointmentService {
  static async bookAppointment(vetId, petId, startTime, endTime, reason) {
    // Start a transaction
    const transaction = await sequelize.transaction();
    try {
      // 1. Lock the Vet row so concurrent requests for the same vet wait
      const vet = await Vet.findByPk(vetId, { 
        lock: transaction.LOCK.UPDATE, 
        transaction 
      });

      if (!vet) {
        throw new Error('Vet not found');
      }

      // 2. Check for overlapping appointments
      // Overlap logic: A starts before B ends, and A ends after B starts
      const overlap = await Appointment.findOne({
        where: {
          vetId,
          status: 'SCHEDULED',
          [Op.or]: [
            {
              startTime: { [Op.lt]: endTime },
              endTime: { [Op.gt]: startTime }
            }
          ]
        },
        transaction
      });

      if (overlap) {
        throw new Error('Double Booking: The vet is already booked for this time slot');
      }

      // 3. Create the appointment if no overlap
      const appointment = await Appointment.create({
        vetId,
        petId,
        startTime,
        endTime,
        reason,
        status: 'SCHEDULED'
      }, { transaction });

      // 4. Commit transaction
      await transaction.commit();
      return appointment;
    } catch (error) {
      // Rollback transaction in case of any error (e.g., overlapping appointment or DB failure)
      await transaction.rollback();
      throw error;
    }
  }

  static async getAppointments() {
    return Appointment.findAll({
      include: ['Vet', 'Pet']
    });
  }
}

module.exports = AppointmentService;
