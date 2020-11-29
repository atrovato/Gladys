const { expect } = require('chai');
const { fake, assert } = require('sinon');

const AwoxManager = require('../../../../../services/awox/lib');

const gladys = {};
const serviceId = '9811285e-9f26-4af3-a291-3c3e6b9c7e04';

describe('awox.getDiscoveredDevice', () => {
  let manager;

  beforeEach(() => {
    manager = new AwoxManager(gladys, serviceId);
    manager.bluetooth = {};
  });

  it('no device', async () => {
    manager.bluetooth = {
      getDiscoveredDevice: fake.returns(null),
    };

    const awoxDevice = manager.getDiscoveredDevice('any');

    assert.calledOnce(manager.bluetooth.getDiscoveredDevice);
    expect(awoxDevice).deep.eq(null);
  });

  it('devices', async () => {
    manager.bluetooth = {
      getDiscoveredDevice: fake.returns({ params: [{ name: 'manufacturer', value: 'awox' }] }),
    };

    const awoxDevices = manager.getDiscoveredDevice('any');

    assert.calledOnce(manager.bluetooth.getDiscoveredDevice);
    expect(awoxDevices).deep.eq({ params: [{ name: 'manufacturer', value: 'awox' }] });
  });
});
