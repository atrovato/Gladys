/**
 * @description Retrieve current Bluetooth peripheral by its uuid.
 * @param {string} uuid - Peripheral uuid.
 * @returns {Object} Bluetooth device if exists.
 * @example
 * bluetooth.getDiscoveredDevice(uuid);
 */
function getDiscoveredDevice(uuid) {
  return this.discoveredDevices[uuid];
}

module.exports = {
  getDiscoveredDevice,
};
