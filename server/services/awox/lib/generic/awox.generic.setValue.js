const { generateCommand } = require('./awox.generic.utils');
const { SERVICES, CHARACTERISTICS } = require('./awox.generic.constants');

/**
 * @description Control a classical AwoX device
 * @param {Object} device - The device to control.
 * @param {Object} deviceFeature - The binary deviceFeature to control.
 * @param {number} value - The new value.
 * @returns {Promise} Resolve when the message is send to device.
 * @example
 * setValue({ external_id: 'bluetooth:0102030405'}, { external_id: 'bluetooth:0102030405:switch'}, 1);
 */
async function setValue(device, deviceFeature, value) {
  const [, peripheralUuid] = deviceFeature.external_id.split(':');
  const payload = generateCommand(deviceFeature, value);
  await this.bluetooth.applyOnPeripheral(peripheralUuid, (peripheral) =>
    this.bluetooth.writeDevice(peripheral, SERVICES.EXEC, CHARACTERISTICS.COMMAND, payload),
  );

  return value;
}

module.exports = {
  setValue,
};
