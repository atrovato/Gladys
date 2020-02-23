const logger = require('../../../../utils/logger');
const { EVENTS, WEBSOCKET_MESSAGE_TYPES } = require('../../../../utils/constants');

/**
 * @description When the Bluetooth discovers peripheral, add it to managed peripherals.
 * @param {Object} peripheral - Bluetooth peripheral.
 * @param {Object} device - Bluetooth device.
 * @example
 * this.handleDiscovered({});
 */
async function handleDiscovered(peripheral, device) {
  logger.debug(`Bluetooth: discover ${peripheral.uuid}`);

  // Store and emit peripheral
  this.discoveredDevices[peripheral.uuid] = device;

  this.gladys.event.emit(EVENTS.WEBSOCKET.SEND_ALL, {
    type: WEBSOCKET_MESSAGE_TYPES.BLUETOOTH.DISCOVER,
    payload: device,
  });
}

module.exports = {
  handleDiscovered,
};
