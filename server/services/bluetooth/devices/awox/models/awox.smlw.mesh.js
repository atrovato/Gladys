const { isRemote, isMesh, isWhite } = require('../lib/awox.utils');

module.exports = {
  name: 'SmartLIGHT Mesh White',
  matches: (deviceModel, deviceType) => !isRemote(deviceModel) && isWhite(deviceType) && isMesh(deviceModel),
  features: [
    {
      category: 'light',
      type: 'binary',
      unit: '',
      min: 0,
      max: 1,
      read_only: false,
    },
    {
      category: 'light',
      type: 'white temperature',
      unit: '',
      min: 0,
      max: 100,
      read_only: false,
    },
    {
      category: 'light',
      type: 'brightness',
      unit: '',
      min: 0,
      max: 100,
      read_only: false,
    },
    {
      category: 'light',
      type: 'mode',
      unit: '',
      min: 0,
      max: 3,
      read_only: true,
    },
  ],
};
