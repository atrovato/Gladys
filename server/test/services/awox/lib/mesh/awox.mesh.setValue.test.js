const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

const { assert, fake } = sinon;

const proxyExecCommand = { execCommand: fake.resolves(null) };
const AwoxMeshManager = proxyquire('../../../../../services/awox/lib/mesh', {
  './awox.mesh.execCommand': proxyExecCommand,
});

const { DEVICE_FEATURE_CATEGORIES, DEVICE_FEATURE_TYPES } = require('../../../../../utils/constants');
const { PARAMS } = require('../../../../../services/awox/lib/mesh/awox.mesh.constants');

const gladys = {};
const bluetooth = {};

const feature = {
  category: DEVICE_FEATURE_CATEGORIES.LIGHT,
  type: DEVICE_FEATURE_TYPES.LIGHT.BINARY,
};
const value = 1;

describe('awox.mesh.setValue', () => {
  afterEach(() => {
    sinon.reset();
  });

  it('Set value with success', async () => {
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

    await meshManager.setValue(device, feature, value);

    assert.calledOnce(proxyExecCommand.execCommand);
  });
});
