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
  // Start server first so Render passes the port binding check
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    
    // Attempt to sync database with retries for cloud deployments (like Render)
    const syncDB = async (retries = 5) => {
      while (retries > 0) {
        try {
          await sequelize.sync({ alter: true });
          console.log('Database synced successfully');
          break;
        } catch (err) {
          console.error(`Failed to sync database. Retries left: ${retries - 1}. Error:`, err.message);
          retries -= 1;
          if (retries > 0) {
            // Wait 5 seconds before retrying
            await new Promise(res => setTimeout(res, 5000));
          } else {
            console.error('Could not connect to database after maximum retries.');
          }
        }
      }
    };
    
    syncDB();
  });
}

module.exports = app;
