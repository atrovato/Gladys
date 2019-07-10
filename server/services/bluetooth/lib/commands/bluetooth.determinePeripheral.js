const logger = require('../../../../utils/logger');
const { EVENTS, WEBSOCKET_MESSAGE_TYPES } = require('../../../../utils/constants');
const { connect } = require('../utils/connect.js');
const { discoverServices } = require('../utils/discoverServices.js');
const { discoverCharacteristics } = require('../utils/discoverCharacteristics.js');
const { read } = require('../utils/read.js');

/**
 * @description Connect to Bluetooth peripheral and read informationto determine which kind of device.
 * @param {string} uuid - Peripheral UUID.
 * @example
 * bluetooth.determinePeripheral('a4c13802e340');
 */
async function determinePeripheral(uuid) {
  const peripheral = this.peripherals[uuid];

  const emitErrorMessage = (error) => {
    if (peripheral) {
      peripheral.removeAllListeners();
      peripheral.disconnect();
    }

    logger.error(`Error during determination of ${uuid} device : %j`, error);

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
            const nbServsToRead = serviceMap.size;
            const peripheralInfo = {};
            let nbServsRead = 0;

            serviceMap.forEach((service, serviceUUID) => {
              const requiredChars = servicesAndChars[serviceUUID];
              discoverCharacteristics(peripheral, service, requiredChars, (errorChar, charMap = new Map()) => {
                if (errorChar && errorChar.code !== 'noCharacteristicFound') {
                  emitErrorMessage(errorChar);
                } else {
                  const nbCharsToRead = charMap.size;
                  let nbCharsRead = 0;
                  nbServsRead += 1;

                  charMap.forEach((characterisctic, charUuid) => {
                    read(peripheral, characterisctic, (errorReading, value) => {
                      if (errorReading) {
                        logger.error(errorReading);
                      }

                      peripheralInfo[charUuid] = (value || '').toString('utf-8').replace('\u0000', '');

                      nbCharsRead += 1;
                      if (nbCharsRead === nbCharsToRead && nbServsToRead === nbServsRead) {
                        peripheral.disconnect();
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
