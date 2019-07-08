const logger = require('../../../../utils/logger');

/**
 * @description Starts to Bluetooth device.
 * @example
 * bluetooth.start();
 */
function start() {
  logger.debug(`Bluetooth : Listening Bluetooth events`);

  // Handle Bluetooth device change state
  this.bluetooth.on('stateChange', this.stateChange.bind(this));

  // Handle start / stop scanning
  this.bluetooth.on('scanStart', this.scanStart.bind(this));
  this.bluetooth.on('scanStop', this.scanStop.bind(this));

  // Handle new peripheral discovered
  this.bluetooth.on('discover', this.discover.bind(this));

  /*
  this.bluetooth.on('connect', this.connected.bind(this));
  this.bluetooth.on('disconnect', this.disconnected.bind(this));
  this.bluetooth.on('addressChange', this.onAddressChange.bind(this));
  this.bluetooth.on('updateRSSI', this.onAddressChange.bind(this));
  this.bluetooth.on('servicesDiscover', this.onServicesDiscover.bind(this));
  this.bluetooth.on('includedServicesDiscover', this.onIncludedServicesDiscover.bind(this));
  this.bluetooth.on('characteristicsDiscover', this.onCharacteristicsDiscover.bind(this));
  this.bluetooth.on('read', this.onRead.bind(this));
  this.bluetooth.on('write', this.onWrite.bind(this));
  this.bluetooth.on('broadcast', this.onBroadcast.bind(this));
  this.bluetooth.on('notify', this.onNotify.bind(this));
  this.bluetooth.on('descriptorsDiscover', this.onDescriptorsDiscover.bind(this));
  this.bluetooth.on('valueRead', this.onValueRead.bind(this));
  this.bluetooth.on('valueWrite', this.onValueWrite.bind(this));
  this.bluetooth.on('handleRead', this.onHandleRead.bind(this));
  this.bluetooth.on('handleWrite', this.onHandleWrite.bind(this));
  this.bluetooth.on('handleNotify', this.onHandleNotify.bind(this));
  */
}

module.exports = {
  start,
};
