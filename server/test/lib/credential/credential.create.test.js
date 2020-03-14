const { expect } = require('chai');
const CredentialManager = require('../../../lib/credential');
const StateManager = require('../../../lib/state');
const { ITEMS } = require('../../../utils/constants');
const db = require('../../../models');

describe('CredentialManager.create', () => {
  it('should create credentials into database and into state manager', async () => {
    const stateManager = new StateManager({});
    const credentialManager = new CredentialManager(stateManager);

    const itemId = '7f85c2f8-86cc-4600-84db-6c074dadb4e8';
    const itemType = ITEMS.DEVICE;
    const credential = {
      username: 'username',
      password: 'password',
    };

    const storedCrendential = await db.sequelize.transaction(async (transaction) => {
      return credentialManager.create(credential, itemId, itemType, transaction);
    });

    expect(storedCrendential).to.haveOwnProperty('id');
    expect(storedCrendential.data).to.deep.eq(credential);

    const stateCrendential = stateManager.get('deviceCredential', itemId);
    expect(stateCrendential).to.be.instanceOf(Object);
    expect(stateCrendential.data).to.deep.eq(credential);
  });
});
