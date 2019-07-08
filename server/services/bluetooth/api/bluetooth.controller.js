module.exports = function BluetoothController(bluetoothManager) {
  /**
   * @api {get} /api/v1/service/bluetooth/status Get Bluetooth status
   * @apiName getStatus
   * @apiGroup Bluetooth
   */
  async function getStatus(req, res) {
    res.json({ bluetoothStatus: bluetoothManager.getStatus() });
  }

  /**
   * @api {get} /api/v1/service/bluetooth/peripheral Get Bluetooth discovered peripherals
   * @apiName getPeripherals
   * @apiGroup Bluetooth
   */
  async function getPeripherals(req, res) {
    const peripherals = bluetoothManager.getPeripherals();
    res.json(peripherals);
  }

  /**
   * @api {get} /api/v1/service/bluetooth/peripheral/:uuid Get Bluetooth discovered peripheral by uuid
   * @apiName getPeripheral
   * @apiGroup Bluetooth
   */
  async function getPeripheral(req, res) {
    const { uuid } = req.params;
    const peripheral = bluetoothManager.getPeripheral(uuid);
    if (!peripheral) {
      res.status(404);
    }
    res.json(peripheral);
  }

  /**
   * @api {get} /api/v1/service/bluetooth/brand Get Bluetooth managed brands and models
   * @apiName getBrands
   * @apiGroup Bluetooth
   */
  async function getBrands(req, res) {
    const brands = bluetoothManager.getBrands();
    res.json(brands);
  }

  /**
   * @api {get} /api/v1/service/bluetooth/brand/:brand/:model Get device features managed according to brand and model
   * @apiName getDeviceFeatures
   * @apiGroup Bluetooth
   */
  async function getDeviceFeatures(req, res) {
    const { brand, model } = req.params;
    const features = bluetoothManager.getDeviceFeatures(brand, model);
    res.json(features);
  }

  /**
   * @api {post} /api/v1/service/bluetooth/scan Scan Bluetooth peripherals
   * @apiName scan
   * @apiGroup Bluetooth
   */
  async function scan(req, res) {
    const scanAction = req.body.scan === 'on';
    bluetoothManager.scan(scanAction);
    res.json({ bluetoothStatus: bluetoothManager.getStatus() });
  }

  /**
   * @api {post} /api/v1/service/bluetooth/peripheral/:uuid/connect Connect and get Bluetooth peripheral
   * @apiName connect
   * @apiGroup Bluetooth
   */
  async function connect(req, res) {
    const { uuid } = req.params;
    bluetoothManager.determinePeripheral(uuid);
    res.status(200);
  }

  return {
    'get /api/v1/service/bluetooth/status': {
      authenticated: true,
      controller: getStatus,
    },
    'get /api/v1/service/bluetooth/peripheral': {
      authenticated: true,
      controller: getPeripherals,
    },
    'get /api/v1/service/bluetooth/peripheral/:uuid': {
      authenticated: true,
      controller: getPeripheral,
    },
    'get /api/v1/service/bluetooth/brand': {
      authenticated: true,
      controller: getBrands,
    },
    'get /api/v1/service/bluetooth/brand/:brand/:model': {
      authenticated: true,
      controller: getDeviceFeatures,
    },
    'post /api/v1/service/bluetooth/scan': {
      authenticated: true,
      controller: scan,
    },
    'post /api/v1/service/bluetooth/peripheral/:uuid/connect': {
      authenticated: true,
      controller: connect,
    },
  };
};
