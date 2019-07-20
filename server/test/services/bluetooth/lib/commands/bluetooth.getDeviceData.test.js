const { expect } = require('chai');
const sinon = require('sinon');

const BluetoothManager = require('../../../../../services/bluetooth/lib');

describe('BluetoothManager getDeviceData command', () => {
  let bluetoothManager;

  beforeEach(() => {
    bluetoothManager = new BluetoothManager({}, {}, 'de051f90-f34a-4fd5-be2e-e502339ec9bc');

    sinon.reset();
  });

  it('getDeviceData undefined device', () => {
    const result = bluetoothManager.getDeviceData(undefined);
    expect(result).eq(undefined);
  });

  it('getDeviceData no params device', () => {
    const result = bluetoothManager.getDeviceData({});
    expect(result).eq(undefined);
  });

  it('getDeviceData empty params device', () => {
    const params = [];
    const result = bluetoothManager.getDeviceData({ params });
    expect(result).eq(undefined);
  });

  it('getDeviceData single brand param device', () => {
    const params = [
      {
        name: 'brand',
        value: 'nut',
      },
    ];
    const result = bluetoothManager.getDeviceData({ params });
    expect(result).eq(undefined);
  });

  it('getDeviceData single model param device', () => {
    const params = [
      {
        name: 'model',
        value: 'tracker',
      },
    ];
    const result = bluetoothManager.getDeviceData({ params });
    expect(result).eq(undefined);
  });

  it('getDeviceData unknown brand device', () => {
    const params = [
      {
        name: 'brand',
        value: 'unknown',
      },
      {
        name: 'model',
        value: 'tracker',
      },
    ];
    const result = bluetoothManager.getDeviceData({ params });
    expect(result).eq(undefined);
  });

  it('getDeviceData unknown model device', () => {
    const params = [
      {
        name: 'brand',
        value: 'nut',
      },
      {
        name: 'model',
        value: 'unknown',
      },
    ];
    const result = bluetoothManager.getDeviceData({ params });
    expect(result).eq(undefined);
  });

  it('getDeviceData known data', () => {
    const params = [
      {
        name: 'brand',
        value: 'nut',
      },
      {
        name: 'model',
        value: 'tracker',
      },
    ];
    const result = bluetoothManager.getDeviceData({ params });
    expect(result).not.eq(undefined);
  });
});
