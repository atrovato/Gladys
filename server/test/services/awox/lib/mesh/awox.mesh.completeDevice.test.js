const { expect } = require('chai');

const AwoxMeshManager = require('../../../../../services/awox/lib/mesh');

const gladys = {};
const bluetooth = {};

describe('awox.mesh.completeDevice', () => {
  it('no options', () => {
    const modelData = {
      remote: false,
      mesh: false,
      color: false,
      white: false,
    };

    const device = {
      external_id: 'bluetooth:112233445566',
    };
    const manager = new AwoxMeshManager(gladys, bluetooth);
    const result = manager.completeDevice(device, modelData);

    const expected = {
      external_id: 'bluetooth:112233445566',
      params: [
        {
          name: 'mesh_user',
          value: 'unpaired',
        },
        {
          name: 'mesh_password',
          value: '1234',
        },
      ],
      features: [
        {
          category: 'light',
          external_id: 'bluetooth:112233445566:switch',
          has_feedback: true,
          keep_history: true,
          max: 1,
          min: 0,
          name: 'Switch',
          read_only: false,
          selector: 'bluetooth-112233445566-switch',
          type: 'binary',
        },
      ],
    };
    expect(result).deep.eq(expected);
  });

  it('remote device', () => {
    const modelData = {
      remote: true,
      mesh: false,
      color: false,
      white: false,
    };

    const device = {
      external_id: 'bluetooth:112233445566',
    };
    const manager = new AwoxMeshManager(gladys, bluetooth);
    const result = manager.completeDevice(device, modelData);

    const expected = {
      external_id: 'bluetooth:112233445566',
      params: [
        {
          name: 'mesh_user',
          value: 'R-445566',
        },
        {
          name: 'mesh_password',
          value: '1234',
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

    const device = {
      external_id: 'bluetooth:112233445566',
      params: [],
    };
    const manager = new AwoxMeshManager(gladys, bluetooth);
    const result = manager.completeDevice(device, modelData);

    const expected = {
      external_id: 'bluetooth:112233445566',
      params: [
        {
          name: 'mesh_user',
          value: 'unpaired',
        },
        {
          name: 'mesh_password',
          value: '1234',
        },
      ],
      features: [
        {
          category: 'light',
          external_id: 'bluetooth:112233445566:switch',
          has_feedback: true,
          keep_history: true,
          max: 1,
          min: 0,
          name: 'Switch',
          read_only: false,
          selector: 'bluetooth-112233445566-switch',
          type: 'binary',
        },
        {
          category: 'light',
          external_id: 'bluetooth:112233445566:white_brightness',
          has_feedback: true,
          keep_history: true,
          max: 100,
          min: 0,
          name: 'White brightness',
          read_only: false,
          selector: 'bluetooth-112233445566-white-brightness',
          type: 'brightness',
          unit: 'percent',
        },
        {
          category: 'light',
          external_id: 'bluetooth:112233445566:white_temperature',
          has_feedback: true,
          keep_history: true,
          max: 100,
          min: 0,
          name: 'White temperature',
          read_only: false,
          selector: 'bluetooth-112233445566-white-temperature',
          type: 'temperature',
          unit: 'percent',
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

    const device = {
      external_id: 'bluetooth:112233445566',
      params: [],
    };
    const manager = new AwoxMeshManager(gladys, bluetooth);
    const result = manager.completeDevice(device, modelData);

    const expected = {
      external_id: 'bluetooth:112233445566',
      params: [
        {
          name: 'mesh_user',
          value: 'unpaired',
        },
        {
          name: 'mesh_password',
          value: '1234',
        },
      ],
      features: [
        {
          category: 'light',
          external_id: 'bluetooth:112233445566:switch',
          has_feedback: true,
          keep_history: true,
          max: 1,
          min: 0,
          name: 'Switch',
          read_only: false,
          selector: 'bluetooth-112233445566-switch',
          type: 'binary',
        },
        {
          category: 'light',
          external_id: 'bluetooth:112233445566:white_brightness',
          has_feedback: true,
          keep_history: true,
          max: 100,
          min: 0,
          name: 'White brightness',
          read_only: false,
          selector: 'bluetooth-112233445566-white-brightness',
          type: 'brightness',
          unit: 'percent',
        },
        {
          category: 'light',
          external_id: 'bluetooth:112233445566:white_temperature',
          has_feedback: true,
          keep_history: true,
          max: 100,
          min: 0,
          name: 'White temperature',
          read_only: false,
          selector: 'bluetooth-112233445566-white-temperature',
          type: 'temperature',
          unit: 'percent',
        },
        {
          category: 'light',
          external_id: 'bluetooth:112233445566:color_light',
          has_feedback: true,
          keep_history: true,
          max: 16777215,
          min: 0,
          name: 'Color',
          read_only: false,
          selector: 'bluetooth-112233445566-color-light',
          type: 'color',
        },
        {
          category: 'light',
          external_id: 'bluetooth:112233445566:color_saturation',
          has_feedback: true,
          keep_history: true,
          max: 100,
          min: 0,
          name: 'Color saturation',
          read_only: false,
          selector: 'bluetooth-112233445566-color-saturation',
          type: 'saturation',
          unit: 'percent',
        },
      ],
    };
    expect(result).deep.eq(expected);
  });
});
