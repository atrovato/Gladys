const { isRemote, isMesh, isColor } = require('../lib/awox.utils');

module.exports = {
  name: 'smlc',
  matches: (deviceModel, deviceType) => !isRemote(deviceModel) && isColor(deviceType) && !isMesh(deviceModel),
  features: [
    {
      category: 'light',
      type: 'binary',
      unit: '',
      min: 0,
      max: 1,
      read_only: false,
      has_feedback: false,
    },
    {
      category: 'light',
      type: 'white temperature',
      unit: '',
      min: 0,
      max: 100,
      read_only: false,
      has_feedback: false,
    },
    {
      category: 'light',
      type: 'brightness',
      unit: '',
      min: 0,
      max: 100,
      read_only: false,
      has_feedback: false,
    },
    {
      category: 'light',
      type: 'color',
      unit: '',
      min: 0,
      max: 100,
      read_only: false,
      has_feedback: false,
    },
  ],
};
