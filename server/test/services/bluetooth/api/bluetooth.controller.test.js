const sinon = require('sinon');

const { assert, fake } = sinon;
const BluetoothController = require('../../../../services/bluetooth/api/bluetooth.controller');

const status = { powered: true, scanning: false };
const peripherals = [
  {
    uuid: 'UUID1',
  },
  {
    uuid: 'UUID2',
  },
];

const bluetoothManager = {
  getStatus: fake.returns(status),
  getDiscoveredDevice: fake.returns(null),
  getDiscoveredDevices: fake.returns(peripherals),
  scan: fake.returns(null),
};

const res = {
  json: fake.returns(null),
  status: fake.returns(null),
};

describe('GET /api/v1/service/bluetooth/status', () => {
  beforeEach(() => {
    sinon.reset();
  });

  it('should get status', async () => {
    const bluetoothController = BluetoothController(bluetoothManager);
    const req = {};
    await bluetoothController['get /api/v1/service/bluetooth/status'].controller(req, res);
    assert.calledOnce(bluetoothManager.getStatus);
    assert.calledWith(res.json, status);
  });
});

describe('GET /api/v1/service/bluetooth/peripheral', () => {
  beforeEach(() => {
    sinon.reset();
  });

  it('should get peripherals', async () => {
    const bluetoothController = BluetoothController(bluetoothManager);
    const req = {};
    await bluetoothController['get /api/v1/service/bluetooth/discover'].controller(req, res);
    assert.calledOnce(bluetoothManager.getDiscoveredDevices);
    assert.calledWith(res.json, peripherals);
  });

  it('should get single peripheral', async () => {
    const peripheral = { name: 'any' };
    bluetoothManager.getDiscoveredDevice = fake.returns(peripheral);

    const bluetoothController = BluetoothController(bluetoothManager);
    const req = { params: { uuid: 'uuid' } };
    await bluetoothController['get /api/v1/service/bluetooth/discover/:uuid'].controller(req, res);
    assert.calledWith(bluetoothManager.getDiscoveredDevice, req.params.uuid);
    assert.calledWith(res.json, peripheral);
  });

  it('should fail without peripheral', async () => {
    bluetoothManager.getDiscoveredDevice = fake.returns(null);

    const bluetoothController = BluetoothController(bluetoothManager);
    const req = { params: { uuid: 'uuid1' } };
    await bluetoothController['get /api/v1/service/bluetooth/discover/:uuid'].controller(req, res);
    assert.calledWith(bluetoothManager.getDiscoveredDevice, req.params.uuid);
    assert.calledWith(res.status, 404);
  });
});

describe('POST /api/v1/service/bluetooth/scan', () => {
  beforeEach(() => {
    sinon.reset();
  });

  it('should start scan', async () => {
    const bluetoothController = BluetoothController(bluetoothManager);
    const req = {};
    await bluetoothController['post /api/v1/service/bluetooth/scan'].controller(req, res);
    assert.calledOnce(bluetoothManager.scan);
    assert.calledOnce(bluetoothManager.getStatus);
    assert.calledWith(res.json, status);
  });
});
