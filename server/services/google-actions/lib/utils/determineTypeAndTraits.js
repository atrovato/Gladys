const deviceTypes = require('../deviceTypes');
const { determineTrait } = require('./determineTrait');

/**
 * @description Determine Google Actions device type from Galdys device.
 * @param {Object} device - Gladys device.
 * @returns {Object} GoogleActions device type and traits.
 * @example
 * determineTypeAndTraits(device);
 */
function determineTypeAndTraits(device) {
  const featureCategoryTypes = {};
  const result = {
    type: undefined,
    traits: [],
    attributes: {},
  };

  device.features.forEach((feature) => {
    const { category, type } = feature;

    if (!featureCategoryTypes[category]) {
      featureCategoryTypes[category] = [];
    }

    const matchingTrait = determineTrait(feature);
    if (matchingTrait) {
      result.traits.push(matchingTrait.key);

      if (typeof matchingTrait.generateAttributes === 'function') {
        result.attributes = { ...result.attributes, ...matchingTrait.generateAttributes(device) };
      }
    }

    featureCategoryTypes[category].push(type);
  });

  // Matching device type
  let nbFeatureTypeMatches = 0;
  deviceTypes.forEach((deviceType) => {
    const nbFeatureTypeMatch = (featureCategoryTypes[deviceType.category] || []).length;

    if (nbFeatureTypeMatch > nbFeatureTypeMatches) {
      result.type = deviceType.key;
      nbFeatureTypeMatches = nbFeatureTypeMatch;
    }
  });

  return result;
}

module.exports = {
  determineTypeAndTraits,
};
