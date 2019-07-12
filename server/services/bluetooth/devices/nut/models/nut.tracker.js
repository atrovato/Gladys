module.exports = {
  name: 'tracker',
  matches: () => true,
  device: {
    should_poll: true,
    poll_frequency: 60000,
    features: [
      {
        category: 'battery',
        type: 'battery',
        unit: '%',
        min: 0,
        max: 100,
        read_only: true,
        has_feedback: false,
      },
    ],
  },
  pollFeature: {
    battery: {
      services: {
        '180f': ['2a19'],
      },
      transformResult: (dataMap = {}) => {
        const data = dataMap['2a19'];
        if (data !== undefined) {
          return data.readUInt8(0);
        }
        return undefined;
      },
    },
  },
};
