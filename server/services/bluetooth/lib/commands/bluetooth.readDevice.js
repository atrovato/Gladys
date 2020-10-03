const Promise = require('bluebird');

const logger = require('../../../../utils/logger');
const { EVENTS } = require('../../../../utils/constants');

const { INFORMATION_SERVICES } = require('../device/bluetooth.information');
const { decodeValue } = require('../utils/bluetooth.utils');
const { read } = require('../utils/characteristic/bluetooth.read');
const { getCharacteristic } = require('../utils/bluetooth.getCharacteristic');

/**
 * @description Poll value of a Bluetooth device
 * @param {Object} device - The device to control.
 * @param {Object} serviceMap - Object with service UUID as key, containing linked characteristics and functions.
 * @returns {Promise} Promise of all read values.
 * @example
 * await bluetooth.readDevice({ external_id: 'bluetooth:uuid'});
 */
async function readDevice(device, serviceMap = INFORMATION_SERVICES) {
  const [, peripheralUuid] = device.external_id.split(':');

  const readFeature = (feature, peripheral) => {
    const featureExternalId = feature.external_id;
    const [, , serviceUuid, characteristicUuid] = featureExternalId.split(':');

    return getCharacteristic(peripheral, serviceUuid, characteristicUuid)
      .then((characteristic) => read(characteristic))
      .then((value) => {
        const state = decodeValue(INFORMATION_SERVICES, serviceUuid, characteristicUuid, feature, value);
        this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
          device_feature_external_id: featureExternalId,
          state,
        });
        return state;
      })
      .catch((e) => {
        logger.warn(e.message);
        return Promise.resolve();
      });
  };

  const readFeatures = (peripheral) => {
    return Promise.map(device.features, (feature) => readFeature(feature, peripheral), { concurrency: 1 });
  };

  return this.applyOnPeripheral(peripheralUuid, readFeatures);
}

module.exports = {
  readDevice,
};
