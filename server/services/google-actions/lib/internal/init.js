const { smarthome } = require('actions-on-google');
const logger = require('../../../../utils/logger');
const { EVENTS, WEBSOCKET_MESSAGE_TYPES } = require('../../../../utils/constants');

/**
 * @description Initialize all needs to make GoogleActions service works.
 * @returns {Promise<boolean>} Indicates if well configured.
 * @example
 * await googleActionsHandler.init();
 */
async function init() {
  logger.info('GoogleActions is initializing...');
  await this.checkClient();

  // Setting up GA Smart Home
  this.smarthome = smarthome();
  this.smarthome.onSync(this.onSync.bind(this));
  this.smarthome.onQuery(this.onQuery.bind(this));
  this.smarthome.onExecute(this.onExecute.bind(this));

  const handleStateEvent = (event) => {
    if (event.type === WEBSOCKET_MESSAGE_TYPES.DEVICE.NEW_STATE) {
      this.reportState(event.payload);
    }
  };
  this.gladys.event.on(EVENTS.WEBSOCKET.SEND_ALL, handleStateEvent.bind(this));

  logger.info('GoogleActions initialization done');
  return true;
}

module.exports = {
  init,
};
