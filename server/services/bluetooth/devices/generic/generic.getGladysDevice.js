/**
 * @description Get all available / managed device features.
 * @param {string} modelName - Peripheral model.
 * @returns {Object[]} Device features.
 * @example
 * device.getGladysDevice('Model');
 */
function getGladysDevice(modelName) {
  const models = this.device.models.filter((model) => model.name === modelName);

  if (models.length === 1) {
    return models[0].device;
  }

  return undefined;
}

module.exports = {
  getGladysDevice,
};
