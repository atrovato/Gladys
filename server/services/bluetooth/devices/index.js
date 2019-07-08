const { getMatchingModels } = require('./generic/generic.getMatchingModels');
const { getAvailableModels } = require('./generic/generic.getAvailableModels');
const { getRequiredServicesAndCharacteristics } = require('./generic/generic.getRequiredServicesAndCharacteristics');
const { getDeviceFeatures } = require('./generic/generic.getDeviceFeatures');

const GenericDevice = function GenericDevice(device) {
  this.device = device;
};

GenericDevice.prototype.getMatchingModels = getMatchingModels;
GenericDevice.prototype.getAvailableModels = getAvailableModels;
GenericDevice.prototype.getRequiredServicesAndCharacteristics = getRequiredServicesAndCharacteristics;
GenericDevice.prototype.getDeviceFeatures = getDeviceFeatures;

module.exports = GenericDevice;
