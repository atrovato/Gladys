const { determineTrait } = require('./determineTrait');

/**
 * @description Converts a Gladys device into a Google Actions device.
 * @param {Object} gladysDevice - Gladys device.
 * @returns {Object} GoogleActions device.
 * @example
 * queryDeviceConverter(device);
 */
function queryDeviceConverter(gladysDevice) {
  const device = {
    status: 'ONLINE',
    online: true,
  };

  gladysDevice.features.forEach((feature) => {
    const trait = determineTrait(feature);

    if (trait) {
      trait.states.forEach((state) => {
        const matchFeature =
          !state.features || state.features.find((f) => f.category === feature.category && f.type === feature.type);
        if (matchFeature) {
          device[state.key] = state.readValue(feature);
        }
      });
    }
  });

  return device;
}

module.exports = {
  queryDeviceConverter,
};