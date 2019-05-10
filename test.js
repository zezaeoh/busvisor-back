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
    save_test_device();
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

function save_test_device(){
  const Device = require('./models/device');

  const test_device = new Device({
    id: 'sc13150',
    is_used: false,
    dr_records: [],
    contacts1: [{ name: "jaegeon", phone: "01087823829", email: "zezaeoh@gmail.com" }],
    contacts2: [
      { name: "jaegeon", phone: "01087823829", email: "zezaeoh@gmail.com" },
      //{ name: "mina", phone: "", email: "wwft09@ajou.ac.kr"},
      //{ name: "yunseok", phone: "", email: "tall0921@naver.com"},
      //{ name: "yeonsik", phone: "", email: "jk00405@naver.com"},
    ],
  });

  test_device.save()
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
