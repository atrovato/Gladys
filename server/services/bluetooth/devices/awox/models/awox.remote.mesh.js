const { isRemote, isMesh } = require('../lib/awox.utils');

module.exports = {
  name: 'rcum',
  matches: (deviceModel, deviceType) => isRemote(deviceModel) && isMesh(deviceModel),
  features: [
    {
      category: 'light',
      type: 'battery',
      unit: '%',
      min: 0,
      max: 100,
      read_only: true,
      has_feedback: false,
    },
  ],
};
