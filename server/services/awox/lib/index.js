// Commands
const { start } = require('./commands/awox.start');
const { stop } = require('./commands/awox.stop');
const { getDiscoveredDevice } = require('./commands/awox.getDiscoveredDevice');
const { getDiscoveredDevices } = require('./commands/awox.getDiscoveredDevices');
const { setValue } = require('./commands/awox.setValue');
const { getManager } = require('./commands/awox.getManager');
const { completeDevice } = require('./commands/awox.completeDevice');
const { pair } = require('./commands/awox.pair');
const { getRemotes } = require('./commands/awox.getRemotes');
const { postDelete } = require('./commands/awox.postDelete');

const AwoxManager = function AwoxManager(gladys, serviceId) {
  this.bluetooth = undefined;
  this.gladys = gladys;
  this.serviceId = serviceId;
  this.managers = [];
};

// Commands
AwoxManager.prototype.start = start;
AwoxManager.prototype.stop = stop;
AwoxManager.prototype.getDiscoveredDevice = getDiscoveredDevice;
AwoxManager.prototype.getDiscoveredDevices = getDiscoveredDevices;
AwoxManager.prototype.setValue = setValue;
AwoxManager.prototype.getManager = getManager;
AwoxManager.prototype.completeDevice = completeDevice;
AwoxManager.prototype.pair = pair;
AwoxManager.prototype.getRemotes = getRemotes;
AwoxManager.prototype.postDelete = postDelete;

module.exports = AwoxManager;
