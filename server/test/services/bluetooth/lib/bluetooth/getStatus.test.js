const { expect } = require('chai');
const sinon = require('sinon');

const BluetoothManager = require('../../../../../services/bluetooth/lib');

const gladys = {};
const serviceUuid = 'de051f90-f34a-4fd5-be2e-e502339ec9bc';

describe('BluetoothManager getStatus command', () => {
  let bluetoothManager;

  beforeEach(() => {
    bluetoothManager = new BluetoothManager(gladys, serviceUuid);

    sinon.reset();
  });

  it('should get status', () => {
    const result = bluetoothManager.getStatus();
    expect(result).deep.eq({ powered: false, scanning: false });
  });
});
