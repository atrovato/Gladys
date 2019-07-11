const logger = require('../../../../utils/logger');
const { EVENTS, WEBSOCKET_MESSAGE_TYPES } = require('../../../../utils/constants');
const { connect } = require('../utils/connect.js');
const { discoverServices } = require('../utils/discoverServices.js');
const { discoverCharacteristics } = require('../utils/discoverCharacteristics.js');
const { read } = require('../utils/read.js');

/* eslint-disable jsdoc/require-returns */
/**
 * @description Connect to Bluetooth peripheral and read informationto determine which kind of device.
 * @param {string} uuid - Peripheral UUID.
 * @example
 * bluetooth.determinePeripheral('a4c13802e340');
 */
function determinePeripheral(uuid) {
  const peripheral = this.peripherals[uuid];

  const emitErrorMessage = (error) => {
    if (peripheral) {
      peripheral.removeAllListeners();
    }

    logger.error(`Error during determination of ${uuid} device : ${error.message}`);

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

  connect(
    peripheral,
    (errorConnect, connectedPeripheral) => {
      if (errorConnect) {
        emitErrorMessage(errorConnect);
      } else {
        const servicesAndChars = this.getRequiredServicesAndCharacteristics();
        const requiredServices = Object.keys(servicesAndChars);

        discoverServices(connectedPeripheral, requiredServices, (errorServices, serviceMap) => {
          if (errorServices) {
            emitErrorMessage(errorServices);
          } else {
            const peripheralInfo = {};
            const nbCharsToRead = Object.values(servicesAndChars).reduce((acc, element) => acc + element.length, 0);
            let nbCharsRead = 0;

            serviceMap.forEach((service, serviceUUID) => {
              const requiredChars = servicesAndChars[serviceUUID];
              discoverCharacteristics(peripheral, service, requiredChars, (errorChar, charMap = new Map()) => {
                if (errorChar && errorChar.code !== 'noCharacteristicFound') {
                  emitErrorMessage(errorChar);
                } else {
                  charMap.forEach((characteristic, charUuid) => {
                    read(peripheral, characteristic, (errorReading, value) => {
                      if (errorReading) {
                        logger.error(errorReading);
                      }

                      peripheralInfo[charUuid] = (value || '').toString('utf-8').replace('\u0000', '');

                      nbCharsRead += 1;
                      logger.debug(`Reading ${characteristic.uuid} as ${nbCharsRead}`);
                      if (nbCharsRead === nbCharsToRead) {
                        logger.debug(`Sending response ${nbCharsRead} === ${nbCharsToRead}`);
                        peripheral.removeAllListeners();

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
                      }
                    });
                  });
                }
              });
            });
          }
        });
      }
    },
  );
}

module.exports = {
  determinePeripheral,
};
