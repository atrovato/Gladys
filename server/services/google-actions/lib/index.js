const { init } = require('./internal/init');
const { checkClient } = require('./internal/checkClient');
const { storeParams } = require('./internal/storeParams');
const { onDisconnect } = require('./smarthome/onDisconnect');
const { onSync } = require('./smarthome/onSync');
const { onQuery } = require('./smarthome/onQuery');
const { onExecute } = require('./smarthome/onExecute');
const { reportState } = require('./smarthome/reportState');

/**
 * @description Add ability to connect to Google Actions.
 * @param {Object} gladys - Gladys instance.
 * @param {string} serviceId - UUID of the service in DB.
 * @example
 * const googleActionsHandler = new GoogleActionsHandler(gladys, serviceId);
 */
const GoogleActionsHandler = function GoogleActionsHandler(gladys, serviceId) {
  this.gladys = gladys;
  this.serviceId = serviceId;

  this.smarthome = null;
  this.userSmarthome = {};
};

// Internal functions
GoogleActionsHandler.prototype.init = init;
GoogleActionsHandler.prototype.checkClient = checkClient;
GoogleActionsHandler.prototype.storeParams = storeParams;

// GoogleActions functions
GoogleActionsHandler.prototype.onDisconnect = onDisconnect;
GoogleActionsHandler.prototype.onSync = onSync;
GoogleActionsHandler.prototype.onQuery = onQuery;
GoogleActionsHandler.prototype.onExecute = onExecute;
GoogleActionsHandler.prototype.reportState = reportState;

module.exports = GoogleActionsHandler;
