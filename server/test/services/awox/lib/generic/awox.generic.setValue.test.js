const { expect } = require('chai');
const sinon = require('sinon');

const { assert, fake } = sinon;

const AwoxGenericManager = require('../../../../../services/awox/lib/generic');

const { DEVICE_FEATURE_CATEGORIES, DEVICE_FEATURE_TYPES } = require('../../../../../utils/constants');
const { SERVICES, CHARACTERISTICS } = require('../../../../../services/awox/lib/generic/awox.generic.constants');

const peripheral = {};

const gladys = {};
const bluetooth = {
  applyOnPeripheral: fake.yields(peripheral),
  writeDevice: fake.resolves(null),
};

describe('awox.generic.setValue', () => {
  afterEach(() => {
    sinon.reset();
  });

  it('Set value with success', async () => {
    const genericManager = new AwoxGenericManager(gladys, bluetooth);

    const device = {
      external_id: 'bluetooth:AABBCCDDEE',
      model: 'any_compatible',
    };

    const feature = {
      external_id: 'bluetooth:AABBCCDDEE:switch',
      category: DEVICE_FEATURE_CATEGORIES.LIGHT,
      type: DEVICE_FEATURE_TYPES.LIGHT.BINARY,
    };
    const value = 1;

    await genericManager.setValue(device, feature, value);

    assert.calledOnce(bluetooth.applyOnPeripheral);
    assert.calledWith(bluetooth.writeDevice, peripheral, SERVICES.EXEC, CHARACTERISTICS.COMMAND, sinon.match.any);
  });

  it('Set value with not managed feature', async () => {
    const genericManager = new AwoxGenericManager(gladys, bluetooth);

    const device = {
      external_id: 'bluetooth:AABBCCDDEE',
      model: 'any_compatible',
    };

    const feature = {
      external_id: 'bluetooth:AABBCCDDEE:unknown',
      category: DEVICE_FEATURE_CATEGORIES.UNKNOWN,
      type: DEVICE_FEATURE_TYPES.UNKNOWN.UNKNOWN,
    };
    const value = 1;

    try {
      await genericManager.setValue(device, feature, value);
      assert.fail();
    } catch (e) {
      expect(e).instanceOf(Error);
    }

    assert.notCalled(bluetooth.applyOnPeripheral);
    assert.notCalled(bluetooth.writeDevice);
  });
});
