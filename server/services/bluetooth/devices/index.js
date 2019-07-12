const { getMatchingModels } = require('./generic/generic.getMatchingModels');
const { getAvailableModels } = require('./generic/generic.getAvailableModels');
const { getRequiredServicesAndCharacteristics } = require('./generic/generic.getRequiredServicesAndCharacteristics');
const { getGladysDevice } = require('./generic/generic.getGladysDevice');

const GenericDevice = function GenericDevice(device) {
  this.device = device;
};

GenericDevice.prototype.getMatchingModels = getMatchingModels;
GenericDevice.prototype.getAvailableModels = getAvailableModels;
GenericDevice.prototype.getRequiredServicesAndCharacteristics = getRequiredServicesAndCharacteristics;
GenericDevice.prototype.getGladysDevice = getGladysDevice;

module.exports = GenericDevice;
