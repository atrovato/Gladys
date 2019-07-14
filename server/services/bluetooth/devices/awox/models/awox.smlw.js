const { isRemote, isMesh, isWhite } = require('../lib/awox.utils');

module.exports = {
  name: 'smlw',
  matches: (deviceModel, deviceType) => !isRemote(deviceModel) && isWhite(deviceType) && !isMesh(deviceModel),
  device: {
    features: [
      {
        category: 'light',
        type: 'binary',
        unit: '',
        min: 0,
        max: 1,
        read_only: false,
        has_feedback: true,
      },
      {
        category: 'light',
        type: 'white temperature',
        unit: '',
        min: 0,
        max: 100,
        read_only: false,
        has_feedback: true,
      },
      {
        category: 'light',
        type: 'brightness',
        unit: '',
        min: 0,
        max: 100,
        read_only: false,
        has_feedback: true,
      },
    ],
  },
};
