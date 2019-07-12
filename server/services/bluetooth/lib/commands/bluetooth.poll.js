const logger = require('../../../../utils/logger');
const { connectAndRead } = require('../utils/connectAndRead');
const { WEBSOCKET_MESSAGE_TYPES } = require('../../../../utils/constants');

/* eslint-disable jsdoc/require-returns */
/**
 * @description Polling Bluetooth device to get new values.
 * @param {any} device - Gladys device.
 * @example
 * bluetooth.poll(device);
 */
function poll(device) {
  const uuid = device.external_id;
  const peripheral = this.peripherals[uuid];

  if (!peripheral) {
    logger.info(`Bluetooth : peripheral ${uuid} not in memory, should start scanning`);
    this.scan(true);

    this.gladys.event.on(WEBSOCKET_MESSAGE_TYPES.BLUETOOTH.DISCOVER, (discoveredPeripheral) => {
      if (discoveredPeripheral.uuid === uuid) {
        this.scan(false);
        this.poll(device);
      }
    });
  } else {
    const params = {};
    (device.params || []).forEach((param) => {
      params[param.name] = param.value;
    });

    const brand = this.availableBrands.get(params.brand);

    if (brand) {
      const model = brand.device.models.find((m) => m.name === params.model);

      if (model && model.pollFeature) {
        device.features.forEach((feature) => {
          const subscriptionData = model.pollFeature[feature.category];

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

            connectAndRead(peripheral, subscriptionData.services, handleResult);
          } else {
            logger.warn(`Bluetooth : read information not available for ${feature.category} on ${uuid}`);
          }
        });
      } else {
        logger.warn(`Bluetooth : model ${params.model} not available or has no poll information for device ${uuid}`);
      }
    } else {
      logger.error(`Bluetooth : brand ${params.brand} not available anymore for device ${uuid}`);
    }
  }
}

module.exports = {
  poll,
};
