const { expect } = require('chai');
const CredentialManager = require('../../../lib/credential');
const StateManager = require('../../../lib/state');
const { ITEMS } = require('../../../utils/constants');

describe('CredentialManager.add', () => {
  it('should add credentials to state manager', async () => {
    const stateManager = new StateManager({});
    const credentialManager = new CredentialManager(stateManager);

    const credential = {
      id: '90946a0d-5be2-4740-ac8b-26a2d78f12dd',
      item_id: '7f85c2f8-86cc-4600-84db-6c074dadb4e8',
      item_type: ITEMS.DEVICE,
      data: {
        username: 'username',
        password: 'password',
      },
    };
    credentialManager.add(credential);

    const stateCrendential = stateManager.get('deviceCredential', credential.item_id);
    expect(stateCrendential).to.deep.eq(credential);
  });
});
