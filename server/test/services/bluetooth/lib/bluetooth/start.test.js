const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const { assert } = sinon;

const BluetoothMock = require('../../BluetoothMock.test');

const startLib = proxyquire('../../../../../services/bluetooth/lib/bluetooth/start', {
  '@sblendid/sblendid': BluetoothMock,
});
const BluetoothManager = proxyquire('../../../../../services/bluetooth/lib', {
  './bluetooth/start': startLib,
});

const gladys = {};
const serviceUuid = 'de051f90-f34a-4fd5-be2e-e502339ec9bc';

describe('BluetoothManager start command', () => {
  let bluetoothManager;

  beforeEach(() => {
    bluetoothManager = new BluetoothManager(gladys, serviceUuid);

    sinon.reset();
  });

  it('bluetootk powered off with success', async () => {
    await bluetoothManager.start();

    expect(bluetoothManager.bluetooth).eq('bluetoothPoweredOn');
    expect(bluetoothManager.scanning).eq(false);
    expect(bluetoothManager.powered).eq(true);

    assert.calledOnce(BluetoothMock.default.powerOn);
  });
});
