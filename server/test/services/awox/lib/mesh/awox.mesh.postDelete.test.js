const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

const { assert, fake } = sinon;

const proxyExecCommand = { execCommand: fake.resolves(null) };
const AwoxMeshManager = proxyquire('../../../../../services/awox/lib/mesh', {
  './awox.mesh.execCommand': proxyExecCommand,
});

const { PARAMS } = require('../../../../../services/awox/lib/mesh/awox.mesh.constants');

const gladys = {};
const bluetooth = {};

describe('awox.mesh.postDelete', () => {
  afterEach(() => {
    sinon.reset();
  });

  it('Reset device not linked to remote', async () => {
    const meshManager = new AwoxMeshManager(gladys, bluetooth);

    const device = {
      id: 'internal_id',
      external_id: 'bluetooth:AABBCCDDEE',
      model: 'SMLw_c9',
      params: [
        {
          name: 'manufacturer',
          value: 'awox',
        },
      ],
    };

    await meshManager.postDelete(device);

    assert.calledWith(proxyExecCommand.execCommand);
  });

  it('Reset remote device', async () => {
    const meshManager = new AwoxMeshManager(gladys, bluetooth);

    const device = {
      id: 'internal_id',
      external_id: 'bluetooth:AABBCCDDEE',
      model: 'RCUm_1234',
      params: [
        {
          name: 'manufacturer',
          value: 'awox',
        },
      ],
    };

    await meshManager.postDelete(device);

    assert.notCalled(proxyExecCommand.execCommand);
  });

  it('Reset device linked to remote', async () => {
    const meshManager = new AwoxMeshManager(gladys, bluetooth);

    const device = {
      id: 'internal_id',
      external_id: 'bluetooth:AABBCCDDEE',
      model: 'SMLw_c9',
      params: [
        {
          name: PARAMS.MESH_REMOTE,
          value: 'remote',
        },
        {
          name: 'manufacturer',
          value: 'awox',
        },
      ],
    };

    await meshManager.postDelete(device);

    assert.notCalled(proxyExecCommand.execCommand);
  });
});
