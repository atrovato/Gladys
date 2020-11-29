const { expect } = require('chai');

const { generateCommand } = require('../../../../../services/awox/lib/generic/awox.generic.utils');

const { COMMANDS } = require('../../../../../services/awox/lib/generic/awox.generic.constants');
const { DEVICE_FEATURE_CATEGORIES, DEVICE_FEATURE_TYPES } = require('../../../../../utils/constants');
const { BadParameters } = require('../../../../../utils/coreErrors');

describe('awox.generic.utils.generateCommand', () => {
  it('Unknwon category', async () => {
    const feature = {
      category: DEVICE_FEATURE_CATEGORIES.UNKNOWN,
      type: DEVICE_FEATURE_TYPES.UNKNOWN.UNKNOWN,
    };
    const value = 1;
    try {
      generateCommand(feature, value);
      expect.fail();
    } catch (e) {
      expect(e).instanceOf(BadParameters);
    }
  });

  it('Button category / invalid type', async () => {
    const feature = {
      category: DEVICE_FEATURE_CATEGORIES.BUTTON,
      type: DEVICE_FEATURE_TYPES.UNKNOWN.UNKNOWN,
    };
    const value = 1;
    try {
      generateCommand(feature, value);
      expect.fail();
    } catch (e) {
      expect(e).instanceOf(BadParameters);
    }
  });

  it('Button light / invalid type', async () => {
    const feature = {
      category: DEVICE_FEATURE_CATEGORIES.LIGHT,
      type: DEVICE_FEATURE_TYPES.UNKNOWN.UNKNOWN,
    };
    const value = 1;
    try {
      generateCommand(feature, value);
      expect.fail();
    } catch (e) {
      expect(e).instanceOf(BadParameters);
    }
  });

  it('Button category / click type', async () => {
    const feature = {
      category: DEVICE_FEATURE_CATEGORIES.BUTTON,
      type: DEVICE_FEATURE_TYPES.BUTTON.CLICK,
    };
    const value = 1;

    const command = generateCommand(feature, value);
    const expected = COMMANDS.RESET.slice(0, 14);
    expect(command.slice(0, 14)).deep.eq(expected);
  });

  it('Light category / binary type (value = 0)', async () => {
    const feature = {
      category: DEVICE_FEATURE_CATEGORIES.LIGHT,
      type: DEVICE_FEATURE_TYPES.LIGHT.BINARY,
    };
    const value = 0;

    const command = generateCommand(feature, value);
    const expected = COMMANDS.OFF;
    expect(command).deep.eq(expected);
  });

  it('Light category / binary type (value = 1)', async () => {
    const feature = {
      category: DEVICE_FEATURE_CATEGORIES.LIGHT,
      type: DEVICE_FEATURE_TYPES.LIGHT.BINARY,
    };
    const value = 1;

    const command = generateCommand(feature, value);
    const expected = COMMANDS.ON;
    expect(command).deep.eq(expected);
  });

  it('Light category / saturation type (value = 0)', async () => {
    const feature = {
      category: DEVICE_FEATURE_CATEGORIES.LIGHT,
      type: DEVICE_FEATURE_TYPES.LIGHT.SATURATION,
    };
    const value = 0;

    const command = generateCommand(feature, value);
    const expected = [...COMMANDS.BRIGHTNESS];
    expected[8] = 0x02;
    expected[9] = 0x58;
    expected[10] = 0x83;
    expect(command).deep.eq(expected);
  });

  it('Light category / saturation type (value = 25)', async () => {
    const feature = {
      category: DEVICE_FEATURE_CATEGORIES.LIGHT,
      type: DEVICE_FEATURE_TYPES.LIGHT.SATURATION,
    };
    const value = 25;

    const command = generateCommand(feature, value);
    const expected = [...COMMANDS.BRIGHTNESS];
    expected[8] = 0x04;
    expected[9] = 0xbd;
    expected[10] = 0xea;
    expect(command).deep.eq(expected);
  });

  it('Light category / saturation type (value = 50)', async () => {
    const feature = {
      category: DEVICE_FEATURE_CATEGORIES.LIGHT,
      type: DEVICE_FEATURE_TYPES.LIGHT.SATURATION,
    };
    const value = 50;

    const command = generateCommand(feature, value);
    const expected = [...COMMANDS.BRIGHTNESS];
    expected[8] = 0x07;
    expected[9] = 0x21;
    expected[10] = 0x51;
    expect(command).deep.eq(expected);
  });

  it('Light category / saturation type (value = 75)', async () => {
    const feature = {
      category: DEVICE_FEATURE_CATEGORIES.LIGHT,
      type: DEVICE_FEATURE_TYPES.LIGHT.SATURATION,
    };
    const value = 75;

    const command = generateCommand(feature, value);
    const expected = [...COMMANDS.BRIGHTNESS];
    expected[8] = 0x09;
    expected[9] = 0x86;
    expected[10] = 0xb8;
    expect(command).deep.eq(expected);
  });

  it('Light category / saturation type (value = 100)', async () => {
    const feature = {
      category: DEVICE_FEATURE_CATEGORIES.LIGHT,
      type: DEVICE_FEATURE_TYPES.LIGHT.SATURATION,
    };
    const value = 100;

    const command = generateCommand(feature, value);
    const expected = [...COMMANDS.BRIGHTNESS];
    expected[8] = 0x0b;
    expected[9] = 0xea;
    expected[10] = 0x1e;
    expect(command).deep.eq(expected);
  });

  it('Light category / brightness type (value = 0)', async () => {
    const feature = {
      category: DEVICE_FEATURE_CATEGORIES.LIGHT,
      type: DEVICE_FEATURE_TYPES.LIGHT.BRIGHTNESS,
    };
    const value = 0;

    const command = generateCommand(feature, value);
    const expected = [...COMMANDS.BRIGHTNESS];
    expected[8] = 0x02;
    expected[9] = 0x58;
    expected[10] = 0x83;
    expect(command).deep.eq(expected);
  });

  it('Light category / brightness type (value = 25)', async () => {
    const feature = {
      category: DEVICE_FEATURE_CATEGORIES.LIGHT,
      type: DEVICE_FEATURE_TYPES.LIGHT.BRIGHTNESS,
    };
    const value = 25;

    const command = generateCommand(feature, value);
    const expected = [...COMMANDS.BRIGHTNESS];
    expected[8] = 0x04;
    expected[9] = 0xbd;
    expected[10] = 0xea;
    expect(command).deep.eq(expected);
  });

  it('Light category / brightness type (value = 50)', async () => {
    const feature = {
      category: DEVICE_FEATURE_CATEGORIES.LIGHT,
      type: DEVICE_FEATURE_TYPES.LIGHT.BRIGHTNESS,
    };
    const value = 50;

    const command = generateCommand(feature, value);
    const expected = [...COMMANDS.BRIGHTNESS];
    expected[8] = 0x07;
    expected[9] = 0x21;
    expected[10] = 0x51;
    expect(command).deep.eq(expected);
  });

  it('Light category / brightness type (value = 75)', async () => {
    const feature = {
      category: DEVICE_FEATURE_CATEGORIES.LIGHT,
      type: DEVICE_FEATURE_TYPES.LIGHT.BRIGHTNESS,
    };
    const value = 75;

    const command = generateCommand(feature, value);
    const expected = [...COMMANDS.BRIGHTNESS];
    expected[8] = 0x09;
    expected[9] = 0x86;
    expected[10] = 0xb8;
    expect(command).deep.eq(expected);
  });

  it('Light category / brightness type (value = 100)', async () => {
    const feature = {
      category: DEVICE_FEATURE_CATEGORIES.LIGHT,
      type: DEVICE_FEATURE_TYPES.LIGHT.BRIGHTNESS,
    };
    const value = 100;

    const command = generateCommand(feature, value);
    const expected = [...COMMANDS.BRIGHTNESS];
    expected[8] = 0x0b;
    expected[9] = 0xea;
    expected[10] = 0x1e;
    expect(command).deep.eq(expected);
  });

  it('Light category / color type (value = 0 - black)', async () => {
    const feature = {
      category: DEVICE_FEATURE_CATEGORIES.LIGHT,
      type: DEVICE_FEATURE_TYPES.LIGHT.COLOR,
    };
    const value = 0;

    const command = generateCommand(feature, value);
    const expected = COMMANDS.COLOR.slice(0, 14);
    expected[9] = 0x00;
    expected[10] = 0x00;
    expected[11] = 0x00;
    expect(command.slice(0, 14)).deep.eq(expected);
  });

  it('Light category / color type (value = 16.777.215 - white)', async () => {
    const feature = {
      category: DEVICE_FEATURE_CATEGORIES.LIGHT,
      type: DEVICE_FEATURE_TYPES.LIGHT.COLOR,
    };
    const value = 16777215;

    const command = generateCommand(feature, value);
    const expected = COMMANDS.COLOR.slice(0, 14);
    expected[9] = 0xff;
    expected[10] = 0xff;
    expected[11] = 0xff;
    expect(command.slice(0, 14)).deep.eq(expected);
  });

  it('Light category / color type (value = 16.711.680 - red)', async () => {
    const feature = {
      category: DEVICE_FEATURE_CATEGORIES.LIGHT,
      type: DEVICE_FEATURE_TYPES.LIGHT.COLOR,
    };
    const value = 16711680;

    const command = generateCommand(feature, value);
    const expected = COMMANDS.COLOR.slice(0, 14);
    expected[9] = 0xff;
    expected[10] = 0x00;
    expected[11] = 0x00;
    expect(command.slice(0, 14)).deep.eq(expected);
  });

  it('Light category / color type (value = 65.280 - green)', async () => {
    const feature = {
      category: DEVICE_FEATURE_CATEGORIES.LIGHT,
      type: DEVICE_FEATURE_TYPES.LIGHT.COLOR,
    };
    const value = 65280;

    const command = generateCommand(feature, value);
    const expected = COMMANDS.COLOR.slice(0, 14);
    expected[9] = 0x00;
    expected[10] = 0xff;
    expected[11] = 0x00;
    expect(command.slice(0, 14)).deep.eq(expected);
  });

  it('Light category / color type (value = 255 - blue)', async () => {
    const feature = {
      category: DEVICE_FEATURE_CATEGORIES.LIGHT,
      type: DEVICE_FEATURE_TYPES.LIGHT.COLOR,
    };
    const value = 255;

    const command = generateCommand(feature, value);
    const expected = COMMANDS.COLOR.slice(0, 14);
    expected[9] = 0x00;
    expected[10] = 0x00;
    expected[11] = 0xff;
    expect(command.slice(0, 14)).deep.eq(expected);
  });

  it('Light category / color type (value = 16.776.960 - yellow)', async () => {
    const feature = {
      category: DEVICE_FEATURE_CATEGORIES.LIGHT,
      type: DEVICE_FEATURE_TYPES.LIGHT.COLOR,
    };
    const value = 16776960;

    const command = generateCommand(feature, value);
    const expected = COMMANDS.COLOR.slice(0, 14);
    expected[9] = 0xff;
    expected[10] = 0xff;
    expected[11] = 0x00;
    expect(command.slice(0, 14)).deep.eq(expected);
  });

  it('Light category / color type (value = 65.535 - cyan)', async () => {
    const feature = {
      category: DEVICE_FEATURE_CATEGORIES.LIGHT,
      type: DEVICE_FEATURE_TYPES.LIGHT.COLOR,
    };
    const value = 65535;

    const command = generateCommand(feature, value);
    const expected = COMMANDS.COLOR.slice(0, 14);
    expected[9] = 0x00;
    expected[10] = 0xff;
    expected[11] = 0xff;
    expect(command.slice(0, 14)).deep.eq(expected);
  });

  it('Light category / color type (value = 16.711.935 - magenta)', async () => {
    const feature = {
      category: DEVICE_FEATURE_CATEGORIES.LIGHT,
      type: DEVICE_FEATURE_TYPES.LIGHT.COLOR,
    };
    const value = 16711935;

    const command = generateCommand(feature, value);
    const expected = COMMANDS.COLOR.slice(0, 14);
    expected[9] = 0xff;
    expected[10] = 0x00;
    expected[11] = 0xff;
    expect(command.slice(0, 14)).deep.eq(expected);
  });

  it('Light category / color type (value = 8.355.711 - grey)', async () => {
    const feature = {
      category: DEVICE_FEATURE_CATEGORIES.LIGHT,
      type: DEVICE_FEATURE_TYPES.LIGHT.COLOR,
    };
    const value = 8355711;

    const command = generateCommand(feature, value);
    const expected = COMMANDS.COLOR.slice(0, 14);
    expected[9] = 0x7f;
    expected[10] = 0x7f;
    expected[11] = 0x7f;
    expect(command.slice(0, 14)).deep.eq(expected);
  });
});
