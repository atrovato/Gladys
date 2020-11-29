const sinon = require('sinon');

const { assert, fake } = sinon;

const AwoxManager = require('../../../../../services/awox/lib');

const gladys = {};
const serviceId = '9811285e-9f26-4af3-a291-3c3e6b9c7e04';
const genericManager = {
  isCompatible: fake.returns(true),
  setValue: fake.resolves(null),
};

describe('awox.setValue', () => {
  let manager;

  beforeEach(() => {
    manager = new AwoxManager(gladys, serviceId);
    manager.managers.push(genericManager);
  });

  afterEach(() => {
    sinon.reset();
  });

  it('should call compatible manager', async () => {
    const device = {
      model: 'any_compatible',
    };
    const feature = {};
    const value = 1;

    await manager.setValue(device, feature, value);

    assert.calledOnce(genericManager.isCompatible);
    assert.calledOnce(genericManager.setValue);
  });
});
