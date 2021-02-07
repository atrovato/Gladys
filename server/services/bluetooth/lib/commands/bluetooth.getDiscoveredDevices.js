/**
 * @description Get all found preipherals as devices.
 * @returns {Object} Return list of devices.
 * @example
 * const devices = bluetoothManager.getDiscoveredDevices();
 */
function getDiscoveredDevices() {
  return Object.values(this.discoveredPeripherals)
    .map((peripheral) => this.transformToDevice(peripheral))
    .map((device) => this.completeDevice(device));
}

module.exports = {
  getDiscoveredDevices,
};
