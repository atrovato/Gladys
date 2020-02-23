const asyncMiddleware = require('../../../api/middlewares/asyncMiddleware');

module.exports = function BluetoothController(bluetoothManager) {
  /**
   * @api {get} /api/v1/service/bluetooth/status Get Bluetooth status
   * @apiName getStatus
   * @apiGroup Bluetooth
   */
  async function getStatus(req, res) {
    res.json(bluetoothManager.getStatus());
  }

  /**
   * @api {get} /api/v1/service/bluetooth/discover Get Bluetooth discovered peripherals
   * @apiName getDiscoveredDevices
   * @apiGroup Bluetooth
   */
  async function getDiscoveredDevices(req, res) {
    const peripherals = bluetoothManager.getDiscoveredDevices();
    res.json(peripherals);
  }

  /**
   * @api {get} /api/v1/service/bluetooth/discover/:uuid Get Bluetooth discovered peripheral by uuid
   * @apiName getDiscoveredDevice
   * @apiGroup Bluetooth
   */
  async function getDiscoveredDevice(req, res) {
    const { uuid } = req.params;
    const peripheral = bluetoothManager.getDiscoveredDevice(uuid);
    if (peripheral) {
      res.json(peripheral);
    } else {
      res.status(404);
    }
  }

  /**
   * @api {post} /api/v1/service/bluetooth/scan Scan Bluetooth peripherals
   * @apiName scan
   * @apiGroup Bluetooth
   */
  async function scan(req, res) {
    bluetoothManager.scan();
    res.json(bluetoothManager.getStatus());
  }

  return {
    'get /api/v1/service/bluetooth/status': {
      authenticated: true,
      controller: asyncMiddleware(getStatus),
    },
    'get /api/v1/service/bluetooth/discover': {
      authenticated: true,
      controller: asyncMiddleware(getDiscoveredDevices),
    },
    'get /api/v1/service/bluetooth/discover/:uuid': {
      authenticated: true,
      controller: asyncMiddleware(getDiscoveredDevice),
    },
    'post /api/v1/service/bluetooth/scan': {
      authenticated: true,
      controller: asyncMiddleware(scan),
    },
  };
};
