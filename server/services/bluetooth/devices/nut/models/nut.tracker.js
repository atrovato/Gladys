const { battery } = require('../../generic/generic.pollFeatures');

module.exports = {
  name: 'tracker',
  matches: () => true,
  device: {
    should_poll: true,
    poll_frequency: 60000,
    features: [
      {
        category: 'battery',
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
