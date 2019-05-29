const router = require('express').Router();
const Device = require('../models/device');
const em = require('../service/EmergencyManager');

router.get('/:deviceid', (req, res) => {
  Device.getDeviceByDeviceId(req.params.deviceid)
    .then((device) => {
      if (!device) return res.sendStatus(404);
      if (!device.is_used) return res.sendStatus(203);
      return res.sendStatus(200);
    })
    .catch(err => { console.log(err); res.sendStatus(500); });
});

router.get('/:deviceid/start', (req, res) => {
  Device.startDrivingByDeviceId(req.params.deviceid)
    .then(() => res.sendStatus(200))
    .catch(err => { console.log(err); res.sendStatus(500); });
});

router.get('/:deviceid/check/:cnt', (req, res) => {
  Device.addCountByDeviceId(req.params.deviceid, req.params.cnt)
    .then(() => res.sendStatus(200))
    .catch(err => { console.log(err); res.sendStatus(500); });
});

router.get('/:deviceid/end', (req, res) => {
  Device.endDrivingByDeviceId(req.params.deviceid)
    .then(() => res.sendStatus(200))
    .catch(err => { console.log(err); res.sendStatus(500); });
});

router.get('/:deviceid/emerg/:status', (req, res) => {
  Device.emergDrivingByDeviceId(req.params.deviceid, req.params.status)
    .then(({contacts1, contacts2, cnt}) => {
      if(req.params.status == 2)
        em.handleEmergency(contacts1, contacts2, cnt);
      res.sendStatus(200);
    }).catch(err => { console.log(err); res.sendStatus(500); });
});

module.exports = router;
