const { expect } = require('chai');
const sinon = require('sinon');

const BluetoothManager = require('../../../../../services/bluetooth/lib');

describe('BluetoothManager getBrands command', () => {
  let bluetoothManager;

  beforeEach(() => {
    bluetoothManager = new BluetoothManager({}, {}, 'de051f90-f34a-4fd5-be2e-e502339ec9bc');

    sinon.reset();
  });

  it('get brands', () => {
    const result = bluetoothManager.getBrands();
    const expectedResult = ['awox', 'nut'];

    expect(expectedResult).to.have.members(Object.keys(result));
  });
});
