const Promise = require('bluebird');

const logger = require('../../../../utils/logger');

const { INFORMATION_SERVICES } = require('../device/bluetooth.information');

/**
 * @description Look for Gladys Bluetooth devices and subscribe to notifications.
 * @param {string} service - Service name to scan device for.
 * @param {Object} serviceMap - Object with service UUID as key, containing linked characteristics and functions.
 * @returns {Promise} All subscription promises.
 * @example
 * await bluetooth.connectDevices('bluetooth);
 */
async function connectDevices(service, serviceMap = INFORMATION_SERVICES) {
  logger.debug(`Bluetooth: subscribing to existing devices on service ${service}...`);
  const devices = await this.gladys.device.get({
    service,
  });

  return Promise.map(
    devices,
    (device) => {
      const [, peripheralUuid] = device.external_id.split(':');

      const subscribe = (peripheral) => {
        return Promise.map(
          device.features,
          (feature) => {
            const [, , serviceUuid, characteristicUuid] = feature.external_id.split(':');
            return this.subscribePeripheral(peripheral, serviceUuid, characteristicUuid, feature, serviceMap);
          },
          { concurrency: 1 },
        ).catch((e) => {
          logger.error(e.message);
          return Promise.resolve();
        });
      };

      return this.applyOnPeripheral(peripheralUuid, subscribe, true).catch((e) => {
        logger.error(e.message);
        return Promise.resolve();
      });
    },
    { concurrency: 1 },
  );
}

module.exports = {
  connectDevices,
};
