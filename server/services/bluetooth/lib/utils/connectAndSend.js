const { connect } = require('./connect');
const { discoverServices } = require('./discoverServices');
const { discoverCharacteristics } = require('./discoverCharacteristics');
const { send } = require('./send');

/**
 * @description Connects to peripheral, discovers all needed, to read specific value.
 * Then callback is called with 1st arg as error if exists (or undefined),
 * and 2ng arg as 'characteristic uuid : value' object.
 * @param {*} peripheral - Noble peripheral to connect to.
 * @param {string} serviceUuid - Noble service UUID.
 * @param {string} characteristicUuid - Noble characteristic UUID.
 * @param {Array | Buffer} value - Value to send to peripheral.
 * @param {Function} callback - Called on error or success with characteristic uuid / value pair object.
 * @example
 * connectAndSend(this.getPeripheral(uuid), 'service1', 'char1', [0x01], (error, result) => {})
 */
function connectAndSend(peripheral, serviceUuid, characteristicUuid, value, callback) {
  if (value && callback) {
    // Connect to peripheral
    connect(
      peripheral,
      (errorConnect, connectedPeripheral) => {
        if (errorConnect) {
          // Error connecting
          callback(errorConnect);
        } else {
          // Discovering services
          discoverServices(connectedPeripheral, [serviceUuid], (errorServices, serviceMap) => {
            if (errorServices) {
              // Error discovering services
              callback(errorServices);
            } else {
              serviceMap.forEach((service) => {
                // Discorvering characteristics
                discoverCharacteristics(peripheral, service, [characteristicUuid], (errorChar, charMap = new Map()) => {
                  if (errorChar) {
                    callback(errorChar);
                  } else {
                    charMap.forEach((characteristic) => {
                      send(peripheral, characteristic, value, callback);
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
}

module.exports = {
  connectAndSend,
};
