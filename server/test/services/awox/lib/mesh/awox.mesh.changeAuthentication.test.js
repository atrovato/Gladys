const { expect } = require('chai');
const sinon = require('sinon');

const { assert, fake } = sinon;

const AwoxMeshManager = require('../../../../../services/awox/lib/mesh');
const { SERVICES, CHARACTERISTICS } = require('../../../../../services/awox/lib/mesh/awox.mesh.constants');

const gladys = {};
const bluetooth = {
  writeDevice: fake.resolves(null),
  readDevice: fake.resolves(null),
};
const peripheral = {};
const credentials = {
  user: 'meshName',
  password: 'meshPassword',
};
const session = Buffer.from([0x99]);

describe('awox.mesh.changeAuthentication', () => {
  afterEach(() => {
    sinon.reset();
  });

  it('Change authentication with success', async () => {
    bluetooth.readDevice = fake.resolves([0x07]);

    const meshManager = new AwoxMeshManager(gladys, bluetooth);

    await meshManager.changeAuthentication(peripheral, credentials, session, false);

    assert.callCount(bluetooth.writeDevice, 3);
    assert.calledWith(bluetooth.writeDevice, peripheral, SERVICES.EXEC, CHARACTERISTICS.PAIR, sinon.match.any, true);

    assert.calledOnce(bluetooth.readDevice);
    assert.calledWith(bluetooth.readDevice, peripheral, SERVICES.EXEC, CHARACTERISTICS.PAIR);
  });

  it('Change authentication with success (remote)', async () => {
    bluetooth.readDevice = fake.resolves([0x07]);

    const meshManager = new AwoxMeshManager(gladys, bluetooth);

    await meshManager.changeAuthentication(peripheral, credentials, session, true);

    assert.callCount(bluetooth.writeDevice, 3);
    assert.calledWith(bluetooth.writeDevice, peripheral, SERVICES.EXEC, CHARACTERISTICS.PAIR, sinon.match.any, true);

    assert.notCalled(bluetooth.readDevice);
  });

  it('Change authentication with error', async () => {
    bluetooth.readDevice = fake.resolves([0x00]);

    const meshManager = new AwoxMeshManager(gladys, bluetooth);

    try {
      await meshManager.changeAuthentication(peripheral, credentials, session, false);
      assert.fail();
    } catch (e) {
      expect(e).instanceOf(Error);
    }

    assert.callCount(bluetooth.writeDevice, 3);
    assert.calledWith(bluetooth.writeDevice, peripheral, SERVICES.EXEC, CHARACTERISTICS.PAIR, sinon.match.any, true);

    assert.calledOnce(bluetooth.readDevice);
    assert.calledWith(bluetooth.readDevice, peripheral, SERVICES.EXEC, CHARACTERISTICS.PAIR);
  });

  it('Change authentication with error (remote)', async () => {
    bluetooth.readDevice = fake.resolves([0x00]);

    const meshManager = new AwoxMeshManager(gladys, bluetooth);

    await meshManager.changeAuthentication(peripheral, credentials, session, true);

    assert.callCount(bluetooth.writeDevice, 3);
    assert.calledWith(bluetooth.writeDevice, peripheral, SERVICES.EXEC, CHARACTERISTICS.PAIR, sinon.match.any, true);

    assert.notCalled(bluetooth.readDevice);
  });
});
