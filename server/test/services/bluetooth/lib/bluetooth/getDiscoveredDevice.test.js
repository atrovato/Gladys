const { expect } = require('chai');

const BluetoothManager = require('../../../../../services/bluetooth/lib');

const gladys = {};
const serviceUuid = 'de051f90-f34a-4fd5-be2e-e502339ec9bc';

describe('BluetoothManager getDiscoveredDevice command', () => {
  let bluetoothManager;

  beforeEach(() => {
    bluetoothManager = new BluetoothManager(gladys, serviceUuid);
  });

  it('get peripheral by uuid', () => {
    const device = {
      name: 'NAME',
      external_id: 'bluetooth:UUID',
    };
    bluetoothManager.discoveredDevices.uuid = device;

    const result = bluetoothManager.getDiscoveredDevice('uuid');

    expect(device).deep.eq(result);
  });

  it('get not existing peripheral by uuid', () => {
    const result = bluetoothManager.getDiscoveredDevice('uuid');
    expect(undefined).eq(result);
  });
});
