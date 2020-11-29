const logger = require('../../../../utils/logger');
const AwoxGenericManager = require('../generic');
const AwoxMeshManager = require('../mesh');

/**
 * @description Starts AwoX service.
 * @example
 * awox.start();
 */
function start() {
  logger.debug(`AwoX: looking for Bluetooth service...`);
  this.bluetooth = this.gladys.service.getService('bluetooth').device;

  this.managers = [];
  this.managers.push(new AwoxMeshManager(this.gladys, this.bluetooth));
  this.managers.push(new AwoxGenericManager(this.gladys, this.bluetooth));
}

module.exports = {
  start,
};
