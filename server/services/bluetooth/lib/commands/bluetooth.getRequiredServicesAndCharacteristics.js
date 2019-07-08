/**
 * @description Get all services and characteristics to determine devices.
 * @returns {Object} Object with required service UUIDs as key, and array of characteristic UUIDs as value.
 * @example
 * bluetoothManager.getRequiredServicesAndCharacteristics();
 */
function getRequiredServicesAndCharacteristics() {
  const servicesAndChars = {};

  this.availableBrands.forEach((device) => {
    const deviceServicesAndChars = device.getRequiredServicesAndCharacteristics();
    const deviceServices = Object.keys(deviceServicesAndChars);

    deviceServices.forEach((deviceService) => {
      const exisingCharacteristics = servicesAndChars[deviceService] || [];
      servicesAndChars[deviceService] = exisingCharacteristics.concat(deviceServicesAndChars[deviceService]);
    });
  });

  return servicesAndChars;
}

module.exports = {
  getRequiredServicesAndCharacteristics,
};
