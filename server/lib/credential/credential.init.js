const db = require('../../models');
const logger = require('../../utils/logger');

/**
 * @description Init credentials in local RAM
 * @returns {Promise} Resolve with inserted credentials.
 * @example
 * gladys.credential.init();
 */
async function init() {
  const credentials = await db.Credential.findAll();
  logger.debug(`Credentials : init : Found ${credentials.length} credentials`);
  const plainCredentials = credentials.map((credential) => {
    const plainCredential = credential.get({ plain: true });
    this.add(plainCredential);
    return plainCredential;
  });
  return plainCredentials;
}

module.exports = {
  init,
};
