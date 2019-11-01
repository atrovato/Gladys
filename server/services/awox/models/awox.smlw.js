const { isRemote, isMesh, isWhite } = require('../lib/awox.utils');
const { connectAndSend } = require('../../bluetooth/lib/utils/connectAndSend');
const { DEVICE_FEATURE_CATEGORIES, DEVICE_FEATURE_TYPES } = require('../../../utils/constants');

module.exports = {
  name: 'smlw',
  matches: (deviceModel, deviceType) => !isRemote(deviceModel) && isWhite(deviceType) && !isMesh(deviceModel),
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
    ],
  },
  action: {
    turnOn: (peripheral, callback) => {
      connectAndSend(
        peripheral,
        'fff0',
        'fff1',
        [0xaa, 0x0a, 0xfc, 0x3a, 0x86, 0x01, 0x0a, 0x01, 0x01, 0x00, 0x28, 0x0d],
        callback,
      );
    },
    turnOff: (peripheral, callback) => {
      connectAndSend(
        peripheral,
        'fff0',
        'fff1',
        [0xaa, 0x0a, 0xfc, 0x3a, 0x86, 0x01, 0x0a, 0x01, 0x00, 0x01, 0x28, 0x0d],
        callback,
      );
    },
  },
};
