const Sblendid = require('@sblendid/sblendid');
const logger = require('../../../../utils/logger');

/**
 * @description Starts to Bluetooth device.
 * @example
 * bluetooth.start();
 */
async function start() {
  logger.info('Bluetooth : powering on...');

  this.bluetooth = await Sblendid.default.powerOn();
  this.powered = true;
}

module.exports = {
  start,
};
