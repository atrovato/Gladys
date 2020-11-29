const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

const { assert, fake } = sinon;

const sessionKey = [0x99];

const proxyGetSessionKey = { getSessionKey: fake.resolves(sessionKey) };
const AwoxMeshManager = proxyquire('../../../../../services/awox/lib/mesh', {
  './awox.mesh.getSessionKey': proxyGetSessionKey,
});

const { PARAMS, SERVICES, CHARACTERISTICS } = require('../../../../../services/awox/lib/mesh/awox.mesh.constants');

const peripheral = {};

const gladys = {};
const bluetooth = {
  applyOnPeripheral: fake.yields(peripheral),
  writeDevice: fake.resolves(null),
};

describe('awox.mesh.execCommand', () => {
  afterEach(() => {
    sinon.reset();
  });

  it('Exec command with success', async () => {
    const meshManager = new AwoxMeshManager(gladys, bluetooth);

    const device = {
      id: 'internal_id',
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
    const command = { key: [0x01], data: [0x00] };
    await meshManager.execCommand(device, command, true);

    assert.calledOnce(bluetooth.applyOnPeripheral);
    assert.calledWith(proxyGetSessionKey.getSessionKey, device, peripheral, true);
    assert.calledWith(bluetooth.writeDevice, peripheral, SERVICES.EXEC, CHARACTERISTICS.COMMAND, sinon.match.any);
  });
});
