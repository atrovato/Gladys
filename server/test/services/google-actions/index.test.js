const sinon = require('sinon');

const { assert, fake } = sinon;
const GoogleActionsService = require('../../../services/google-actions');

const gladys = {
  variable: {
    getValue: fake.resolves('MY_PROJECT'),
  },
  oauth: {
    getClient: fake.resolves({
      redirect_uris: [`https://oauth-redirect.googleusercontent.com/r/MY_PROJECT`],
    }),
  },
  event: {
    on: fake.resolves(true),
  },
};
const serviceId = 'd1e45425-fe25-4968-ac0f-bc695d5202d9';

describe('GoogleActionsService', () => {
  beforeEach(() => {
    sinon.reset();
  });

  const googleActionsService = GoogleActionsService(gladys, serviceId);
  it('should start service (not initailzed)', async () => {
    await googleActionsService.start();
    assert.calledWith(gladys.oauth.getClient, 'google-actions');
    assert.calledWith(gladys.variable.getValue, 'GOOGLEACTIONS_PROJECT_KEY', serviceId);
    assert.calledOnce(gladys.event.on);
  });

  it('should stop service', async () => {
    googleActionsService.stop();
    assert.notCalled(gladys.oauth.getClient);
  });
});
