// ENV
require('dotenv').config();

const mongoose = require('mongoose');
const readLine = require('readline');

mongoose.Promise = global.Promise;
var rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

// CONNECT TO MONGODB SERVER
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useFindAndModify: false })
  .then(() => {
    console.log('Successfully connected to mongodb');
    save_test_device('sc13150');
    save_test_device('sc13160');
    save_test_user();
  }).catch(e => console.error(e));

rl.on('line', l => {
  if(l === 'test1')
    update_test_device(true);
  else if(l === 'test2')
    update_test_device(false);
  else if(l === 'exit'){
    console.log('bye');
    process.exit();
  } else {
    console.log('not defined test!');
    console.log();
  }
});

function save_test_device(device_id){
  const Device = require('./models/device');

  const test_device = new Device({
    id: device_id,
    is_used: false,
    dr_records: [],
    contacts1: [],
    contacts2: [],
  });

  test_device.save()
    .then(() => console.log(`id: ${device_id} device created!`))
    .catch(e => console.log(`id: ${device_id} device already exist!`));
}

function save_test_user(){
  const User = require('./models/user');

  const test_user = new User({
    id: 'test',
    pw: '1234',
    name: 'Test Member',
    devices: [],
  });

  test_user.save()
    .then(() => console.log('done!'))
    .catch(e => console.log('already exist!'));
}

function update_test_device(is_used){
  const Device = require('./models/device');

  Device.findOneAndUpdate({ id: 'sc13150' }, { is_used: is_used })
    .then(() => {
      console.log('sc13150 is_used updated to ' + is_used);
      console.log();
    }).catch(e => console.log(e));
}
