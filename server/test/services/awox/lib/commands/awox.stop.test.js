const { expect } = require('chai');

const AwoxManager = require('../../../../../services/awox/lib');

const bluetooth = {};
const gladys = {};
const serviceId = '9811285e-9f26-4af3-a291-3c3e6b9c7e04';

describe('awox.stop', () => {
  let manager;

  beforeEach(() => {
    manager = new AwoxManager(gladys, serviceId);
  });

  it('should stop manager', async () => {
    manager.bluetooth = bluetooth;

    await manager.stop();

    expect(manager.bluetooth).is.eq(undefined);
  });
});
