const { setDeviceParam } = require('../../../../utils/setDeviceParam');

const { PARAMS } = require('./awox.mesh.constants');
const { extractCredentials } = require('./awox.mesh.utils');

/**
 * @description Get device session key.
 * @param {Object} device - Device to get session key from..
 * @param {Object} peripheral - Peripheral to get session key from..
 * @param {boolean} updateDevice - Indicate if device can be updated.
 * @returns {Promise<Buffer>} Resolve with session key.
 * @example
 * await getSessionKey({ external_id: 'bluetooth:0102030405'});
 */
async function getSessionKey(device, peripheral, updateDevice) {
  const sessionKeyParam = device.params.find((p) => p.name === PARAMS.MESH_SESSION_KEY);

  if (sessionKeyParam) {
    return Buffer.from(sessionKeyParam.value, 'hex');
  }

  // Check and extract credentials
  const credentials = extractCredentials(device);
  // Authenticate device
  const sessionKeyValue = await this.authenticate(peripheral, credentials);

  // Store device only if already stored
  if (updateDevice && device.id) {
    setDeviceParam(device, PARAMS.MESH_SESSION_KEY, sessionKeyValue.toString('hex'));
    await this.gladys.device.create(device);
  }

  return sessionKeyValue;
}

module.exports = {
  getSessionKey,
};
