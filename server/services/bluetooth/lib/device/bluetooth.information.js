const {
  DEVICE_FEATURE_CATEGORIES,
  DEVICE_FEATURE_TYPES,
  DEVICE_FEATURE_UNITS,
} = require('../../../../utils/constants');
const { setDeviceParam } = require('../../../../utils/setDeviceParam');

const { fillFeature, encodeParamValue } = require('../utils/bluetooth.utils');

const { PARAMS } = require('../utils/bluetooth.constants');

const INFORMATION_SERVICES = {
  // Generic access
  '1800': {
    // Device name
    '2a00': {
      read: (device, value) => {
        device.name = encodeParamValue(value) || device.name;
      },
    },
  },
  // Device information
  '180a': {
    // Manufacturer name
    '2a29': {
      read: (device, value) => {
        const encoded = encodeParamValue(value);
        if (encoded) {
          setDeviceParam(device, PARAMS.MANUFACTURER, encoded);
        }
      },
    },
    // Model
    '2a24': {
      read: (device, value) => {
        device.model = encodeParamValue(value) || device.model;
      },
    },
  },
  // org.bluetooth.service.battery_service
  '180f': {
    // org.bluetooth.characteristic.battery_level
    '2a19': {
      discover: (serviceUuid, characteristic, device) => {
        const feature = {
          name: 'Battery',
          category: DEVICE_FEATURE_CATEGORIES.BATTERY,
          type: DEVICE_FEATURE_TYPES.SENSOR.INTEGER,
          unit: DEVICE_FEATURE_UNITS.PERCENT,
          read_only: true,
          keep_history: true,
          has_feedback: true,
          min: 0,
          max: 100,
        };

        return fillFeature(serviceUuid, characteristic, device, feature);
      },
    },
  },
  // org.bluetooth.service.health_thermometer
  '1809': {
    // org.bluetooth.characteristic.temperature
    '2a6e': {
      discover: (serviceUuid, characteristic, device) => {
        const feature = {
          name: 'Temperature',
          category: DEVICE_FEATURE_CATEGORIES.TEMPERATURE_SENSOR,
          type: DEVICE_FEATURE_TYPES.SENSOR.DECIMAL,
          read_only: true,
          keep_history: true,
          has_feedback: true,
          min: -100,
          max: 250,
        };

        return fillFeature(serviceUuid, characteristic, device, feature);
      },
    },
    // org.bluetooth.characteristic.temperature_celsius
    '2a1f': {
      discover: (serviceUuid, characteristic, device) => {
        const feature = {
          name: 'Temperature',
          category: DEVICE_FEATURE_CATEGORIES.TEMPERATURE_SENSOR,
          type: DEVICE_FEATURE_TYPES.SENSOR.DECIMAL,
          unit: DEVICE_FEATURE_UNITS.CELSIUS,
          read_only: true,
          keep_history: true,
          has_feedback: true,
          min: -100,
          max: 250,
        };

        return fillFeature(serviceUuid, characteristic, device, feature);
      },
    },
    // org.bluetooth.characteristic.temperature_fahrenheit
    '2a20': {
      discover: (serviceUuid, characteristic, device) => {
        const feature = {
          name: 'Temperature',
          category: DEVICE_FEATURE_CATEGORIES.TEMPERATURE_SENSOR,
          type: DEVICE_FEATURE_TYPES.SENSOR.DECIMAL,
          unit: DEVICE_FEATURE_UNITS.FAHRENHEIT,
          read_only: true,
          keep_history: true,
          has_feedback: true,
          min: -200,
          max: 500,
        };

        return fillFeature(serviceUuid, characteristic, device, feature);
      },
    },
  },
};

module.exports = {
  INFORMATION_SERVICES,
};
