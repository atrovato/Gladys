const sinon = require('sinon');

const { assert, fake } = sinon;
const BluetoothController = require('../../../../services/bluetooth/api/bluetooth.controller');

const status = 'ready';
let peripheral;
const peripherals = [
  {
    uuid: 'UUID1',
  },
  {
    uuid: 'UUID2',
  },
];
const brands = ['nut', 'awox'];
const features = ['light', 'temperature'];

const bluetoothManager = function bluetoothManager() {};

bluetoothManager.getStatus = fake.returns(status);
bluetoothManager.getPeripheral = fake.returns(peripheral);
bluetoothManager.getPeripherals = fake.returns(peripherals);
bluetoothManager.getBrands = fake.returns(brands);
bluetoothManager.getDeviceFeatures = fake.returns(features);
bluetoothManager.determinePeripheral = fake.returns(null);
bluetoothManager.scan = fake.returns(null);

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
    assert.calledWith(res.json, { bluetoothStatus: status });
  });
});

describe('GET /api/v1/service/bluetooth/peripheral', () => {
  beforeEach(() => {
    sinon.reset();
  });

  it('should get peripherals', async () => {
    const bluetoothController = BluetoothController(bluetoothManager);
    const req = {};
    await bluetoothController['get /api/v1/service/bluetooth/peripheral'].controller(req, res);
    assert.calledOnce(bluetoothManager.getPeripherals);
    assert.calledWith(res.json, peripherals);
  });

  it('should connect peripheral', async () => {
    const bluetoothController = BluetoothController(bluetoothManager);
    const req = { params: { uuid: 'uuid' } };
    await bluetoothController['post /api/v1/service/bluetooth/peripheral/:uuid/connect'].controller(req, res);
    assert.calledOnce(bluetoothManager.determinePeripheral);
    assert.calledWith(res.status, 200);
  });

  it('should fail without peripheral', async () => {
    const bluetoothController = BluetoothController(bluetoothManager);
    const req = { params: { uuid: 'uuid1' } };
    await bluetoothController['get /api/v1/service/bluetooth/peripheral/:uuid'].controller(req, res);
    assert.calledOnce(bluetoothManager.getPeripheral);
    assert.calledWith(res.json, undefined);
    assert.calledWith(res.status, 404);
  });
});

describe('POST /api/v1/service/bluetooth/scan', () => {
  beforeEach(() => {
    sinon.reset();
  });

  it('should start scan', async () => {
    const bluetoothController = BluetoothController(bluetoothManager);
    const req = { body: { scan: 'on' } };
    await bluetoothController['post /api/v1/service/bluetooth/scan'].controller(req, res);
    assert.calledWith(bluetoothManager.scan, true);
    assert.calledOnce(bluetoothManager.getStatus);
    assert.calledWith(res.json, { bluetoothStatus: status });
  });

  it('should start scan', async () => {
    const bluetoothController = BluetoothController(bluetoothManager);
    const req = { body: { scan: 'anything else' } };
    await bluetoothController['post /api/v1/service/bluetooth/scan'].controller(req, res);
    assert.calledWith(bluetoothManager.scan, false);
    assert.calledOnce(bluetoothManager.getStatus);
    assert.calledWith(res.json, { bluetoothStatus: status });
  });
});

describe('GET /api/v1/service/bluetooth/brand*', () => {
  beforeEach(() => {
    sinon.reset();
  });

  it('should get all brands', async () => {
    const bluetoothController = BluetoothController(bluetoothManager);
    const req = {};
    await bluetoothController['get /api/v1/service/bluetooth/brand'].controller(req, res);
    assert.calledOnce(bluetoothManager.getBrands);
    assert.calledWith(res.json, brands);
  });

  it('should get all device features', async () => {
    const bluetoothController = BluetoothController(bluetoothManager);
    const req = { params: { brand: 'nut', model: 'tracker' } };
    await bluetoothController['get /api/v1/service/bluetooth/brand/:brand/:model'].controller(req, res);
    assert.calledOnce(bluetoothManager.getDeviceFeatures);
    assert.calledWith(res.json, features);
  });
});
