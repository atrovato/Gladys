const logger = require('../../../../utils/logger');
const BluetoothError = require('../BluetoothError');
const { timeout } = require('./timeout');
const { TIMERS } = require('./constants');

/**
 * @description Try to discover Noble peripheral services.
 * @param {Object} peripheral - Noble peripheral.
 * @param {string[]} uuids - Requested service uuids.
 * @param {Function} callback - Callback with 1st param as error, 2nd as service map by uuid.
 * @returns {Object} No return expected.
 * @example
 * discoverServices(peripheral, ['2a29'], (error, serviceMap) => { console.log(error); });
 */
function discoverServices(peripheral, uuids, callback) {
  const serviceMap = new Map();
  let notMapped = uuids;
  const filtering = uuids && uuids.length && peripheral.services;

  if (filtering) {
    logger.debug(`Filtering services for ${peripheral.address}`);

    notMapped = uuids.filter((uuid) => {
      const found = peripheral.services.filter((service) => {
        const filtered = service.uuid === uuid;
        if (filtered) {
          serviceMap.set(service.uuid, service);
        }
        return filtered;
      });

      return found.length === 0;
    });
  }

  if (filtering && notMapped.length === 0) {
    callback(null, serviceMap);
  } else {
    const connectTimeout = setTimeout(
      timeout,
      TIMERS.DISCOVER_SERVICES,
      callback,
      `Discover services timeout for ${peripheral.address}`,
    );
    peripheral.discoverServices(notMapped, (error, services) => {
      clearTimeout(connectTimeout);

      if (error) {
        callback(new BluetoothError('discoverServiceError', error));
      } else if (services.length === 0) {
        callback(new BluetoothError('noServiceFound', `No services found for ${peripheral.address}`));
      } else {
        services.forEach((service) => {
          serviceMap.set(service.uuid, service);
        });
        callback(null, serviceMap);
      }
    });
  }
}

module.exports = {
  discoverServices,
};
