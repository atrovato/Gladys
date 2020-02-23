const { EVENTS, WEBSOCKET_MESSAGE_TYPES } = require('../../../../utils/constants');

/**
 * @description When the Bluetooth service needs to broadcast its status.
 * @example
 * bluetoothService.broadcastStatus();
 */
function broadcastStatus() {
  const bluetoothStatus = this.getStatus();

  this.gladys.event.emit(EVENTS.WEBSOCKET.SEND_ALL, {
    type: WEBSOCKET_MESSAGE_TYPES.BLUETOOTH.STATE,
    payload: bluetoothStatus,
  });
}

module.exports = {
  broadcastStatus,
};
