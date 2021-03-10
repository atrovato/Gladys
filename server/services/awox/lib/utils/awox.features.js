const {
  DEVICE_FEATURE_CATEGORIES,
  DEVICE_FEATURE_TYPES,
  DEVICE_FEATURE_UNITS,
} = require('../../../../utils/constants');
const { addSelector } = require('../../../../utils/addSelector');
const { setDeviceFeature } = require('../../../../utils/setDeviceFeature');

const FEATURE_TYPES = {
  SWITCH: {
    BINARY: 'switch',
  },
  COLOR: {
    LIGHT: 'color_light',
    SATURATION: 'color_saturation',
  },
  WHITE: {
    RESET: 'white_reset',
    BRIGHTNESS: 'white_brightness',
    TEMPERATURE: 'white_temperature',
  },
};

const FEATURES = {
  [FEATURE_TYPES.SWITCH.BINARY]: {
    name: 'Switch',
    category: DEVICE_FEATURE_CATEGORIES.LIGHT,
    type: DEVICE_FEATURE_TYPES.LIGHT.BINARY,
    read_only: false,
    keep_history: true,
    has_feedback: true,
    min: 0,
    max: 1,
  },
  [FEATURE_TYPES.COLOR.LIGHT]: {
    name: 'Color',
    category: DEVICE_FEATURE_CATEGORIES.LIGHT,
    type: DEVICE_FEATURE_TYPES.LIGHT.COLOR,
    read_only: false,
    keep_history: true,
    has_feedback: true,
    min: 0,
    max: 16777215,
  },
  [FEATURE_TYPES.COLOR.SATURATION]: {
    name: 'Color saturation',
    category: DEVICE_FEATURE_CATEGORIES.LIGHT,
    type: DEVICE_FEATURE_TYPES.LIGHT.SATURATION,
    unit: DEVICE_FEATURE_UNITS.PERCENT,
    read_only: false,
    keep_history: true,
    has_feedback: true,
    min: 0,
    max: 100,
  },
  [FEATURE_TYPES.WHITE.BRIGHTNESS]: {
    name: 'White brightness',
    category: DEVICE_FEATURE_CATEGORIES.LIGHT,
    type: DEVICE_FEATURE_TYPES.LIGHT.BRIGHTNESS,
    unit: DEVICE_FEATURE_UNITS.PERCENT,
    read_only: false,
    keep_history: true,
    has_feedback: true,
    min: 0,
    max: 100,
  },
  [FEATURE_TYPES.WHITE.TEMPERATURE]: {
    name: 'White temperature',
    category: DEVICE_FEATURE_CATEGORIES.LIGHT,
    type: DEVICE_FEATURE_TYPES.LIGHT.TEMPERATURE,
    unit: DEVICE_FEATURE_UNITS.PERCENT,
    read_only: false,
    keep_history: true,
    has_feedback: true,
    min: 0,
    max: 100,
  },
  [FEATURE_TYPES.WHITE.RESET]: {
    name: 'White reset',
    category: DEVICE_FEATURE_CATEGORIES.BUTTON,
    type: DEVICE_FEATURE_TYPES.BUTTON.CLICK,
    read_only: false,
    keep_history: true,
    has_feedback: true,
    min: 0,
    max: 1,
  },
};

const fillFeature = (device, identifier) => {
  const externalId = `${device.external_id}:${identifier}`;
  const feature = { ...FEATURES[identifier], external_id: externalId, selector: externalId };

  addSelector(feature);

  return setDeviceFeature(device, feature);
};

module.exports = {
  fillFeature,
  FEATURE_TYPES,
};
