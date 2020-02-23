const sinon = require('sinon');
const { expect } = require('chai');

const { assert, fake } = sinon;

const BluetoothManager = require('../../../../../services/bluetooth/lib');
const { TIMERS } = require('../../../../../services/bluetooth/lib/utils/constants');

const gladys = {};
const serviceUuid = 'de051f90-f34a-4fd5-be2e-e502339ec9bc';

const bluetoothMock = {
  startScanning: fake.returns(null),
  stopScanning: fake.returns(null),
};

describe('BluetoothManager scan command', () => {
  let bluetoothManager;

  beforeEach(() => {
    bluetoothManager = new BluetoothManager(gladys, serviceUuid);
    bluetoothManager.bluetooth = bluetoothMock;
    bluetoothManager.broadcastStatus = fake.returns(null);

    TIMERS.SCAN = 10;

    sinon.reset();
  });

  it('not powered, should fail', async () => {
    try {
      await bluetoothManager.scan();
      assert.fail('Exception expected');
    } catch (e) {
      assert.notCalled(bluetoothMock.startScanning);
      assert.notCalled(bluetoothMock.stopScanning);
      assert.notCalled(bluetoothManager.broadcastStatus);

      expect(bluetoothManager.scanning).eq(false);
      expect(bluetoothManager.powered).eq(false);
    }
  });

  it('already scanning, should stops scan', async () => {
    bluetoothManager.powered = true;
    bluetoothManager.scanning = true;

    await bluetoothManager.scan();
    assert.notCalled(bluetoothMock.startScanning);
    assert.calledOnce(bluetoothMock.stopScanning);
    assert.calledOnce(bluetoothManager.broadcastStatus);

    expect(bluetoothManager.scanning).eq(false);
    expect(bluetoothManager.powered).eq(true);
  });

  it('should starts and stops scan', async () => {
    bluetoothManager.powered = true;
    bluetoothManager.scanning = false;

    await bluetoothManager.scan();
    assert.calledOnce(bluetoothMock.startScanning);
    assert.calledOnce(bluetoothMock.stopScanning);
    assert.calledTwice(bluetoothManager.broadcastStatus);

    expect(bluetoothManager.scanning).eq(false);
    expect(bluetoothManager.powered).eq(true);
  });
});
