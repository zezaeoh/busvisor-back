const router = require('express').Router();
const Device = require('../models/device');
const User = require('../models/user');

// get device is available
router.get('/device/:deviceid', (req, res) => {
  Device.getDeviceByDeviceId(req.params.deviceid)
    .then((device) => {
      if (!device) return res.sendStatus(404);
      if (device.is_used) return res.sendStatus(203);
      return res.sendStatus(200);
    })
    .catch(err => { console.log(err); res.sendStatus(500); });
});

// get device status
router.get('/device/:deviceid/status', (req, res) => {
  Device.getLatestStatusByDrivingId(req.params.deviceid)
    .then(data => res.json(data))
    .catch(e => { console.log(e); res.sendStatus(500) })
});

// get user information
router.get('/user/:userid', (req, res) => {
  User.getUserByUserId(req.params.userid)
    .then(user =>{
      if(!user) return res.sendStatus(404);
      return res.json(user);
    })
    .catch(e => { console.log(e); res.sendStatus(500) })
});

// add user device information and device emergency contact
router.post('/user/:userid/device', (req, res) => {
  User.addDeviceInfoByUserId(req.params.userid, req.body.device_id)
    .then(() => Device.updateEmergencyContactByDeviceId(req.body.device_id, req.body.ec1, req.body.ec2))
    .then(() => res.sendStatus(200))
    .catch(e => { console.log(e); res.sendStatus(500) })
});

module.exports = router;
