const mongoose = require('mongoose');

// Define Schemes
const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  pw: { type: String, required: true, trim: true },
  name: { type: String, required: true },
  devices: [ String ]
});

// Create Model & Export
module.exports = mongoose.model('User', userSchema);
