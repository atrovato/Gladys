const logger = require('../../../../utils/logger');
const { EVENTS, WEBSOCKET_MESSAGE_TYPES } = require('../../../../utils/constants');

/**
 * @description When the Bluetooth service needs to broadcast its status.
 * @example
 * bluetooth.on('broadcastStatus', this.broadcastStatus);
 */
function broadcastStatus() {
  const bluetoothStatus = this.getStatus();
  logger.debug(`Bluetooth : broadcast status '${bluetoothStatus}'`);

  this.gladys.event.emit(EVENTS.WEBSOCKET.SEND_ALL, {
    type: WEBSOCKET_MESSAGE_TYPES.BLUETOOTH.STATE,
    payload: { bluetoothStatus },
  });
}

module.exports = {
  broadcastStatus,
};
