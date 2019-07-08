/**
 * @description Return an object with mananged Bluetooth brands and models.
 * @returns {Object} Return all managed types of device.
 * @example
 * const brands = bluetoothManager.getBrands();
 */
function getBrands() {
  const brands = {};

  this.availableBrands.forEach((brand, key) => {
    brands[key] = brand.getAvailableModels();
  });

  return brands;
}

module.exports = {
  getBrands,
};
