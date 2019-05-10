const router = require('express').Router();
const Device = require('../models/device');

// get device status
router.get('/device/status/:deviceid', (req, res) => {
  Device.getLatestStatusByDrivingId(req.params.deviceid)
    .then(data => res.json(data))
    .catch(e => console.log(e))
});

module.exports = router;
