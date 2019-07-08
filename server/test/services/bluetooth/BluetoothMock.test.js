const { fake } = require('sinon');
const EventEmitter = require('events');

const BluetoothMock = function BluetoothMock(options) {};

BluetoothMock.prototype = Object.create(new EventEmitter());

BluetoothMock.prototype.startScanning = fake.returns(null);
BluetoothMock.prototype.stopScanning = fake.returns(null);

module.exports = BluetoothMock;
