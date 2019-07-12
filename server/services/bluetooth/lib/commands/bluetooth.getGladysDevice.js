/**
 * @description Return an object with mananged device features according to brand and model.
 * @param {string} brand - Device brand.
 * @param {string} model - Device model.
 * @returns {Object} Return all managed types of device.
 * @example
 * const brands = bluetoothManager.getGladysDevice('awox', 'Bulb');
 */
function getGladysDevice(brand, model) {
  const brandObj = this.availableBrands.get(brand);

  if (!brandObj) {
    return undefined;
  }

  const originalDevice = brandObj.getGladysDevice(model);
  if (originalDevice) {
    const device = Object.assign({}, originalDevice);
    if (!device.params) {
      device.params = [];
    }

    device.params.push({
      name: 'brand',
      value: brand,
    });
    device.params.push({
      name: 'model',
      value: model,
    });
    return device;
  } 
    return undefined;
  
}

module.exports = {
  getGladysDevice,
};
