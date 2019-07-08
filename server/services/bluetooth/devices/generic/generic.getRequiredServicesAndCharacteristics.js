/**
 * @description Get Bluetooth services and characteristics needed to determine Nut devices.
 * @returns {Object} Object with required service UUIDs as key, and array of characteristic UUIDs as value.
 * @example
 * nut.getRequiredServicesAndCharacteristics();
 */
function getRequiredServicesAndCharacteristics() {
  return this.device.requiredServicesAndCharacteristics;
}

module.exports = {
  getRequiredServicesAndCharacteristics,
};
