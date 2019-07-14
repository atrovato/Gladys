const { isRemote, isMesh, isColor } = require('../lib/awox.utils');

module.exports = {
  name: 'smlcm',
  matches: (deviceModel, deviceType) => !isRemote(deviceModel) && isColor(deviceType) && isMesh(deviceModel),
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
      {
        category: 'light',
        type: 'color',
        unit: '',
        min: 0,
        max: 100,
        read_only: false,
        has_feedback: true,
      },
      {
        category: 'light',
        type: 'mode',
        unit: '',
        min: 0,
        max: 3,
        read_only: true,
        has_feedback: true,
      },
    ],
  },
};
