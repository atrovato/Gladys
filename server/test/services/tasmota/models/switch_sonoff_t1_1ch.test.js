const { expect } = require('chai');

const models = require('../../../../services/tasmota/models');
const { DEVICE_FEATURE_CATEGORIES, DEVICE_FEATURE_TYPES } = require('../../../../utils/constants');

const modelId = 28;

describe('TasmotaService - Model - Sonoff T1 1Ch', () => {
  it('get model for Sonoff T1 1Ch', () => {
    const model = models[modelId].getModel();

    expect(model).to.eq('sonoff-t1-1ch');
  });

  it('get label for Sonoff T1 1Ch', () => {
    const label = models[modelId].getLabel();

    expect(label).to.eq('Sonoff T1 1Ch');
  });

  it('get features for Sonoff T1 1Ch', () => {
    const features = models[modelId].getFeatures('device_external_id');

    expect(features).to.deep.eq([
      {
        name: 'Switch',
        external_id: 'device_external_id:switch:binary',
        selector: 'device-external-id-switch-binary',
        category: DEVICE_FEATURE_CATEGORIES.SWITCH,
        type: DEVICE_FEATURE_TYPES.SWITCH.BINARY,
        read_only: false,
        has_feedback: true,
        min: 0,
        max: 1,
      },
    ]);
  });
});
