const { getModelData } = require('../utils/awox.devices');
const { extractCredentials, getDefaultCredentials } = require('./awox.mesh.utils');

/**
 * @description Pair a Mesh AwoX device
 * @param {Object} device - The device to control.
 * @returns {Promise} Resolve when the message is send to device.
 * @example
 * pair({ external_id: 'bluetooth:0102030405'});
 */
async function pair(device) {
  const [, peripheralUuid] = device.external_id.split(':');
  const { remote } = getModelData(device);
  const credentials = extractCredentials(device);
  const defaultCredentials = getDefaultCredentials(device, remote);

  return this.bluetooth.applyOnPeripheral(peripheralUuid, async (peripheral) => {
    // Authenticate device with default credentials
    const sessionKey = await this.authenticate(peripheral, defaultCredentials);
    // Change device credentials
    return this.changeAuthentication(peripheral, credentials, sessionKey, remote);
  });
}

module.exports = {
  pair,
};
