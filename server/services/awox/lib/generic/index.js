const { isCompatible } = require('./awox.generic.isCompatible');
const { completeDevice } = require('./awox.generic.completeDevice');
const { setValue } = require('./awox.generic.setValue');

const AwoxGenericManager = function AwoxGenericManager(gladys, bluetooth) {
  this.gladys = gladys;
  this.bluetooth = bluetooth;
};

AwoxGenericManager.prototype.isCompatible = isCompatible;
AwoxGenericManager.prototype.completeDevice = completeDevice;
AwoxGenericManager.prototype.setValue = setValue;

module.exports = AwoxGenericManager;
