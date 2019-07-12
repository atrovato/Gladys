// DEVICE IMPL
const nutDevice = require('../devices/nut');
const awoxDevice = require('../devices/awox');
const GenericDevice = require('../devices');

// EVENTS
const { stateChange } = require('./events/bluetooth.stateChange');
const { scanStart } = require('./events/bluetooth.scanStart');
const { scanStop } = require('./events/bluetooth.scanStop');
const { discover } = require('./events/bluetooth.discover');
const { broadcastStatus } = require('./events/bluetooth.broadcastStatus');

// COMMANDS
const { start } = require('./commands/bluetooth.start');
const { stop } = require('./commands/bluetooth.stop');
const { scan } = require('./commands/bluetooth.scan');
const { getPeripheral } = require('./commands/bluetooth.getPeripheral');
const { getPeripherals } = require('./commands/bluetooth.getPeripherals');
const { getStatus } = require('./commands/bluetooth.getStatus');
const { determinePeripheral } = require('./commands/bluetooth.determinePeripheral');
const { getMatchingDevices } = require('./commands/bluetooth.getMatchingDevices');
const { getBrands } = require('./commands/bluetooth.getBrands');
const { getRequiredServicesAndCharacteristics } = require('./commands/bluetooth.getRequiredServicesAndCharacteristics');
const { getGladysDevice } = require('./commands/bluetooth.getGladysDevice');
const { poll } = require('./commands/bluetooth.poll');

const BluetoothManager = function BluetoothManager(noble, gladys, serviceId) {
  this.bluetooth = noble;
  this.gladys = gladys;
  this.serviceId = serviceId;

  this.ready = false;
  this.scanning = false;

  this.peripherals = {};

  // All types of device managed by implementations
  this.availableBrands = new Map();
  this.availableBrands.set('nut', new GenericDevice(nutDevice));
  this.availableBrands.set('awox', new GenericDevice(awoxDevice));
};

// EVENTS
BluetoothManager.prototype.stateChange = stateChange;
BluetoothManager.prototype.scanStart = scanStart;
BluetoothManager.prototype.scanStop = scanStop;
BluetoothManager.prototype.discover = discover;
BluetoothManager.prototype.broadcastStatus = broadcastStatus;

// COMMANDS
BluetoothManager.prototype.start = start;
BluetoothManager.prototype.stop = stop;
BluetoothManager.prototype.scan = scan;
BluetoothManager.prototype.getPeripheral = getPeripheral;
BluetoothManager.prototype.getPeripherals = getPeripherals;
BluetoothManager.prototype.getStatus = getStatus;
BluetoothManager.prototype.determinePeripheral = determinePeripheral;
BluetoothManager.prototype.getMatchingDevices = getMatchingDevices;
BluetoothManager.prototype.getBrands = getBrands;
BluetoothManager.prototype.getRequiredServicesAndCharacteristics = getRequiredServicesAndCharacteristics;
BluetoothManager.prototype.getGladysDevice = getGladysDevice;

// DEVICE
BluetoothManager.prototype.poll = poll;

module.exports = BluetoothManager;
