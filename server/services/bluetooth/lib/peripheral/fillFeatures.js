const {
  DEVICE_FEATURE_CATEGORIES,
  DEVICE_FEATURE_TYPES,
  DEVICE_POLL_FREQUENCIES,
} = require('../../../../utils/constants');
const { addSelector } = require('../../../../utils/addSelector');
const { loopOnServicesAndCharacteristics } = require('../wrapper/peripheral/loopOnServicesAndCharacteristics');

const addFeature = (characteristic, device, tmpFeature) => {
  const serviceUuid = characteristic.service.uuid;
  const externalId = `${device.external_id}:${serviceUuid}`;
  const feature = { ...tmpFeature, external_id: externalId, selector: externalId };
  addSelector(feature);
  device.features.push(feature);
};

const FEATURE_SERVICES = {
  // Battery
  '180f': {
    '2a19': (characteristic, device) => {
      const feature = {
        category: DEVICE_FEATURE_CATEGORIES.BATTERY,
        type: DEVICE_FEATURE_TYPES.SENSOR.INTEGER,
        should_poll: !characteristic.notify,
      };

      if (feature.should_poll) {
        feature.poll_frequency = DEVICE_POLL_FREQUENCIES.EVERY_MINUTES;
      }

      addFeature(characteristic, device, feature);
    },
  },
};

/**
 * @description Fill device with managed and recognized features.
 * @param {Object} peripheral - Bluetooth peripheral.
 * @param {Object} device - Bluetooth device.
 * @returns {Promise<Array>} Peripheral managed features.
 * @example
 * fillFeatures({}, {});
 */
async function fillFeatures(peripheral, device) {
  return loopOnServicesAndCharacteristics(peripheral, device, FEATURE_SERVICES);
}

module.exports = {
  fillFeatures,
};
