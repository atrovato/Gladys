const { init } = require('./init');
const { discover } = require('./discover');
const { stop } = require('./stop');
const { addPeripheral } = require('./addPeripheral');
const { getPeripherals } = require('./getPeripherals');
const { learn } = require('./learn');

/**
 * @description Add ability to connect to a Broadlink broker.
 * @param {Object} gladys - Gladys instance.
 * @param {Object} broadlink - Broadlink lib.
 * @param {string} serviceId - UUID of the service in DB.
 * @example
 * const broadlinkHandler = new BroadlinkHandler(gladys, client, serviceId);
 */
const BroadlinkHandler = function BroadlinkHandler(gladys, broadlink, serviceId) {
  this.gladys = gladys;
  this.broadlink = broadlink;
  this.serviceId = serviceId;

  this.broadlinkDevices = {};
  this.peripherals = {};
};

BroadlinkHandler.prototype.init = init;
BroadlinkHandler.prototype.discover = discover;
BroadlinkHandler.prototype.stop = stop;
BroadlinkHandler.prototype.addPeripheral = addPeripheral;
BroadlinkHandler.prototype.getPeripherals = getPeripherals;
BroadlinkHandler.prototype.learn = learn;

module.exports = BroadlinkHandler;
