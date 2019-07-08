/**
 * @description Checks if the device is managed by Gladys.
 * @param {string[]} characteristics - Peripheral characteristics.
 * @returns {Object[]} Matching device implementations.
 * @example
 * bluetoothManager.getMatchingDevices(characteristics);
 */
function getMatchingDevices(characteristics) {
  const devices = [];

  this.availableBrands.forEach((device, brand) => {
    const models = device.getMatchingModels(characteristics);
    const nbModels = models.length;
    switch (nbModels) {
      case 0:
        break;
      case 1:
        devices.push({ brand, model: models[0] });
        break;
      default:
        devices.push({ brand, models });
    }
  });

  return devices;
}

module.exports = {
  getMatchingDevices,
};
