const { expect } = require('chai');

const BluetoothManager = require('../../../../../services/bluetooth/lib');

const gladys = {};
const serviceUuid = 'de051f90-f34a-4fd5-be2e-e502339ec9bc';

describe('BluetoothManager getDiscoveredDevices command', () => {
  let bluetoothManager;

  beforeEach(() => {
    bluetoothManager = new BluetoothManager(gladys, serviceUuid);
  });

  it('should get peripherals', () => {
    bluetoothManager.discoveredDevices = { device1: { name: 'device1' }, device2: { name: 'device2' } };

    const result = bluetoothManager.getDiscoveredDevices();
    expect(result).deep.eq(Object.values(bluetoothManager.discoveredDevices));
  });
});
