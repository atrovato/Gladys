const logger = require('../../utils/logger');
const GoogleActionsHandler = require('./lib');
const GoogleActionsController = require('./api/google-actions.controller');

module.exports = function GoogleActionsService(gladys, serviceId) {
  const googleActionsHandler = new GoogleActionsHandler(gladys, serviceId);

  /**
   * @public
   * @description This function starts service
   * @example
   * gladys.services['google-actions'].start();
   */
  async function start() {
    logger.log('starting GoogleActions service');
    await googleActionsHandler.init();
  }

  /**
   * @public
   * @description This function stops the service
   * @example
   *  gladys.services['google-actions'].stop();
   */
  async function stop() {
    logger.log('stopping GoogleActions service');
  }

  return Object.freeze({
    start,
    stop,
    controllers: GoogleActionsController(googleActionsHandler),
  });
};
