const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const uri = process.env.DATABASE_URL;
console.log('Attempting to connect to database...');

if (!uri) {
  console.error('❌ ERROR: No DATABASE_URL found in your .env file.');
  process.exit(1);
}

console.log('Connecting with URI:', uri.substring(0, 20) + '...'); // Shows a preview

mongoose.connect(uri)
  .then(() => {
    console.log('✅ SUCCESS: MongoDB connected successfully.');
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error('❌ ERROR: Could not connect to MongoDB.');
    console.error(err.message);
    process.exit(1);
  });