const { expect } = require('chai');

const AwoxMeshManager = require('../../../../../services/awox/lib/mesh');

const gladys = {};
const bluetooth = {};

describe('awox.mesh.isCompatible', () => {
  it('not compatible device (none)', () => {
    const modelData = {
      remote: false,
      mesh: false,
      color: false,
      white: false,
    };

    const manager = new AwoxMeshManager(gladys, bluetooth);
    const result = manager.isCompatible(modelData);
    expect(result).eq(false);
  });

  it('not compatible device (remote)', () => {
    const modelData = {
      remote: true,
      mesh: true,
      color: false,
      white: false,
    };

    const manager = new AwoxMeshManager(gladys, bluetooth);
    const result = manager.isCompatible(modelData);
    expect(result).eq(true);
  });

  it('not compatible device (color only)', () => {
    const modelData = {
      remote: false,
      mesh: false,
      color: true,
      white: false,
    };

    const manager = new AwoxMeshManager(gladys, bluetooth);
    const result = manager.isCompatible(modelData);
    expect(result).eq(false);
  });

  it('not compatible device (white only)', () => {
    const modelData = {
      remote: false,
      mesh: false,
      color: false,
      white: true,
    };

    const manager = new AwoxMeshManager(gladys, bluetooth);
    const result = manager.isCompatible(modelData);
    expect(result).eq(false);
  });

  it('not compatible device (all but mesh)', () => {
    const modelData = {
      remote: true,
      mesh: false,
      color: true,
      white: true,
    };

    const manager = new AwoxMeshManager(gladys, bluetooth);
    const result = manager.isCompatible(modelData);
    expect(result).eq(true);
  });

  it('compatible device (mesh only)', () => {
    const modelData = {
      remote: false,
      mesh: true,
      color: false,
      white: false,
    };

    const manager = new AwoxMeshManager(gladys, bluetooth);
    const result = manager.isCompatible(modelData);
    expect(result).eq(true);
  });
});
