/**
 * @description Return asked Peripheral, or undefined.
 * @param {string} uuid - Wanted peripheral UUID.
 * @returns {Object} Returns peripheral according to this UUID.
 * @example
 * const device = bluetoothManager.getDiscoveredDevice('99dd77cba4');
 */
function getDiscoveredDevice(uuid) {
  const peripheral = this.discoveredPeripherals[uuid];

  if (peripheral === null) {
    return null;
  }

  const device = this.transformToDevice(peripheral);
  return this.completeDevice(device);
}

module.exports = {
  getDiscoveredDevice,
};
