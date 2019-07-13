const logger = require('../../../../utils/logger');
const { EVENTS, WEBSOCKET_MESSAGE_TYPES } = require('../../../../utils/constants');
const { connectAndRead } = require('../utils/connectAndRead');

/**
 * @description Connect to Bluetooth peripheral and read informationto determine which kind of device.
 * @param {string} uuid - Peripheral UUID.
 * @example
 * bluetooth.determinePeripheral('a4c13802e340');
 */
function determinePeripheral(uuid) {
  const peripheral = this.peripherals[uuid];

  const emitSuccessMessage = (peripheralInfo) => {
    Object.keys(peripheralInfo).forEach((key) => {
      peripheralInfo[key] = (peripheralInfo[key] || '').toString('utf-8').replace('\u0000', '');
    });

    const matchingDevices = this.getMatchingDevices(peripheralInfo);
    let matchingDevice;
    if (matchingDevices.length === 1) {
      [matchingDevice] = matchingDevices;
      logger.debug(`Found matching device for ${uuid} : %j`, matchingDevice);
    }

    this.gladys.event.emit(EVENTS.WEBSOCKET.SEND_ALL, {
      type: WEBSOCKET_MESSAGE_TYPES.BLUETOOTH.DETERMINE,
      payload: {
        uuid,
        status: 'done',
        code: undefined,
        message: undefined,
        device: matchingDevice,
      },
    });
  };

  const emitErrorMessage = (error) => {
    logger.error(`Error during determination of ${uuid} device : ${error}`);

    this.gladys.event.emit(EVENTS.WEBSOCKET.SEND_ALL, {
      type: WEBSOCKET_MESSAGE_TYPES.BLUETOOTH.DETERMINE,
      payload: {
        uuid,
        status: 'error',
        code: error.code,
        message: error.message,
        peripheralInfo: undefined,
        matchingDevices: undefined,
      },
    });
  };

  const emitMessage = (error, result) => {
    if (error) {
      emitErrorMessage(error);
    } else {
      emitSuccessMessage(result);
    }
  };

  const servicesAndChars = this.getRequiredServicesAndCharacteristics();
  connectAndRead(peripheral, servicesAndChars, emitMessage);
}

module.exports = {
  determinePeripheral,
};
