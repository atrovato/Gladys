const { assert, fake } = require('sinon');
const BroadlinkController = require('../../../../services/broadlink/api/broadlink.controller');

const broadlinkHandler = {
  getPeripherals: fake.resolves(true),
};

describe('GET /api/v1/service/broadlink/peripheral', () => {
  let controller;

  beforeEach(() => {
    controller = BroadlinkController(broadlinkHandler);
  });

  it('Connect test', async () => {
    const req = {};
    const res = {
      json: fake.returns(null),
    };

    await controller['get /api/v1/service/broadlink/peripheral'].controller(req, res);
    assert.calledOnce(broadlinkHandler.getPeripherals);
    assert.calledOnce(res.json);
  });
});
