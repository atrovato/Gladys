const { SERVICES, CHARACTERISTICS, PAYLOADS } = require('./awox.mesh.constants');
const { generateRandomBytes, generateSessionKey } = require('./awox.mesh.utils');
const { generatePairCommand } = require('./awox.mesh.commands');
const { BadParameters } = require('../../../../utils/coreErrors');

/**
 * @description Authenticate to Mesh AwoX device.
 * @param {Object} peripheral - The connected Noble peripheral.
 * @param {Object} credentials - Mesh credentials.
 * @returns {Promise} Resolve when the message is send to device.
 * @example
 * authenticate({ external_id: 'bluetooth:0102030405'}, { user: 'meshName', password: 'meshPassword'});
 */
async function authenticate(peripheral, credentials) {
  const randomSession = generateRandomBytes();

  const { user, password } = credentials;
  const pairCommand = generatePairCommand(user, password, randomSession);

  // Ask for authentication
  await this.bluetooth.writeDevice(peripheral, SERVICES.EXEC, CHARACTERISTICS.PAIR, pairCommand, true);

  // Open authentication mode
  // await this.bluetooth.writeDevice(peripheral, SERVICES.EXEC, CHARACTERISTICS.STATUS, PAYLOADS.AUTHENTICATE, true);

  // Get new session value
  const pairValue = await this.bluetooth.readDevice(peripheral, SERVICES.EXEC, CHARACTERISTICS.PAIR);

  // Check session value
  switch (pairValue[0]) {
    case 0x0d:
      return generateSessionKey(user, password, randomSession, pairValue);
    case 0x0e:
      throw new BadParameters(`Awox Mesh: bad authentication for ${peripheral.uuid}, check name and password`);
    default:
      throw new Error(`Unable to authenticate to ${peripheral.uuid}`);
  }
}

module.exports = {
  authenticate,
};
