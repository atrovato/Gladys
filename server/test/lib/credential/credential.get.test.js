const { expect } = require('chai');
const CredentialManager = require('../../../lib/credential');
const StateManager = require('../../../lib/state');
const { ITEMS } = require('../../../utils/constants');

describe('CredentialManager.get', () => {
  it('should get credentials from DB', async () => {
    const stateManager = new StateManager({});
    const credentialManager = new CredentialManager(stateManager);

    const itemId = 'a1ce3d5a-dd7c-4452-9a23-d44ba3d9b072';
    const itemType = ITEMS.DEVICE;
    const credential = await credentialManager.get(itemId, itemType);

    expect(credential).to.deep.eq({ username: 'device_username', password: 'device_password' });
  });

  it('should get null credentials from DB', async () => {
    const stateManager = new StateManager({});
    const credentialManager = new CredentialManager(stateManager);

    const itemId = 'unknown';
    const itemType = ITEMS.DEVICE;
    const credential = await credentialManager.get(itemId, itemType);

    expect(credential).to.eq(null);
  });
});
