const { getModelData } = require('../utils/awox.devices');

/**
 * @description Get AwoX remotes.
 * @returns {Promise<Array>} AwoX remotes.
 * @example
 * awox.getRemotes();
 */
async function getRemotes() {
  const allDevices = await this.gladys.device.get({ service: 'awox' });
  return allDevices.filter((device) => {
    const { remote } = getModelData(device);
    return remote;
  });
}

module.exports = {
  getRemotes,
};
