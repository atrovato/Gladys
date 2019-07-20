const logger = require('../../../../utils/logger');

/**
 * @description Polling Bluetooth device to get new values.
 * @param {any} device - Gladys device.
 * @example
 * bluetooth.poll(device);
 */
function poll(device) {
  const uuid = device.external_id;
  const deviceData = this.getDeviceData(device);
  if (deviceData && deviceData.pollFeature) {
    device.features.forEach((feature) => {
      const subscriptionData = deviceData.pollFeature[feature.category];

      if (subscriptionData && subscriptionData.services && subscriptionData.transformResult) {
        const handleResult = (error, dataMap) => {
          if (error) {
            logger.warn(error);
          } else {
            const value = subscriptionData.transformResult(dataMap);
            if (value) {
              this.gladys.device.saveState(feature, value);
            } else {
              logger.warn(`Bluetooth : no value read for ${feature.name} on ${uuid}`);
            }
          }
        };

        this.readPeripheral(uuid, subscriptionData.services, handleResult);
      } else {
        logger.warn(`Bluetooth : read information not available for ${feature.category} on ${uuid}`);
      }
    });
  } else {
    logger.warn(`Bluetooth : no poll information for device ${uuid}`);
  }
}

module.exports = {
  poll,
};
