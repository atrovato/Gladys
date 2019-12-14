const logger = require('../../utils/logger');
const BroadlinkHandler = require('./lib');
const BroadlinkController = require('./api/broadlink.controller');

module.exports = function BroadlinkService(gladys, serviceId) {
  const { Broadlink } = require('broadlink-js');
  const broadlinkHandler = new BroadlinkHandler(gladys, new Broadlink(), serviceId);

  /**
   * @public
   * @description This function starts service
   * @example
   * gladys.services.broadlink.start();
   */
  async function start() {
    logger.log('starting Broadlink service');
    broadlinkHandler.init();

    broadlinkHandler.discover();
  }

  /**
   * @public
   * @description This function stops the service
   * @example
   *  gladys.services.broadlink.stop();
   */
  async function stop() {
    logger.log('stopping Broadlink service');
    broadlinkHandler.stop();
  }

  return Object.freeze({
    start,
    stop,
    client: broadlinkHandler,
    controllers: BroadlinkController(broadlinkHandler),
  });
};
