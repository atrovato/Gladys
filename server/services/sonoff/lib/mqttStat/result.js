const logger = require('../../../../utils/logger');
const { gpioToFeatures } = require('../../utils/gpioToFeatures');

/**
 * @description Handle Tasmota 'stat/+/RESULT' topics.
 * @param {string} deviceExternalId - Device external id.
 * @param {string} message - MQTT message.
 * @param {Object} sonoffHandler - Sonoff handler.
 * @example
 * result('sonoff:sonoff-plug', '{"key": "value"}', {});
 */
function result(deviceExternalId, message, sonoffHandler) {
  logger.trace(`RESULT: ${message}`);
  const device = sonoffHandler[deviceExternalId];
  if (device) {
    const resultMsg = JSON.parse(message);
    Object.keys(resultMsg).forEach((key) => {
      const value = resultMsg[key];
      const features = gpioToFeatures(key, value);
      features.forEach((feature) => {
        device.features.push(feature);
      });
    });
  } else {
    logger.debug(`MQTT: Sonoff device "${deviceExternalId}" not managed`);
  }
}

module.exports = {
  result,
};
