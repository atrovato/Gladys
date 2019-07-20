const { battery } = require('../../generic/generic.pollFeatures');
const { DEVICE_FEATURE_CATEGORIES, DEVICE_FEATURE_TYPES } = require('../../../../../utils/constants');

module.exports = {
  name: 'tracker',
  matches: () => true,
  device: {
    should_poll: true,
    poll_frequency: 60000,
    features: [
      {
        category: DEVICE_FEATURE_CATEGORIES.BATTERY,
        type: DEVICE_FEATURE_TYPES.SENSOR.INTEGER,
        unit: '%',
        min: 0,
        max: 100,
        read_only: true,
        has_feedback: false,
      },
    ],
  },
  pollFeature: {
    battery,
  },
};
