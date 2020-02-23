// Bluetooth
const { start } = require('./bluetooth/start');
const { stop } = require('./bluetooth/stop');
const { scan } = require('./bluetooth/scan');
const { broadcastStatus } = require('./bluetooth/broadcastStatus');
const { getStatus } = require('./bluetooth/getStatus');
const { getDiscoveredDevices } = require('./bluetooth/getDiscoveredDevices');
const { getDiscoveredDevice } = require('./bluetooth/getDiscoveredDevice');

// Peripheral
const { handleDiscovered } = require('./peripheral/handleDiscovered');
const { explore } = require('./peripheral/explore');

const BluetoothManager = function BluetoothManager(gladys, serviceId) {
  this.bluetooth = null;
  this.gladys = gladys;
  this.serviceId = serviceId;

  this.powered = false;
  this.scanning = false;

  this.discoveredDevices = {};
};

// Bluetooth
BluetoothManager.prototype.start = start;
BluetoothManager.prototype.stop = stop;
BluetoothManager.prototype.scan = scan;
BluetoothManager.prototype.broadcastStatus = broadcastStatus;
BluetoothManager.prototype.getStatus = getStatus;
BluetoothManager.prototype.getDiscoveredDevices = getDiscoveredDevices;
BluetoothManager.prototype.getDiscoveredDevice = getDiscoveredDevice;

// Peripheral
BluetoothManager.prototype.handleDiscovered = handleDiscovered;
BluetoothManager.prototype.explore = explore;

module.exports = BluetoothManager;
