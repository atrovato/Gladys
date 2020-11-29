const { isCompatible } = require('./awox.mesh.isCompatible');
const { authenticate } = require('./awox.mesh.authenticate');
const { changeAuthentication } = require('./awox.mesh.changeAuthentication');
const { decodeState } = require('./awox.mesh.decodeState');
const { setValue } = require('./awox.mesh.setValue');
const { pair } = require('./awox.mesh.pair');
const { completeDevice } = require('./awox.mesh.completeDevice');
const { getSessionKey } = require('./awox.mesh.getSessionKey');
const { postDelete } = require('./awox.mesh.postDelete');
const { execCommand } = require('./awox.mesh.execCommand');

const AwoxMeshManager = function AwoxMeshManager(gladys, bluetooth) {
  this.gladys = gladys;
  this.bluetooth = bluetooth;
};

AwoxMeshManager.prototype.isCompatible = isCompatible;
AwoxMeshManager.prototype.authenticate = authenticate;
AwoxMeshManager.prototype.changeAuthentication = changeAuthentication;
AwoxMeshManager.prototype.decodeState = decodeState;
AwoxMeshManager.prototype.setValue = setValue;
AwoxMeshManager.prototype.pair = pair;
AwoxMeshManager.prototype.completeDevice = completeDevice;
AwoxMeshManager.prototype.getSessionKey = getSessionKey;
AwoxMeshManager.prototype.postDelete = postDelete;
AwoxMeshManager.prototype.execCommand = execCommand;

module.exports = AwoxMeshManager;
