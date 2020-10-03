const { INFORMATION_SERVICES } = require('../device/bluetooth.information');
const { encodeValue } = require('../utils/bluetooth.utils');

/**
 * @description Control a remote Bluetooth device
 * @param {Object} device - The device to control.
 * @param {Object} deviceFeature - The binary deviceFeature to control.
 * @param {string|number} value - The new value.
 * @param {Object} serviceMap - Object with service UUID as key, containing linked characteristics and functions.
 * @returns {Promise} Resolve when the Bluetooth message is published.
 * @example
 * setValue({ external_id: 'bluetooth:0102030405'}, { external_id: 'mqtt:0102030405:1800:2a6e'}, 1);
 */
async function setValue(device, deviceFeature, value, serviceMap = INFORMATION_SERVICES) {
  const [, peripheralUuid, serviceUuid, characteristicUuid] = deviceFeature.external_id.split(':');

  const encodedValue = encodeValue(serviceMap, serviceUuid, characteristicUuid, value);
  return this.applyOnPeripheral(peripheralUuid, (peripheral) =>
    this.writeDevice(peripheral, serviceUuid, characteristicUuid, encodedValue),
  );
}

module.exports = {
  setValue,
};
