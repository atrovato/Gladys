/**
 * @description Return an object with mananged device features according to brand and model.
 * @param {string} brand - Device brand.
 * @param {string} model - Device model.
 * @returns {Object} Return all managed types of device.
 * @example
 * const brands = bluetoothManager.getDeviceFeatures('awox', 'Bulb');
 */
function getDeviceFeatures(brand, model) {
  const brandObj = this.availableBrands.get(brand);

  if (!brandObj) {
    return undefined;
  }

  return brandObj.getDeviceFeatures(model);
}

module.exports = {
  getDeviceFeatures,
};
