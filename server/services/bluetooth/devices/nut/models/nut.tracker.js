const { battery } = require('../../generic/generic.pollFeatures');
const { DEVICE_FEATURE_CATEGORIES } = require('../../../../../utils/constants');

module.exports = {
  name: 'tracker',
  matches: () => true,
  device: {
    should_poll: true,
    poll_frequency: 60000,
    features: [
      {
        category: DEVICE_FEATURE_CATEGORIES.BATTERY,
        type: '',
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
