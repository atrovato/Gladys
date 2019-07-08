const { transformPeripheral } = require('../utils/transformPeripheral');
/**
 * @description Return array of Peripherals.
 * @returns {Object} Return list of peripherals.
 * @example
 * const peripherals = bluetoothManager.getPeripherals();
 */
function getPeripherals() {
  const peripheralIds = Object.keys(this.peripherals);
  const result = {};

  peripheralIds.forEach((uuid) => {
    result[uuid] = transformPeripheral(this.peripherals[uuid]);
  });

  return result;
}

module.exports = {
  getPeripherals,
};
