const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const appointmentRoutes = require('./routes/appointmentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/appointments', appointmentRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

if (require.main === module) {
  // Sync Database and Start Server
  sequelize.sync({ alter: true })
    .then(() => {
      console.log('Database synced');
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch(err => {
      console.error('Failed to sync database: ', err);
    });
}

module.exports = app;
