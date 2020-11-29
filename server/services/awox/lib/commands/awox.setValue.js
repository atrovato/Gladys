/**
 * @description Control an AwoX device
 * @param {Object} device - The device to control.
 * @param {Object} deviceFeature - The binary deviceFeature to control.
 * @param {string|number} value - The new value.
 * @returns {Promise} Resolve when the message is send to device.
 * @example
 * setValue({ external_id: 'bluetooth:0102030405'}, { external_id: 'bluetooth:0102030405:switch'}, 1);
 */
async function setValue(device, deviceFeature, value) {
  const compatibleManager = this.getManager(device);
  return compatibleManager.setValue(device, deviceFeature, value);
}

module.exports = {
  setValue,
};
