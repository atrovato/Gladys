const { isRemote, isMesh, isWhite } = require('../lib/awox.utils');
const { connectAndSend } = require('../../../lib/utils/connectAndSend');

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
