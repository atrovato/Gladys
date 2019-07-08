const smlw = require('./models/awox.smlw.js');
const smlc = require('./models/awox.smlc.js');
const smlwm = require('./models/awox.smlw.mesh.js');
const smlcm = require('./models/awox.smlc.mesh.js');
const meshRemote = require('./models/awox.remote.mesh.js');

const deviceModels = [smlw, smlc, smlwm, smlcm, meshRemote];

module.exports = {
  brand: 'awox',
  requiredServicesAndCharacteristics: {
    '180a': ['2a29', '2a24'],
  },
  getMatchingModels: (characteristics) => {
    const models = [];

    if (characteristics['2a29'] && characteristics['2a29'].toLowerCase() === 'awox') {
      const lowerDeviceNameSplit = (characteristics['2a24'] || '').toLowerCase().split(/[-_]/);
      const deviceModel = lowerDeviceNameSplit[0] || '';
      const deviceType = lowerDeviceNameSplit[1] || '';

      deviceModels.forEach((model) => {
        if (model.matches(deviceModel, deviceType)) {
          models.push(model.name);
        }
      });
    }

    return models;
  },
  models: deviceModels,
};
