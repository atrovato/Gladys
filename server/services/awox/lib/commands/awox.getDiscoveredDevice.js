/**
 * @description Return asked Peripheral, or undefined.
 * @param {string} uuid - Wanted peripheral UUID.
 * @returns {Object} Returns peripheral according to this UUID.
 * @example
 * const device = awoxManager.getDiscoveredDevice('99dd77cba4');
 */
function getDiscoveredDevice(uuid) {
  const device = this.bluetooth.getDiscoveredDevice(uuid);
  if (!device) {
    return null;
  }
  return this.completeDevice(device);
}

module.exports = {
  getDiscoveredDevice,
};
