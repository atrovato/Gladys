/**
 * @description Gets all models matching peripheral characteristics.
 * @param {string[]} characteristics - Peripheral characteristics.
 * @returns {Array<string>} Models matching.
 * @example
 * device.getMatchingModels(characteristics);
 */
function getMatchingModels(characteristics) {
  let models = [];

  if (this.device.getMatchingModels) {
    models = this.device.getMatchingModels(characteristics);
  }

  return models;
}

module.exports = {
  getMatchingModels,
};
