const logger = require('../../../../utils/logger');
const BluetoothError = require('../BluetoothError');
const { timeout } = require('./timeout');
const { TIMERS } = require('./constants');

/**
 * @description Try to discover Noble peripheral services.
 * @param {Object} peripheral - Noble peripheral.
 * @param {Object} service - Noble service.
 * @param {string[]} uuids - Requested characteristic uuids.
 * @param {Function} callback - Callback with 1st param as error, 2nd as characteristic map by uuid.
 * @returns {Object} No return expected.
 * @example
 * discover(peripheral, ['2a29'], [], (error, CcaracteriscticMap) => { console.log(error); });
 */
function discoverCharacteristics(peripheral, service, uuids, callback) {
  const characteristicMap = new Map();
  const filtering = uuids && uuids.length && service.characteristics;

  let notMapped = uuids;
  if (filtering) {
    logger.debug(`Filtering characteristics for ${peripheral.address}`);

    notMapped = uuids.filter((uuid) => {
      const found = service.characteristics.filter((characteristic) => {
        const filtered = characteristic.uuid === uuid;
        if (filtered) {
          characteristicMap.set(characteristic.uuid, characteristic);
        }
        return filtered;
      });

      return found.length === 0;
    });
  }

  if (filtering && notMapped.length === 0) {
    callback(null, characteristicMap);
  } else {
    const connectTimeout = setTimeout(
      timeout,
      TIMERS.DISCOVER_CHARACTERISTICS,
      callback,
      `Discover characteristics timeout for ${peripheral.address}`,
    );
    service.discoverCharacteristics(notMapped, (error, characteristics) => {
      clearTimeout(connectTimeout);

      if (error) {
        callback(new BluetoothError('discoverCharacteristicError', error));
      } else if (characteristics.length === 0) {
        callback(
          new BluetoothError(
            'noCharacteristicFound',
            `No characteristics found for service ${service.uuid} on ${peripheral.address}`,
          ),
        );
      } else {
        characteristics.forEach((characteristic) => {
          characteristicMap.set(characteristic.uuid, characteristic);
        });
        callback(null, characteristicMap);
      }
    });
  }
}

module.exports = {
  discoverCharacteristics,
};
