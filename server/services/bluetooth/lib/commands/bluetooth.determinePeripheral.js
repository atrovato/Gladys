const logger = require('../../../../utils/logger');
const { EVENTS, WEBSOCKET_MESSAGE_TYPES } = require('../../../../utils/constants');
const { connect } = require('../utils/connect');
const { discoverServices } = require('../utils/discoverServices');
const { discoverCharacteristics } = require('../utils/discoverCharacteristics');
const { read } = require('../utils/read');
const { TIMERS } = require('../utils/constants');

/* eslint-disable jsdoc/require-returns */
/**
 * @description Connect to Bluetooth peripheral and read informationto determine which kind of device.
 * @param {string} uuid - Peripheral UUID.
 * @example
 * bluetooth.determinePeripheral('a4c13802e340');
 */
function determinePeripheral(uuid) {
  const peripheral = this.peripherals[uuid];

  const emitSuccessMessage = (peripheralInfo) => {
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
  };

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
            let nbCharsRead = 0;
            let nbCharsToRead = 0;
            requiredServices.forEach((service) => {
              if (serviceMap.has(service)) {
                nbCharsToRead += (servicesAndChars[service] || []).length;
              }
            });

            setTimeout(emitSuccessMessage, TIMERS.DETERMINE_DEVICE, peripheralInfo);

            if (nbCharsToRead === 0) {
              emitErrorMessage({ code: 'notFound', message: 'No characteristics found' });
            } else {
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
                        logger.debug(`Reading ${characteristic.uuid} as ${nbCharsRead} on ${nbCharsToRead}`);
                        if (nbCharsRead === nbCharsToRead) {
                          logger.debug(`Sending response ${nbCharsRead} === ${nbCharsToRead}`);
                          emitSuccessMessage(peripheralInfo);
                        }
                      });
                    });
                  }
                });
              });
            }
          }
        });
      }
    },
  );
}

module.exports = {
  determinePeripheral,
};
