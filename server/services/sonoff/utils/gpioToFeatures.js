const { DEVICE_FEATURE_CATEGORIES, DEVICE_FEATURE_TYPES, DEVICE_FEATURE_UNITS } = require('../../../utils/constants');

const gpioKeyRegex = /GPIO(\d+)/i;
const gpioValueRegex = /(\d+)/g;

const generateTemperatureFeature = (min, max) => {
  return {
    category: DEVICE_FEATURE_CATEGORIES.TEMPERATURE_SENSOR,
    type: DEVICE_FEATURE_TYPES.SENSOR.DECIMAL,
    unit: DEVICE_FEATURE_UNITS.CELSIUS,
    read_only: true,
    has_feedback: false,
    min,
    max,
  };
};

const HUMIDITY_FEATURE = {
  category: DEVICE_FEATURE_CATEGORIES.HUMIDITY_SENSOR,
  type: DEVICE_FEATURE_TYPES.SENSOR.DECIMAL,
  unit: DEVICE_FEATURE_UNITS.PERCENT,
  read_only: true,
  has_feedback: false,
  min: 0,
  max: 100,
};

const LIGHT_BINARY_FEATURE = {
  category: DEVICE_FEATURE_CATEGORIES.LIGHT,
  type: DEVICE_FEATURE_TYPES.LIGHT.BINARY,
  min: 0,
  max: 1,
  read_only: false,
  has_feedback: true,
};

const LIGHT_BRIGHTNESS_FEATURE = {
  category: DEVICE_FEATURE_CATEGORIES.LIGHT,
  type: DEVICE_FEATURE_TYPES.LIGHT.BRIGHTNESS,
  unit: DEVICE_FEATURE_UNITS.PERCENT,
  min: 1,
  max: 100,
  read_only: false,
  has_feedback: true,
};

const SWITCH_FEATURE = {
  category: DEVICE_FEATURE_CATEGORIES.SWITCH,
  type: DEVICE_FEATURE_TYPES.SWITCH.BINARY,
  min: 0,
  max: 1,
  read_only: true,
  has_feedback: false,
};

const BUTTON_FEATURE = {
  category: DEVICE_FEATURE_CATEGORIES.BUTTON,
  type: DEVICE_FEATURE_TYPES.BUTTON.CLICK,
  min: 0,
  max: 1,
  read_only: true,
  has_feedback: false,
};

const RELAY_FEATURE = {
  category: DEVICE_FEATURE_CATEGORIES.SWITCH,
  type: DEVICE_FEATURE_TYPES.SWITCH.BINARY,
  min: 0,
  max: 1,
  read_only: false,
  has_feedback: true,
};

const FEATURE_BY_GPIO = {
  // DHT11 sensor
  1: [generateTemperatureFeature(0, 50), HUMIDITY_FEATURE],
  // AM230X, DHT21 and DHT22 sensor
  2: [generateTemperatureFeature(-40, 150), HUMIDITY_FEATURE],
  // Only for Sonoff Si7021, not the i2c version
  3: [generateTemperatureFeature(-40, 123), HUMIDITY_FEATURE],
  // Dallas Semiconductor DS18b20 1-Wire temperature sensor
  4: [generateTemperatureFeature(-55, 125)],
  // Addressable LEDs such as WS281X or Neopixel
  7: [LIGHT_BINARY_FEATURE, LIGHT_BRIGHTNESS_FEATURE],
  // Swithes
  9: [SWITCH_FEATURE],
  10: [SWITCH_FEATURE],
  11: [SWITCH_FEATURE],
  12: [SWITCH_FEATURE],
  13: [SWITCH_FEATURE],
  14: [SWITCH_FEATURE],
  15: [SWITCH_FEATURE],
  16: [SWITCH_FEATURE],
  // Buttons
  17: [BUTTON_FEATURE],
  18: [BUTTON_FEATURE],
  19: [BUTTON_FEATURE],
  20: [BUTTON_FEATURE],
  // Relays
  21: [RELAY_FEATURE],
  22: [RELAY_FEATURE],
  23: [RELAY_FEATURE],
  24: [RELAY_FEATURE],
  25: [RELAY_FEATURE],
  26: [RELAY_FEATURE],
  27: [RELAY_FEATURE],
  28: [RELAY_FEATURE],
  // Relay inverted
  29: [RELAY_FEATURE],
  30: [RELAY_FEATURE],
  31: [RELAY_FEATURE],
  32: [RELAY_FEATURE],
  33: [RELAY_FEATURE],
  34: [RELAY_FEATURE],
  35: [RELAY_FEATURE],
  36: [RELAY_FEATURE],
  // LED
  52: [LIGHT_BINARY_FEATURE],
  53: [LIGHT_BINARY_FEATURE],
  54: [LIGHT_BINARY_FEATURE],
  55: [LIGHT_BINARY_FEATURE],
  // Inverted LED - default state ON
  56: [LIGHT_BINARY_FEATURE],
  57: [LIGHT_BINARY_FEATURE],
  58: [LIGHT_BINARY_FEATURE],
  59: [LIGHT_BINARY_FEATURE],
};

/**
 * @description Generate feature from GPIO information.
 * @param {string} key - Parameter key.
 * @param {string} value - Parameter value.
 * @returns {Object} The generated features.
 * @example
 * gpioToFeatures('GPIO2', '9 (Switch1)');
 */
function gpioToFeatures(key, value) {
  const features = [];

  // Look for GPIOx
  const matchGpio = key.match(gpioKeyRegex);
  if (matchGpio.length === 2) {
    const [gpioId] = value.match(gpioValueRegex);
    const matchingFeatures = FEATURE_BY_GPIO[gpioId];
    if (matchingFeatures) {
      // Ensure it is a copy
      matchingFeatures.forEach((feature) => {
        features.push(Object.create(feature));
      });
    }
  }

  return features;
}

module.exports = {
  gpioToFeatures,
};
