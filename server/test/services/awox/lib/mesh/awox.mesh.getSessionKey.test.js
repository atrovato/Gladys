const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

const { assert, fake } = sinon;

const sessionKey = Buffer.from([0x99]);

const proxyAuthenticate = { authenticate: fake.resolves(sessionKey) };
const AwoxMeshManager = proxyquire('../../../../../services/awox/lib/mesh', {
  './awox.mesh.authenticate': proxyAuthenticate,
});

const { PARAMS } = require('../../../../../services/awox/lib/mesh/awox.mesh.constants');

const bluetooth = {};
const peripheral = {};

const gladys = {
  device: {
    create: fake.resolves(true),
  },
};

describe('awox.mesh.getSessionKey', () => {
  afterEach(() => {
    sinon.reset();
  });

  it('Get session key from device (no update)', async () => {
    const meshManager = new AwoxMeshManager(gladys, bluetooth);

    const device = {
      external_id: 'bluetooth:AABBCCDDEE',
      model: 'any_compatible',
      params: [
        {
          name: PARAMS.MESH_USER,
          value: 'meshUser',
        },
        {
          name: PARAMS.MESH_PASSWORD,
          value: 'meshPassword',
        },
        {
          name: PARAMS.MESH_SESSION_KEY,
          value: '99',
        },
      ],
    };

    const result = await meshManager.getSessionKey(device, peripheral, false);

    expect(result).deep.eq(sessionKey);

    assert.notCalled(proxyAuthenticate.authenticate);
    assert.notCalled(gladys.device.create);
  });

  it('Get session key from device (with update)', async () => {
    const meshManager = new AwoxMeshManager(gladys, bluetooth);

    const device = {
      external_id: 'bluetooth:AABBCCDDEE',
      model: 'any_compatible',
      params: [
        {
          name: PARAMS.MESH_USER,
          value: 'meshUser',
        },
        {
          name: PARAMS.MESH_PASSWORD,
          value: 'meshPassword',
        },
        {
          name: PARAMS.MESH_SESSION_KEY,
          value: '99',
        },
      ],
    };

    const result = await meshManager.getSessionKey(device, peripheral, true);

    expect(result).deep.eq(sessionKey);

    assert.notCalled(proxyAuthenticate.authenticate);
    assert.notCalled(gladys.device.create);
  });

  it('Get session key from authentication (force update)', async () => {
    const meshManager = new AwoxMeshManager(gladys, bluetooth);

    const device = {
      id: 'device_id',
      external_id: 'bluetooth:AABBCCDDEE',
      model: 'any_compatible',
      params: [
        {
          name: PARAMS.MESH_USER,
          value: 'meshUser',
        },
        {
          name: PARAMS.MESH_PASSWORD,
          value: 'meshPassword',
        },
      ],
    };

    const result = await meshManager.getSessionKey(device, peripheral, true);

    expect(result).deep.eq(sessionKey);

    assert.calledOnce(proxyAuthenticate.authenticate);
    assert.calledOnce(gladys.device.create);
  });

  it('Get session key from authentication (force update but device no id)', async () => {
    const meshManager = new AwoxMeshManager(gladys, bluetooth);

    const device = {
      external_id: 'bluetooth:AABBCCDDEE',
      model: 'any_compatible',
      params: [
        {
          name: PARAMS.MESH_USER,
          value: 'meshUser',
        },
        {
          name: PARAMS.MESH_PASSWORD,
          value: 'meshPassword',
        },
      ],
    };

    const result = await meshManager.getSessionKey(device, peripheral, true);

    expect(result).deep.eq(sessionKey);

    assert.calledOnce(proxyAuthenticate.authenticate);
    assert.notCalled(gladys.device.create);
  });

  it('Get session key from authentication (no update)', async () => {
    const meshManager = new AwoxMeshManager(gladys, bluetooth);

    const device = {
      external_id: 'bluetooth:AABBCCDDEE',
      model: 'any_compatible',
      params: [
        {
          name: PARAMS.MESH_USER,
          value: 'meshUser',
        },
        {
          name: PARAMS.MESH_PASSWORD,
          value: 'meshPassword',
        },
      ],
    };

    const result = await meshManager.getSessionKey(device, peripheral, false);

    expect(result).deep.eq(sessionKey);

    assert.calledOnce(proxyAuthenticate.authenticate);
    assert.notCalled(gladys.device.create);
  });
});
