const Promise = require('bluebird');

const { EVENTS } = require('../../../../utils/constants');

const { INFORMATION_SERVICES } = require('../device/bluetooth.information');
const { decodeValue } = require('../utils/bluetooth.utils');
const { subscribe } = require('../utils/characteristic/bluetooth.subscribe');
const { read } = require('../utils/characteristic/bluetooth.read');
const { getCharacteristic } = require('../utils/bluetooth.getCharacteristic');

/**
 * @description Subscribes to peripheral characteristic.
 * @param {Object} peripheral - Connected Noble peripheral.
 * @param {string} serviceUuid - Service UUID.
 * @param {string} characteristicUuid - Characteristic UUID.
 * @param {string} feature - Type of data to read.
 * @param {Object} serviceMap - Object with service UUID as key, containing linked characteristics and functions.
 * @returns {Promise<Object>} The write value.
 * @example
 * await subscribePeripheral({ uuid: 'peripheral' }, 'service1', 'char1', {})
 */
async function subscribePeripheral(
  peripheral,
  serviceUuid,
  characteristicUuid,
  feature,
  serviceMap = INFORMATION_SERVICES,
) {
  const onNotify = (value) => {
    this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
      device_feature_external_id: `bluetooth:${peripheral.uuid}:${serviceUuid}:${characteristicUuid}`,
      state: decodeValue(serviceMap, serviceUuid, characteristicUuid, feature, value),
    });
  };

  return getCharacteristic(peripheral, serviceUuid, characteristicUuid).then((characteristic) =>
    subscribe(characteristic, onNotify).then(() => read(characteristic).then((value) => onNotify(value))),
  );
}

module.exports = {
  subscribePeripheral,
};
