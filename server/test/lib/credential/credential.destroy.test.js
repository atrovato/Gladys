const { expect } = require('chai');
const CredentialManager = require('../../../lib/credential');
const { ITEMS } = require('../../../utils/constants');
const db = require('../../../models');

describe('CredentialManager.destroy', () => {
  it('should destroy credentials from database and state manager', async () => {
    // @ts-ignore
    const { stateManager } = global.TEST_GLADYS_INSTANCE;

    const itemId = 'a1ce3d5a-dd7c-4452-9a23-d44ba3d9b072';
    const itemType = ITEMS.DEVICE;

    // Check that credential is well loaded
    const stateCrendential = stateManager.get('deviceCredential', itemId);
    expect(stateCrendential).to.be.instanceOf(Object);

    const credentialManager = new CredentialManager(stateManager);

    await db.sequelize.transaction(async (transaction) => {
      return credentialManager.destroy(itemId, itemType, transaction);
    });

    const nbInDb = await db.Credential.count({
      where: {
        item_type: 'device',
      },
    });
    expect(nbInDb).to.eq(0);

    const deletedStateCrendential = stateManager.get('deviceCredential', itemId);
    expect(deletedStateCrendential).to.eq(null);
  });
});
