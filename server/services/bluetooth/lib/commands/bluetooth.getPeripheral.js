const { transformPeripheral } = require('../utils/transformPeripheral');
/**
 * @description Return asked Peripheral, or undefined.
 * @param {string} uuid - Wanted peripheral UUID.
 * @returns {Object} Returns peripheral according to this UUID.
 * @example
 * const peripheral = bluetoothManager.getPeripheral('99dd77cba4');
 */
function getPeripheral(uuid) {
  const peripheral = this.peripherals[uuid];
  let result;

  if (peripheral) {
    result = transformPeripheral(peripheral);
  }

  return result;
}

module.exports = {
  getPeripheral,
};
