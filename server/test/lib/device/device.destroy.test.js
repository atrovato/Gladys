const EventEmitter = require('events');
const sinon = require('sinon');

const { assert } = require('chai');
const Device = require('../../../lib/device');
const StateManager = require('../../../lib/state');

const event = new EventEmitter();

describe('Device.destroy', () => {
  afterEach(() => {
    sinon.reset();
  });

  it('should destroy device', async () => {
    const stateManager = new StateManager(event);
    const credentialManager = {
      destroy: sinon.fake.resolves(null),
    };
    const device = new Device(event, {}, stateManager, {}, {}, {}, credentialManager);
    device.devicesByPollFrequency[60000] = [
      {
        selector: 'test-device',
      },
    ];
    await device.destroy('test-device');

    sinon.assert.calledOnce(credentialManager.destroy);
  });
  it('should return device not found', async () => {
    const stateManager = new StateManager(event);
    const device = new Device(event, {}, stateManager, {});
    const promise = device.destroy('doesnotexist');
    return assert.isRejected(promise);
  });
});
