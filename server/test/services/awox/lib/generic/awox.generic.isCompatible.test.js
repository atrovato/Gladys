const { expect } = require('chai');

const AwoxGenericManager = require('../../../../../services/awox/lib/generic');

const gladys = {};
const bluetooth = {};

describe('awox.generic.isCompatible', () => {
  it('not compatible device (none)', () => {
    const modelData = {
      remote: false,
      mesh: false,
      color: false,
      white: false,
    };

    const manager = new AwoxGenericManager(gladys, bluetooth);
    const result = manager.isCompatible(modelData);
    expect(result).eq(false);
  });

  it('not compatible device (all)', () => {
    const modelData = {
      remote: true,
      mesh: true,
      color: true,
      white: true,
    };

    const manager = new AwoxGenericManager(gladys, bluetooth);
    const result = manager.isCompatible(modelData);
    expect(result).eq(false);
  });

  it('not compatible device (remote)', () => {
    const modelData = {
      remote: true,
      mesh: false,
      color: true,
      white: true,
    };

    const manager = new AwoxGenericManager(gladys, bluetooth);
    const result = manager.isCompatible(modelData);
    expect(result).eq(false);
  });

  it('not compatible device (mesh)', () => {
    const modelData = {
      remote: false,
      mesh: true,
      color: true,
      white: true,
    };

    const manager = new AwoxGenericManager(gladys, bluetooth);
    const result = manager.isCompatible(modelData);
    expect(result).eq(false);
  });

  it('compatible device (white only)', () => {
    const modelData = {
      remote: false,
      mesh: false,
      color: false,
      white: true,
    };

    const manager = new AwoxGenericManager(gladys, bluetooth);
    const result = manager.isCompatible(modelData);
    expect(result).eq(true);
  });

  it('compatible device (color only)', () => {
    const modelData = {
      remote: false,
      mesh: false,
      color: true,
      white: false,
    };

    const manager = new AwoxGenericManager(gladys, bluetooth);
    const result = manager.isCompatible(modelData);
    expect(result).eq(true);
  });

  it('compatible device (colr and white)', () => {
    const modelData = {
      remote: false,
      mesh: false,
      color: true,
      white: false,
    };

    const manager = new AwoxGenericManager(gladys, bluetooth);
    const result = manager.isCompatible(modelData);
    expect(result).eq(true);
  });
});
