const { fake } = require('sinon');

const BluetoothMock = {
  default: {
    powerOn: fake.resolves('bluetoothPoweredOn'),
    connect: fake.resolves(undefined),
  },
};

module.exports = BluetoothMock;
