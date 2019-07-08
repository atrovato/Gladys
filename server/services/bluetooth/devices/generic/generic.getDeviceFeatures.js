/**
 * @description Get all available / managed device features.
 * @param {string} modelName - Peripheral model.
 * @returns {Object[]} Device features.
 * @example
 * device.getDeviceFeatures('Model');
 */
function getDeviceFeatures(modelName) {
  const models = this.device.models.filter((model) => model.name === modelName);

  if (models.length === 1) {
    return models[0].features;
  }

  return undefined;
}

module.exports = {
  getDeviceFeatures,
};
