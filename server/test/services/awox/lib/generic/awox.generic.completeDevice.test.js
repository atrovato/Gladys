const { expect } = require('chai');

const AwoxGenericManager = require('../../../../../services/awox/lib/generic');

const gladys = {};
const bluetooth = {};

describe('awox.generic.completeDevice', () => {
  it('no options', () => {
    const modelData = {
      remote: false,
      mesh: false,
      color: false,
      white: false,
    };

    const device = {};
    const manager = new AwoxGenericManager(gladys, bluetooth);
    const result = manager.completeDevice(device, modelData);

    const expected = {
      features: [
        {
          category: 'light',
          external_id: 'undefined:switch',
          has_feedback: true,
          keep_history: true,
          max: 1,
          min: 0,
          name: 'Switch',
          read_only: false,
          selector: 'undefined-switch',
          type: 'binary',
        },
      ],
    };
    expect(result).deep.eq(expected);
  });

  it('white device', () => {
    const modelData = {
      remote: false,
      mesh: false,
      color: false,
      white: true,
    };

    const device = {};
    const manager = new AwoxGenericManager(gladys, bluetooth);
    const result = manager.completeDevice(device, modelData);

    const expected = {
      features: [
        {
          category: 'light',
          external_id: 'undefined:switch',
          has_feedback: true,
          keep_history: true,
          max: 1,
          min: 0,
          name: 'Switch',
          read_only: false,
          selector: 'undefined-switch',
          type: 'binary',
        },
        {
          category: 'light',
          external_id: 'undefined:white_brightness',
          has_feedback: true,
          keep_history: true,
          max: 100,
          min: 0,
          name: 'White brightness',
          read_only: false,
          selector: 'undefined-white-brightness',
          type: 'brightness',
          unit: 'percent',
        },
        {
          category: 'button',
          external_id: 'undefined:white_reset',
          has_feedback: true,
          keep_history: true,
          max: 1,
          min: 0,
          name: 'White reset',
          read_only: false,
          selector: 'undefined-white-reset',
          type: 'click',
        },
      ],
    };
    expect(result).deep.eq(expected);
  });

  it('color device', () => {
    const modelData = {
      remote: false,
      mesh: false,
      color: true,
      white: false,
    };

    const device = {};
    const manager = new AwoxGenericManager(gladys, bluetooth);
    const result = manager.completeDevice(device, modelData);

    const expected = {
      features: [
        {
          category: 'light',
          external_id: 'undefined:switch',
          has_feedback: true,
          keep_history: true,
          max: 1,
          min: 0,
          name: 'Switch',
          read_only: false,
          selector: 'undefined-switch',
          type: 'binary',
        },
        {
          category: 'light',
          external_id: 'undefined:white_brightness',
          has_feedback: true,
          keep_history: true,
          max: 100,
          min: 0,
          name: 'White brightness',
          read_only: false,
          selector: 'undefined-white-brightness',
          type: 'brightness',
          unit: 'percent',
        },
        {
          category: 'button',
          external_id: 'undefined:white_reset',
          has_feedback: true,
          keep_history: true,
          max: 1,
          min: 0,
          name: 'White reset',
          read_only: false,
          selector: 'undefined-white-reset',
          type: 'click',
        },
        {
          category: 'light',
          external_id: 'undefined:color_light',
          has_feedback: true,
          keep_history: true,
          max: 16777215,
          min: 0,
          name: 'Color',
          read_only: false,
          selector: 'undefined-color-light',
          type: 'color',
        },
      ],
    };
    expect(result).deep.eq(expected);
  });
});
