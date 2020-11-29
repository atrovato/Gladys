const logger = require('../../../../utils/logger');
const { SERVICES, CHARACTERISTICS, PAYLOADS, TIMERS, DEFAULTS } = require('./awox.mesh.constants');
const { encrypt } = require('./awox.mesh.utils');

/**
 * @description Change authentication of a Mesh AwoX device.
 * @param {Object} peripheral - The connected Noble peripheral.
 * @param {Object} credentials - Mesh credentials.
 * @param {Buffer} meshSession - Mesh session.
 * @param {boolean} remote - Remote device.
 * @returns {Promise} Resolve when the message is send to device.
 * @example
 * changeAuthentication({ external_id: 'bluetooth:0102030405'}, { user: 'meshName', password: 'meshPassword'}, [0x00]);
 */
async function changeAuthentication(peripheral, credentials, meshSession, remote) {
  // Send user
  const userPayload = Buffer.concat([
    Buffer.from(PAYLOADS.USER_KEY),
    encrypt(meshSession, Buffer.from(credentials.user, 'utf-8')),
  ]);
  logger.info(`AwoX Mesh: pairing - sending user...`);
  await this.bluetooth.writeDevice(peripheral, SERVICES.EXEC, CHARACTERISTICS.PAIR, userPayload, true);

  // Send password
  const passwordPayload = Buffer.concat([
    Buffer.from(PAYLOADS.PASSWORD_KEY),
    encrypt(meshSession, Buffer.from(credentials.password, 'utf-8')),
  ]);
  logger.info(`AwoX Mesh: pairing - sending password...`);
  await this.bluetooth.writeDevice(peripheral, SERVICES.EXEC, CHARACTERISTICS.PAIR, passwordPayload, true);

  // Send long term key
  const longTermKeyPayload = Buffer.concat([
    Buffer.from(PAYLOADS.LONG_TERM_KEY),
    encrypt(meshSession, Buffer.from(DEFAULTS.LONG_TERM_KEY, 'utf-8')),
  ]);
  logger.info(`AwoX Mesh: pairing - sending long term key...`);
  await this.bluetooth.writeDevice(peripheral, SERVICES.EXEC, CHARACTERISTICS.PAIR, longTermKeyPayload, true);

  if (!remote) {
    // Wait
    await new Promise((resolve) => setTimeout(resolve, TIMERS.PAIR));

    // Read for pairing response
    logger.info(`AwoX Mesh: pairing - reading result...`);
    const response = await this.bluetooth.readDevice(peripheral, SERVICES.EXEC, CHARACTERISTICS.PAIR);

    // Check session value
    switch (response[0]) {
      case 0x07:
        return response;
      default:
        throw new Error(`Unable to change authentication to ${peripheral.uuid}`);
    }
  }

  return null;
}

module.exports = {
  changeAuthentication,
};
