const { expect } = require('chai');
const sinon = require('sinon');

const { assert, fake } = sinon;

const AwoxManager = require('../../../../../services/awox/lib');
const { PARAMS } = require('../../../../../services/bluetooth/lib/utils/bluetooth.constants');

const gladys = {};
const serviceId = '9811285e-9f26-4af3-a291-3c3e6b9c7e04';

describe('awox.getManager', () => {
  let manager;
  let manager1;
  let manager2;

  beforeEach(() => {
    manager1 = {
      isCompatible: fake.returns(false),
    };
    manager2 = {
      isCompatible: fake.returns(false),
    };

    manager = new AwoxManager(gladys, serviceId);
    manager.managers.push(manager1);
    manager.managers.push(manager2);
  });

  afterEach(() => {
    sinon.reset();
  });

  it('no compatible manager', () => {
    const device = {
      params: [
        {
          name: PARAMS.MANUFACTURER,
          value: 'awox',
        },
      ],
    };

    try {
      manager.getManager(device);
    } catch (e) {
      expect(e).instanceOf(Error);
    }

    assert.calledOnce(manager1.isCompatible);
    assert.calledOnce(manager2.isCompatible);
  });

  it('only first manager is compatible', () => {
    manager1.isCompatible = fake.returns(true);

    const device = {
      params: [
        {
          name: PARAMS.MANUFACTURER,
          value: 'awox',
        },
      ],
    };

    const result = manager.getManager(device);
    expect(result).is.deep.eq(manager1);

    assert.calledOnce(manager1.isCompatible);
    assert.notCalled(manager2.isCompatible);
  });

  it('only second manager is compatible', () => {
    manager2.isCompatible = fake.returns(true);

    const device = {
      params: [
        {
          name: PARAMS.MANUFACTURER,
          value: 'awox',
        },
      ],
    };

    const result = manager.getManager(device);
    expect(result).is.deep.eq(manager2);

    assert.calledOnce(manager1.isCompatible);
    assert.calledOnce(manager2.isCompatible);
  });

  it('only both managers are compatible', () => {
    manager1.isCompatible = fake.returns(true);
    manager2.isCompatible = fake.returns(true);

    const device = {};

    const result = manager.getManager(device);
    expect(result).is.deep.eq(manager1);

    assert.calledOnce(manager1.isCompatible);
    assert.notCalled(manager2.isCompatible);
  });
});
