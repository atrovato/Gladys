const { isRemote, isMesh, isColor } = require('../lib/awox.utils');
const { DEVICE_FEATURE_CATEGORIES, DEVICE_FEATURE_TYPES } = require('../../../utils/constants');

module.exports = {
  name: 'smlcm',
  matches: (deviceModel, deviceType) => !isRemote(deviceModel) && isColor(deviceType) && isMesh(deviceModel),
  device: {
    features: [
      {
        category: DEVICE_FEATURE_CATEGORIES.LIGHT,
        type: DEVICE_FEATURE_TYPES.LIGHT.BINARY,
        unit: '',
        min: 0,
        max: 1,
        read_only: false,
        has_feedback: true,
      },
      {
        category: DEVICE_FEATURE_CATEGORIES.LIGHT,
        type: DEVICE_FEATURE_TYPES.LIGHT.SATURATION,
        unit: '',
        min: 0,
        max: 100,
        read_only: false,
        has_feedback: true,
      },
      {
        category: DEVICE_FEATURE_CATEGORIES.LIGHT,
        type: DEVICE_FEATURE_TYPES.LIGHT.BRIGHTNESS,
        unit: '',
        min: 0,
        max: 100,
        read_only: false,
        has_feedback: true,
      },
      {
        category: DEVICE_FEATURE_CATEGORIES.LIGHT,
        type: DEVICE_FEATURE_TYPES.LIGHT.HUE,
        unit: '',
        min: 0,
        max: 100,
        read_only: false,
        has_feedback: true,
      },
      {
        category: DEVICE_FEATURE_CATEGORIES.UNKNOWN,
        type: DEVICE_FEATURE_TYPES.UNKNOWN.UNKNOWN,
        unit: '',
        min: 0,
        max: 3,
        read_only: true,
        has_feedback: true,
      },
    ],
  },
};
