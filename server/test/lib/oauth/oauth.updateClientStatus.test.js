const { expect } = require('chai');
const OauthManager = require('../../../lib/oauth');
const { NotFoundError } = require('../../../utils/coreErrors');

describe('oauth.updateClientStatus', () => {
  const oauthManager = new OauthManager({}, {});

  it('should update OAuth client status', async () => {
    const status = await oauthManager.updateClientStatus('oauth_client_1', false);
    expect(status).to.eq(false);
  });

  it('should fail on update OAuth missing client status', async () => {
    try {
      await oauthManager.updateClientStatus('oauth_client_unkown', true);
    } catch (e) {
      expect(e).to.be.instanceOf(NotFoundError);
    }
  });
});
