const { expect } = require('chai');
const sinon = require('sinon');

const { assert, fake } = sinon;

const BluetoothManager = require('../../../../../services/bluetooth/lib');
const BluetoothMock = require('../../BluetoothMock.test');

describe('BluetoothManager stop command', () => {
  let bluetooth;
  let bluetoothManager;

  beforeEach(() => {
    bluetooth = new BluetoothMock();

    bluetoothManager = new BluetoothManager(bluetooth, {}, 'de051f90-f34a-4fd5-be2e-e502339ec9bc');

    sinon.reset();
  });

  afterEach(() => {
    bluetooth.removeAllListeners();
  });

  it('check listeners are well removed', () => {
    bluetoothManager.stop();

    // No more listener
    expect(0).eq(bluetooth.eventNames().length);

    assert.calledOnce(bluetooth.stopScanning);
  });

  it('check all periperhals disconnected', () => {
    const disconnect = fake.returns(null);

    bluetoothManager.peripherals.uuid = {
      disconnect,
    };
    bluetoothManager.stop();

    expect(0).eq(bluetooth.eventNames().length);

    assert.calledOnce(disconnect);
    assert.calledOnce(bluetooth.stopScanning);
  });
});
