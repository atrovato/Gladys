const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

const { fake, assert } = sinon;

const awoxUtils = require('../../../../../services/awox/lib/mesh/awox.mesh.commands');
const { PARAMS } = require('../../../../../services/awox/lib/mesh/awox.mesh.constants');

const decryptPacket = (arg1, arg2, packet) => Buffer.from(packet);

const proxyDecodeState = proxyquire('../../../../../services/awox/lib/mesh/awox.mesh.decodeState', {
  './awox.mesh.commands': { ...awoxUtils, decryptPacket },
});

const AwoxMeshManager = proxyquire('../../../../../services/awox/lib/mesh', {
  './awox.mesh.decodeState': proxyDecodeState,
});
const { EVENTS, DEVICE_FEATURE_CATEGORIES, DEVICE_FEATURE_TYPES } = require('../../../../../utils/constants');

const gladys = {
  event: {
    emit: fake.resolves(null),
  },
};
const bluetooth = {};
const device = {
  external_id: 'bluetooth:a4c1380459d6',
  params: [{ name: PARAMS.MESH_SESSION_KEY, value: '0' }],
  features: [
    {
      category: DEVICE_FEATURE_CATEGORIES.LIGHT,
      type: DEVICE_FEATURE_TYPES.LIGHT.BINARY,
      external_id: 'feature_1',
    },
    {
      category: DEVICE_FEATURE_CATEGORIES.LIGHT,
      type: DEVICE_FEATURE_TYPES.LIGHT.BRIGHTNESS,
      external_id: 'feature_2',
    },
    {
      category: DEVICE_FEATURE_CATEGORIES.LIGHT,
      type: DEVICE_FEATURE_TYPES.LIGHT.TEMPERATURE,
      external_id: 'feature_3',
    },
    {
      category: DEVICE_FEATURE_CATEGORIES.LIGHT,
      type: DEVICE_FEATURE_TYPES.LIGHT.SATURATION,
      external_id: 'feature_4',
      last_value: 100,
    },
    {
      category: DEVICE_FEATURE_CATEGORIES.LIGHT,
      type: DEVICE_FEATURE_TYPES.LIGHT.COLOR,
      external_id: 'feature_5',
    },
    {
      category: DEVICE_FEATURE_CATEGORIES.LIGHT,
      type: DEVICE_FEATURE_TYPES.UNKNOWN.UNKNOWN,
      external_id: 'unknow_light',
    },
    {
      category: DEVICE_FEATURE_CATEGORIES.UNKNOWN,
      type: DEVICE_FEATURE_TYPES.UNKNOWN.UNKNOWN,
      external_id: 'unknown',
    },
  ],
};

describe('awox.mesh.utils.decodeState', () => {
  afterEach(() => {
    sinon.reset();
  });

  it('Device without session', () => {
    const noSessionDevice = { params: [] };
    const meshManager = new AwoxMeshManager(gladys, bluetooth);
    const packet = Buffer.alloc(18, 0x00);

    try {
      meshManager.decodeState(noSessionDevice, packet);
      expect.fail();
    } catch (e) {
      expect(e).instanceOf(Error);
    }

    assert.notCalled(gladys.event.emit);
  });

  it('Decode invalid packet', () => {
    const meshManager = new AwoxMeshManager(gladys, bluetooth);
    const packet = Buffer.alloc(18, 0x00);

    try {
      meshManager.decodeState(device, packet);
      expect.fail();
    } catch (e) {
      expect(e).instanceOf(Error);
    }

    assert.notCalled(gladys.event.emit);
  });

  it('Decode packet and send events', () => {
    const meshManager = new AwoxMeshManager(gladys, bluetooth);
    const packet = Buffer.alloc(19, 0x00);
    packet.fill(0xdc, 7, 8);
    packet.fill(0x01, 12, 13);
    packet.fill(0x4b, 13, 14);
    packet.fill(0x25, 14, 15);
    packet.fill(0x64, 15, 16);
    packet.fill(0x2f, 16, 17);
    packet.fill(0x32, 17, 18);
    packet.fill(0x9f, 18, 19);

    meshManager.decodeState(device, packet);

    assert.callCount(gladys.event.emit, 4);
    assert.calledWith(gladys.event.emit, EVENTS.DEVICE.NEW_STATE, {
      device_feature_external_id: 'feature_1',
      state: 1,
    });
    assert.calledWith(gladys.event.emit, EVENTS.DEVICE.NEW_STATE, {
      device_feature_external_id: 'feature_2',
      state: 75,
    });
    assert.calledWith(gladys.event.emit, EVENTS.DEVICE.NEW_STATE, {
      device_feature_external_id: 'feature_3',
      state: 37,
    });
    assert.calledWith(gladys.event.emit, EVENTS.DEVICE.NEW_STATE, {
      device_feature_external_id: 'feature_5',
      state: 3093151,
    });
  });
});
