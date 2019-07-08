const smartTracker = require('./models/nut.tracker.js');

const deviceModels = [smartTracker];

module.exports = {
  brand: 'awox',
  requiredServicesAndCharacteristics: {
    '1800': ['2a00'],
  },
  getMatchingModels: (characteristics) => {
    const models = [];

    if (characteristics['2a00'] && characteristics['2a00'].toLowerCase() === 'nut') {
      deviceModels.forEach((model) => {
        models.push(model.name);
      });
    }

    return models;
  },
  models: deviceModels,
};
