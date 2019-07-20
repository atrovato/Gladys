const { fake } = require('sinon');
const EventEmitter = require('events');

const BluetoothMock = function BluetoothMock() {};

BluetoothMock.prototype = EventEmitter.prototype;

BluetoothMock.prototype.startScanning = fake.returns(null);
BluetoothMock.prototype.stopScanning = fake.returns(null);

module.exports = BluetoothMock;
