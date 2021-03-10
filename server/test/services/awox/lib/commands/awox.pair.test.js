const { expect } = require('chai');
const sinon = require('sinon');

const { assert, fake } = sinon;

const AwoxManager = require('../../../../../services/awox/lib');

const gladys = {};
const serviceId = '9811285e-9f26-4af3-a291-3c3e6b9c7e04';

describe('awox.pair', () => {
  afterEach(() => {
    sinon.reset();
  });

  it('should call compatible manager', async () => {
    const device = {
      model: 'any_compatible',
    };

    const genericManager = {
      isCompatible: fake.returns(true),
      pair: fake.resolves(null),
    };

    const manager = new AwoxManager(gladys, serviceId);
    manager.managers.push(genericManager);

    await manager.pair(device);

    assert.calledOnce(genericManager.isCompatible);
    assert.calledOnce(genericManager.pair);
  });

  it('should fail no compatible manager', async () => {
    const device = {
      model: 'any_compatible',
    };

    const genericManager = {
      isCompatible: fake.returns(false),
      pair: fake.resolves(null),
    };

    const manager = new AwoxManager(gladys, serviceId);
    manager.managers.push(genericManager);

    try {
      await manager.pair(device);
      expect.fail();
    } catch (e) {
      expect(e).instanceOf(Error);
    }

    assert.calledOnce(genericManager.isCompatible);
    assert.notCalled(genericManager.pair);
  });

  it('should fail no pair method manager', async () => {
    const device = {
      model: 'any_compatible',
    };

    const genericManager = {
      isCompatible: fake.returns(true),
    };

    const manager = new AwoxManager(gladys, serviceId);
    manager.managers.push(genericManager);

    try {
      await manager.pair(device);
      expect.fail();
    } catch (e) {
      expect(e).instanceOf(Error);
    }

    assert.calledOnce(genericManager.isCompatible);
  });
});
