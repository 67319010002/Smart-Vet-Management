const sequelize = require('../config/database');
const Owner = require('./Owner');
const Pet = require('./Pet');
const Vet = require('./Vet');
const Appointment = require('./Appointment');

// Define Relationships
Owner.hasMany(Pet, { foreignKey: 'ownerId' });
Pet.belongsTo(Owner, { foreignKey: 'ownerId' });

Pet.hasMany(Appointment, { foreignKey: 'petId' });
Appointment.belongsTo(Pet, { foreignKey: 'petId' });

Vet.hasMany(Appointment, { foreignKey: 'vetId' });
Appointment.belongsTo(Vet, { foreignKey: 'vetId' });

module.exports = {
  sequelize,
  Owner,
  Pet,
  Vet,
  Appointment
};
