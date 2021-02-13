const { PlatformNotCompatible } = require('../../utils/coreErrors');

/**
 * @description Remove an Docker container.
 * @param {string} containerId - Container id.
 * @returns {Promise} The removed container.
 * @example
 * await removeContainer(options);
 */
async function removeContainer(containerId) {
  if (!this.dockerode) {
    throw new PlatformNotCompatible('SYSTEM_NOT_RUNNING_DOCKER');
  }

  const container = await this.dockerode.getContainer(containerId);
  return container.remove();
}

module.exports = {
  removeContainer,
};
