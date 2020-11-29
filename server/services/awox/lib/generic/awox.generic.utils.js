const { DEVICE_FEATURE_CATEGORIES, DEVICE_FEATURE_TYPES } = require('../../../../utils/constants');
const { BadParameters } = require('../../../../utils/coreErrors');
const { COMMANDS } = require('./awox.generic.constants');

/**
 * @description Compute message checksum.
 * @param {Array} data - Data array.
 * @param {number} maxPos - Max position to compute.
 * @returns {number} Checksum number.
 * @example
 * checksum([0x00], 0);
 */
function checksum(data, maxPos) {
  // eslint-disable-next-line no-bitwise
  return (data.slice(1, maxPos).reduce((a, b) => a + b) + 85) & 0xff;
}

/**
 * @description Generates a random number.
 * @returns {number} Random number.
 * @example
 * random();
 */
function random() {
  // eslint-disable-next-line no-bitwise
  return Math.floor(Math.random() * 0xff) >>> 0;
}

const generatedLightCommand = (type, value) => {
  switch (type) {
    case DEVICE_FEATURE_TYPES.LIGHT.BINARY: {
      if (value === 1) {
        return COMMANDS.ON;
      }
      return COMMANDS.OFF;
    }
    case DEVICE_FEATURE_TYPES.LIGHT.SATURATION:
    case DEVICE_FEATURE_TYPES.LIGHT.BRIGHTNESS: {
      const realValue = Math.round((value * (3050 - 600)) / 100 + 600);
      const command = [...COMMANDS.BRIGHTNESS];
      // value
      command[8] = Math.floor(realValue / 256);
      command[9] = realValue % 256;
      // checksum
      command[10] = checksum(command, 10);
      return command;
    }
    case DEVICE_FEATURE_TYPES.LIGHT.COLOR: {
      const command = [...COMMANDS.COLOR];
      // RGB values
      command[9] = Math.floor(value / 65536) % 256;
      command[10] = Math.floor(value / 256) % 256;
      command[11] = value % 256;
      // random
      command[14] = random();
      // checksum
      command[15] = checksum(command, 15);
      return command;
    }
    default:
      throw new BadParameters(`Awox: button/${type} feature type not handled`);
  }
};

const generatedButtonCommand = (type) => {
  switch (type) {
    case DEVICE_FEATURE_TYPES.BUTTON.CLICK: {
      const command = [...COMMANDS.RESET];
      // random
      command[14] = random();
      // checksum
      command[15] = checksum(command, 15);
      return command;
    }
    default:
      throw new BadParameters(`Awox: button/${type} feature type not handled`);
  }
};

/**
 * @description Generates payload to send.
 * @param {Object} feature - Feature to manage.
 * @param {number} value - Value to send.
 * @returns {Array} Payload.
 * @example
 * generateCommand({ category: 'light', type: 'binary'}, 1);
 */
function generateCommand(feature, value) {
  const { category, type } = feature;
  switch (category) {
    case DEVICE_FEATURE_CATEGORIES.LIGHT:
      return generatedLightCommand(type, value);
    case DEVICE_FEATURE_CATEGORIES.BUTTON:
      return generatedButtonCommand(type);
    default:
      throw new BadParameters(`Awox: ${category} feature category not handled`);
  }
}

module.exports = {
  checksum,
  random,
  generateCommand,
  generatedButtonCommand,
};
