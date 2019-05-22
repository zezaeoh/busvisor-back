const mongoose = require('mongoose');

// Define Schemes
const ct_record = new mongoose.Schema({
  ct_time: { type: Date, default: Date.now },
  ct: { type: Number, required: true }
});

const dr_record = new mongoose.Schema({
  dr_type: { type: Number, default: 0 },
  is_driving: { type: Boolean, default: true },
  dr_start_time: { type: Date, default: Date.now },
  dr_end_time: { type: Date },
  ct_records: [ ct_record ]
});

const contact = new mongoose.Schema({
  name: { type: String, require: true },
  phone: { type: String, require: true },
  email: { type: String, require: true },
});

const deviceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  is_used: { type: Boolean, default: false },
  dr_records: [ dr_record ],
  contacts1: [ contact ],
  contacts2: [ contact ]
});

// Create driving record by device id
deviceSchema.statics.startDrivingByDeviceId = function(device_id) {
  return this.findOneAndUpdate(
    { id: device_id }, 
    { $push: {dr_records: {ct_records: []}} } 
  );
};

// Add count history by device id
deviceSchema.statics.addCountByDeviceId = function(device_id, cnt) {
  return new Promise((resolve, reject) => {
    this.findOne({ id: device_id })
      .then( device => {
        device.dr_records[device.dr_records.length - 1]
              .ct_records.push({ ct: cnt });
        device.save();
        resolve();
      }).catch(e => reject(e));
  });
};

// Update driving record end time by device id
deviceSchema.statics.endDrivingByDeviceId = function(device_id) {
  return new Promise((resolve, reject) => {
    this.findOne({ id: device_id })
      .then( device => {
        const record = device.dr_records[device.dr_records.length - 1];
        record.dr_end_time = Date.now();
        if(record.is_driving)
          record.is_driving = false;

        device.save();
        resolve();
      }).catch(e => reject(e));
  });
};

// Update emergency situation by device id
deviceSchema.statics.emergDrivingByDeviceId = function(device_id, emerg_status) {
  return new Promise((resolve, reject) => {
    this.findOne({ id: device_id })
      .then( device => {
        device.dr_records[device.dr_records.length - 1].dr_type = emerg_status;
        device.save();
        resolve(device);
      }).catch(e => reject(e));
  });
};

// Get device by device id
deviceSchema.statics.getDeviceByDeviceId = function(device_id) {
  return this.findOne({ id: device_id });
}

// Get latest status
deviceSchema.statics.getLatestStatusByDrivingId = function(device_id) {
  return new Promise((resolve, reject) => {
    this.findOne({ id: device_id })
      .then( device => {
        const dr = device.dr_records[device.dr_records.length - 1];
        const ct = (dr) ? dr.ct_records[dr.ct_records.length - 1] : null;
        if(!dr)
          resolve({ is_driving: false, dr_type: 0, cnt: 0 });
        else if(!ct)
          resolve({ is_driving: dr.is_driving, dr_type: dr.dr_type, cnt: 0 });
        else
          resolve({ is_driving: dr.is_driving, dr_type: dr.dr_type, cnt: ct.ct });
      }).catch(e => reject(e));
  });
}

// Update emergency contact by device id
deviceSchema.statics.updateEmergencyContactByDeviceId = function(device_id, ec1, ec2) {
  return new Promise((resolve, reject) => {
    this.findOne({ id: device_id })
      .then( device => {
        device.is_used = true;
        device.contacts1 = ec1.map(i => {return {name: i, phone: i, email: i}});
        device.contacts2 = ec2.map(i => {return {name: i, phone: i, email: i}});
        device.save();
        resolve();
      }).catch(e => reject(e));
  });

}

// Create Model & Export
module.exports = mongoose.model('Device', deviceSchema);
