/**
 * @description Get all Nut available / managed device models.
 * @returns {string[]} The list of available models.
 * @example
 * nut.getAvailableModels();
 */
function getAvailableModels() {
  return this.device.models.map((model) => model.name);
}

module.exports = {
  getAvailableModels,
};
