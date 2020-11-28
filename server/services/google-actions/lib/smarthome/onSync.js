const logger = require('../../../../utils/logger');
const { syncDeviceConverter } = require('../utils/syncDeviceConverter');

/**
 * @description The function that will run for an SYNC request.
 * It should return a valid response or a Promise that resolves to valid response.
 * @param {Object} body - Request body.
 * @param {Object} headers - Request headers.
 * @returns {Promise} A valid response.
 * @example
 * googleActions.onSync({}, {});
 *
 * @see https://actions-on-google.github.io/actions-on-google-nodejs/interfaces/smarthome.smarthomeapp.html#onsync
 */
async function onSync(body, headers) {
  const { user, requestId } = body;

  logger.debug('GoogleActions: syncing...');

  // Get all Gladys devices
  const gladysDevices = Object.values(this.gladys.stateManager.state.device).map((store) => store.get());
  // Convert it to managed Google devices
  const devices = gladysDevices.map((d) => syncDeviceConverter(d)).filter((d) => d !== null);

  logger.debug('GoogleActions: synced');

  return {
    requestId,
    payload: {
      agentUserId: user.selector,
      devices,
    },
  };
}

module.exports = {
  onSync,
};