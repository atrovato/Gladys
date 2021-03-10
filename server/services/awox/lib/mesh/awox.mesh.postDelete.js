const { getModelData } = require('../utils/awox.devices');
const { PARAMS } = require('./awox.mesh.constants');
const { generateCategoryCommand } = require('./awox.mesh.commands');

/**
 * @description Reset a paired device not linked to a remote on delete.
 * @param {Object} device - The device to reset.
 * @returns {Promise} Resolve when the reset message is send to device.
 * @example
 * postDelete({ external_id: 'bluetooth:0102030405'});
 */
async function postDelete(device) {
  const linkedToRemote = device.params.find((p) => p.name === PARAMS.MESH_REMOTE);
  const { remote } = getModelData(device);

  if (!linkedToRemote && !remote) {
    const command = generateCategoryCommand('reset');
    return this.execCommand(device, command, false);
  }

  return null;
}

module.exports = {
  postDelete,
};
