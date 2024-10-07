const mongoose = require('mongoose');

mongoose
  .connect(process.env.DB_CONNECTION)
  .then(() => console.log('Connected to database!'))
  .catch((error) => {
    console.error('Database connection error:', error.message);
    process.exit(1);
  });

// Connection object to communicate with mongodb
// A refernce to the global default connection
const db = mongoose.connection;

module.exports = db;
