const { expect } = require('chai');
const sinon = require('sinon');

const { assert, fake } = sinon;

const BluetoothManager = require('../../../../../services/bluetooth/lib');

const gladys = {};
const serviceUuid = 'de051f90-f34a-4fd5-be2e-e502339ec9bc';

const bluetoothMock = {
  powerOff: fake.resolves(true),
};

describe('BluetoothManager stop command', () => {
  let bluetoothManager;

  beforeEach(() => {
    bluetoothManager = new BluetoothManager(gladys, serviceUuid);
    bluetoothManager.bluetooth = bluetoothMock;
    bluetoothManager.scanning = true;
    bluetoothManager.powered = true;

    sinon.reset();
  });

  it('bluetootk powered off with success', async () => {
    await bluetoothManager.stop();

    expect(bluetoothManager.bluetooth).eq(null);
    expect(bluetoothManager.scanning).eq(false);
    expect(bluetoothManager.powered).eq(false);

    assert.calledOnce(bluetoothMock.powerOff);
  });
});
