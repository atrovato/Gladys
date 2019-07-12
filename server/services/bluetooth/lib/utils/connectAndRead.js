const logger = require('../../../../utils/logger');
const { connect } = require('./connect');
const { discoverServices } = require('./discoverServices');
const { discoverCharacteristics } = require('./discoverCharacteristics');
const { read } = require('./read');
const { TIMERS } = require('../utils/constants');

/**
 * @description Connects to peripheral, discovers all needed, to read specific value.
 * Then callback is called with 1st arg as error if exists (or undefined),
 * and 2ng arg as 'characteristic uuid : value' object.
 * @param {*} peripheral - Noble peripheral to connect to.
 * @param {*} characteristicUuidsByServiceUuidsMap - Map of services and characteritics to explore to read values.
 * @param {Function} callback - Called on error or success with characteristic uuid / value pair object.
 * @example
 * connectAndRead(this.getPeripheral(uuid), { 'service1': ['char1', 'char2'] }, (error, result) => {})
 */
function connectAndRead(peripheral, characteristicUuidsByServiceUuidsMap = {}, callback) {
  if (callback) {
    // Connect to peripheral
    connect(
      peripheral,
      (errorConnect, connectedPeripheral) => {
        if (errorConnect) {
          // Error connecting
          callback(errorConnect);
        } else {
          // Discovering services
          discoverServices(
            connectedPeripheral,
            Object.keys(characteristicUuidsByServiceUuidsMap),
            (errorServices, serviceMap) => {
              if (errorServices) {
                // Error discovering services
                callback(errorServices);
              } else {
                let done = false;
                const peripheralInfo = {};
                const finish = () => {
                  if (!done) {
                    done = true;
                    // peripheral.disconnect();
                    callback(null, peripheralInfo);
                  }
                };
                const timeout = setTimeout(finish, TIMERS.DETERMINE_DEVICE);

                const progressStatus = {};
                // Prepare progress status / stop condition
                serviceMap.forEach((service, serviceUuid) => {
                  progressStatus[serviceUuid] = false;
                });

                serviceMap.forEach((service, serviceUuid) => {
                  const requiredChars = characteristicUuidsByServiceUuidsMap[serviceUuid];
                  if (requiredChars) {
                    // Discorvering characteristics
                    discoverCharacteristics(peripheral, service, requiredChars, (errorChar, charMap = new Map()) => {
                      if (errorChar) {
                        progressStatus[serviceUuid] = true;
                      } else {
                        const nbToRead = charMap.size;
                        let nbRead = 0;

                        charMap.forEach((characteristic) => {
                          read(peripheral, characteristic, (errorReading, value) => {
                            nbRead += 1;

                            if (!errorReading) {
                              peripheralInfo[characteristic.uuid] = value;
                            }

                            // Check process is done
                            logger.trace(
                              `Bluetooth : connect and read progress - ${nbRead} / ${nbToRead} / %j`,
                              progressStatus,
                            );
                            if (nbRead === nbToRead) {
                              progressStatus[serviceUuid] = true;

                              if (!Object.values(progressStatus).includes(false)) {
                                clearTimeout(timeout);
                                finish();
                              }
                            }
                          });
                        });
                      }
                    });
                  }
                });
              }
            },
          );
        }
      },
    );
  }
}

module.exports = {
  connectAndRead,
};
