/**
 * @description Retrieve current Bluetooth peripherals.
 * @returns {Object} Bluetooth peripherals.
 * @example
 * bluetooth.getDiscoveredDevices();
 */
function getDiscoveredDevices() {
  return Object.values(this.discoveredDevices);
}

module.exports = {
  getDiscoveredDevices,
};
