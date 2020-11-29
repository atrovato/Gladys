const logger = require('../../../../utils/logger');

/**
 * @description Get AwoX identified devices.
 * @returns {Array} AwoX devices.
 * @example
 * awox.getDiscoveredDevices();
 */
function getDiscoveredDevices() {
  logger.debug(`AwoX: looking for discovered devices...`);
  const devices = Object.values(this.bluetooth.getDiscoveredDevices());
  return devices.map((device) => this.completeDevice(device));
}

module.exports = {
  getDiscoveredDevices,
};
