const mongoose = require('mongoose');

// Define Schemes
const deviceInfo = new mongoose.Schema({
  id: { type: String, required: true },
  regTime: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  pw: { type: String, required: true, trim: true },
  name: { type: String, required: true },
  devices: [ deviceInfo ]
});

// Get user by user id
userSchema.statics.getUserByUserId = function(user_id) {
  return this.findOne({ id: user_id });
}

// Add device info by user id
userSchema.statics.addDeviceInfoByUserId = function(user_id, device_id) {
  return this.findOneAndUpdate(
    { id: user_id },
    { $push: {devices: {id: device_id}} }
  )
}

// Create Model & Export
module.exports = mongoose.model('User', userSchema);
