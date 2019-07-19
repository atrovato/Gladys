const sinon = require('sinon');

const { assert, fake } = sinon;

const BluetoothManager = require('../../../../../services/bluetooth/lib');
const BluetoothMock = require('../../BluetoothMock.test');

describe('BluetoothManager scan command', () => {
  let bluetooth;
  let bluetoothManager;

  beforeEach(() => {
    bluetooth = new BluetoothMock();
    bluetooth.stopScanning = fake.returns(null);
    bluetooth.startScanning = fake.returns(null);

    const gladys = {};
    bluetoothManager = new BluetoothManager(bluetooth, gladys, 'de051f90-f34a-4fd5-be2e-e502339ec9bc');

    sinon.reset();
  });

  afterEach(() => {
    bluetooth.removeAllListeners();
  });

  it('should not scan, ready but no args', () => {
    bluetoothManager.ready = true;
    bluetoothManager.scan();

    assert.calledOnce(bluetooth.stopScanning);
  });

  it('should not scan, not ready no args', () => {
    bluetoothManager.ready = false;
    bluetoothManager.scan();

    assert.calledOnce(bluetooth.stopScanning);
  });

  it('should not scan, ready no scan', () => {
    bluetoothManager.ready = true;
    bluetoothManager.scan(false);

    assert.calledOnce(bluetooth.stopScanning);
  });

  it('should scan', () => {
    bluetoothManager.ready = true;
    bluetoothManager.scan(true);

    assert.calledOnce(bluetooth.startScanning);
  });
});
