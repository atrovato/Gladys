const { isRemote, isMesh } = require('../lib/awox.utils');
const { DEVICE_FEATURE_CATEGORIES, DEVICE_FEATURE_TYPES } = require('../../../../../utils/constants');

module.exports = {
  name: 'rcum',
  matches: (deviceModel, deviceType) => isRemote(deviceModel) && isMesh(deviceModel),
  device: {
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
};
