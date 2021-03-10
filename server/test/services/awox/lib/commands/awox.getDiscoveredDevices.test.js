const { expect } = require('chai');
const { fake, assert } = require('sinon');

const AwoxManager = require('../../../../../services/awox/lib');

const gladys = {};
const serviceId = '9811285e-9f26-4af3-a291-3c3e6b9c7e04';

describe('awox.getDiscoveredDevices', () => {
  let devices;
  let bluetooth;
  let manager;
  let genericManager;

  beforeEach(() => {
    devices = [];
    bluetooth = {
      getDiscoveredDevices: fake.returns(devices),
    };

    genericManager = {
      isCompatible: fake.returns(true),
      completeDevice: (d) => d,
    };

    manager = new AwoxManager(gladys, serviceId);
    manager.bluetooth = bluetooth;
    manager.managers.push(genericManager);
  });

  it('no devices', async () => {
    const awoxDevices = manager.getDiscoveredDevices();

    assert.calledOnce(bluetooth.getDiscoveredDevices);
    assert.notCalled(genericManager.isCompatible);
    expect(awoxDevices).deep.eq([]);
  });

  it('devices', async () => {
    devices.push({ params: [{ name: 'manufacturer_data', value: '6001' }] });

    const awoxDevices = manager.getDiscoveredDevices();

    assert.calledOnce(bluetooth.getDiscoveredDevices);
    assert.calledOnce(genericManager.isCompatible);
    expect(awoxDevices).deep.eq([{ params: [{ name: 'manufacturer_data', value: '6001' }] }]);
  });
});
