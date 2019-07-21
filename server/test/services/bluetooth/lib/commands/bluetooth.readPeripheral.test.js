const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();
const { expect } = require('chai');

const { assert, fake } = sinon;

const connectAndReadMock = {
  connectAndRead: (arg1, arg2, cb) => {
    cb();
  },
};
const BluetoothManager = proxyquire('../../../../../services/bluetooth/lib', {
  '../utils/connectAndRead': connectAndReadMock,
});
const BluetoothMock = require('../../BluetoothMock.test');

describe('BluetoothManager readPeripheral', () => {
  let bluetooth;
  let bluetoothManager;
  let peripheral;

  beforeEach(() => {
    bluetooth = new BluetoothMock();
    bluetooth.startScanning = fake.returns(null);
    // Simulate listener added by 'start' method
    bluetooth.on('discover', () => {});

    bluetoothManager = new BluetoothManager(bluetooth, {}, 'de051f90-f34a-4fd5-be2e-e502339ec9bc');
    bluetoothManager.scan = (active) => {
      if (!active) {
        bluetooth.emit('scanStop');
      } else {
        bluetooth.startScanning();
      }
    };

    peripheral = {
      uuid: 'uuid',
    };

    sinon.reset();
  });

  afterEach(() => {
    bluetooth.removeAllListeners();
  });

  it('peripheral already discovered', () => {
    const callback = fake.returns(null);

    bluetoothManager.peripherals.uuid = peripheral;
    bluetoothManager.readPeripheral(peripheral.uuid, {}, callback);

    assert.calledOnce(callback);

    assert.notCalled(bluetooth.startScanning);

    expect(bluetooth.listenerCount('scanStop')).eq(0);
    expect(bluetooth.listenerCount('discover')).eq(1);
  });

  it('peripheral already discovered (undefined map)', () => {
    const callback = fake.returns(null);

    bluetoothManager.peripherals.uuid = peripheral;
    bluetoothManager.readPeripheral(peripheral.uuid, undefined, callback);

    assert.calledOnce(callback);

    assert.notCalled(bluetooth.startScanning);

    expect(bluetooth.listenerCount('scanStop')).eq(0);
    expect(bluetooth.listenerCount('discover')).eq(1);
  });

  it('peripheral not available, but discovered', () => {
    const callback = fake.returns(null);

    bluetoothManager.readPeripheral(peripheral.uuid, {}, callback);

    bluetoothManager.peripherals.uuid = peripheral;
    bluetooth.emit('discover', peripheral);

    assert.calledOnce(callback);

    assert.calledOnce(bluetooth.startScanning);

    expect(bluetooth.listenerCount('scanStop')).eq(0);
    expect(bluetooth.listenerCount('discover')).eq(1);
  });

  it('peripheral not available, not discovered', () => {
    const callback = fake.returns(null);

    bluetoothManager.readPeripheral(peripheral.uuid, {}, callback);

    bluetooth.emit('discover', peripheral);

    assert.notCalled(callback);

    assert.calledOnce(bluetooth.startScanning);

    expect(bluetooth.listenerCount('scanStop')).eq(0);
    expect(bluetooth.listenerCount('discover')).eq(1);
  });

  it('peripheral wait other processes', () => {
    const callback = fake.returns(null);
    bluetooth.on('discover', () => {});

    bluetoothManager.readPeripheral(peripheral.uuid, {}, callback);

    bluetooth.emit('discover', peripheral);

    assert.notCalled(callback);

    assert.calledOnce(bluetooth.startScanning);

    expect(bluetooth.listenerCount('scanStop')).eq(1);
    expect(bluetooth.listenerCount('discover')).eq(2);
  });
});
