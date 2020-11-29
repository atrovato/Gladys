const { expect } = require('chai');
const sinon = require('sinon');

const { assert, fake } = sinon;

const AwoxManager = require('../../../../../services/awox/lib');

const gladys = {};
const serviceId = '9811285e-9f26-4af3-a291-3c3e6b9c7e04';

describe('awox.completeDevice', () => {
  let manager;
  let genericManager;

  beforeEach(() => {
    genericManager = {
      isCompatible: fake.returns(true),
      completeDevice: fake.returns({}),
    };

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

    manager.completeDevice(device);

    assert.calledOnce(genericManager.isCompatible);
    assert.calledOnce(genericManager.completeDevice);
  });

  it('should call compatible manager', async () => {
    genericManager.isCompatible = fake.returns(false);

    const device = {
      model: 'any_compatible',
    };

    const result = manager.completeDevice(device);

    assert.calledOnce(genericManager.isCompatible);
    assert.notCalled(genericManager.completeDevice);
    expect(result).deep.eq(device);
  });
});
