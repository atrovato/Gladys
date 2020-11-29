const sinon = require('sinon');

const { assert, fake } = sinon;

const AwoxManager = require('../../../../../services/awox/lib');

const gladys = {};
const serviceId = '9811285e-9f26-4af3-a291-3c3e6b9c7e04';

describe('awox.postDelete', () => {
  afterEach(() => {
    sinon.reset();
  });

  it('should call compatible manager', async () => {
    const device = {
      model: 'any_compatible',
    };

    const genericManager = {
      isCompatible: fake.returns(true),
      postDelete: fake.resolves(null),
    };

    const manager = new AwoxManager(gladys, serviceId);
    manager.managers.push(genericManager);

    await manager.postDelete(device);

    assert.calledOnce(genericManager.isCompatible);
    assert.calledOnce(genericManager.postDelete);
  });

  it('should fail no compatible manager', async () => {
    const device = {
      model: 'any_compatible',
    };

    const genericManager = {
      isCompatible: fake.returns(false),
      postDelete: fake.resolves(null),
    };

    const manager = new AwoxManager(gladys, serviceId);
    manager.managers.push(genericManager);

    await manager.postDelete(device);

    assert.calledOnce(genericManager.isCompatible);
    assert.notCalled(genericManager.postDelete);
  });

  it('should fail no delete method manager', async () => {
    const device = {
      model: 'any_compatible',
    };

    const genericManager = {
      isCompatible: fake.returns(true),
    };

    const manager = new AwoxManager(gladys, serviceId);
    manager.managers.push(genericManager);

    await manager.postDelete(device);

    assert.calledOnce(genericManager.isCompatible);
  });
});
