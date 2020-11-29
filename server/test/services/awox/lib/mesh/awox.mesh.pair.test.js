const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

const { assert, fake } = sinon;

const sessionKey = [0x99];

const proxyAuthenticate = { authenticate: fake.resolves(sessionKey), changeAuthentication: fake.resolves(sessionKey) };
const AwoxMeshManager = proxyquire('../../../../../services/awox/lib/mesh', {
  './awox.mesh.authenticate': proxyAuthenticate,
  './awox.mesh.changeAuthentication': proxyAuthenticate,
});

const { PARAMS } = require('../../../../../services/awox/lib/mesh/awox.mesh.constants');

const peripheral = {};

const gladys = {
  device: {
    create: fake.resolves(true),
  },
};
const bluetooth = {
  applyOnPeripheral: fake.yields(peripheral),
  writeDevice: fake.resolves(null),
};

describe('awox.mesh.pair', () => {
  afterEach(() => {
    sinon.reset();
  });

  it('Pair device with success', async () => {
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

    await meshManager.pair(device);

    assert.calledOnce(bluetooth.applyOnPeripheral);
    assert.calledOnce(proxyAuthenticate.authenticate);
    assert.calledOnce(proxyAuthenticate.changeAuthentication);
  });
});
