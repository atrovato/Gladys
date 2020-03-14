const { init } = require('./credential.init');
const { add } = require('./credential.add');
const { create } = require('./credential.create');
const { destroy } = require('./credential.destroy');

const CredentialManager = function CredentialsManager(stateManager) {
  this.stateManager = stateManager;
};

CredentialManager.prototype.init = init;
CredentialManager.prototype.add = add;
CredentialManager.prototype.create = create;
CredentialManager.prototype.destroy = destroy;

module.exports = CredentialManager;
