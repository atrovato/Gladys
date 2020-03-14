const { expect } = require('chai');
const CredentialManager = require('../../../lib/credential');
const StateManager = require('../../../lib/state');

describe('CredentialManager.init', () => {
  it('should load credentials', async () => {
    const stateManager = new StateManager({});
    const credentialManager = new CredentialManager(stateManager);

    const credentials = await credentialManager.init();
    expect(credentials).to.be.instanceOf(Array);
  });
});
