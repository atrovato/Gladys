const { expect } = require('chai');
const sinon = require('sinon');

const { assert, fake } = sinon;

const AwoxManager = require('../../../../../services/awox/lib');

const devices = [
  {
    model: 'rcu',
  },
  {
    model: 'any_not_remote',
  },
];
const gladys = {
  device: {
    get: fake.resolves(devices),
  },
};
const serviceId = '9811285e-9f26-4af3-a291-3c3e6b9c7e04';

describe('awox.getRemotes', () => {
  afterEach(() => {
    sinon.reset();
  });

  it('should get single remote', async () => {
    const manager = new AwoxManager(gladys, serviceId);

    const remotes = await manager.getRemotes();

    expect(remotes).lengthOf(1);
    expect(remotes).deep.eq([
      {
        model: 'rcu',
      },
    ]);

    assert.calledWith(gladys.device.get, { service: 'awox' });
  });
});
