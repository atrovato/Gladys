const { expect } = require('chai');
const sinon = require('sinon');

const BluetoothManager = require('../../../../../services/bluetooth/lib');
const BluetoothMock = require('../../BluetoothMock.test');

describe('BluetoothManager start command', () => {
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

  it('check listeners well added', () => {
    bluetoothManager.start();

    expect(bluetooth.listenerCount('stateChange')).eq(1);
    expect(bluetooth.listenerCount('scanStart')).eq(1);
    expect(bluetooth.listenerCount('scanStop')).eq(1);
    expect(bluetooth.listenerCount('discover')).eq(1);

    // All listeners
    expect(bluetooth.eventNames().length).eq(4);
  });
});
