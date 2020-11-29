const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

const { assert, fake } = sinon;

const utilsMock = {
  generateRandomBytes: () => Buffer.from([0x01, 0x02]),
  generateSessionKey: fake.returns(null),
};
const commandsMock = {
  generatePairCommand: () => Buffer.from([0x03, 0x04]),
};
const proxyAuthenticate = proxyquire('../../../../../services/awox/lib/mesh/awox.mesh.authenticate', {
  './awox.mesh.utils': utilsMock,
  './awox.mesh.commands': commandsMock,
});
const AwoxMeshManager = proxyquire('../../../../../services/awox/lib/mesh', {
  './awox.mesh.authenticate': proxyAuthenticate,
});
const { SERVICES, CHARACTERISTICS, PAYLOADS } = require('../../../../../services/awox/lib/mesh/awox.mesh.constants');
const { BadParameters } = require('../../../../../utils/coreErrors');

const gladys = {};
const bluetooth = {
  writeDevice: fake.resolves(null),
  readDevice: fake.resolves(null),
};
const peripheral = {};
const credentials = {
  name: 'meshName',
  password: 'meshPassword',
};

describe('awox.mesh.authenticate', () => {
  afterEach(() => {
    sinon.reset();
  });

  it('Authenticate with success', async () => {
    bluetooth.readDevice = fake.resolves([0x0d]);

    const meshManager = new AwoxMeshManager(gladys, bluetooth);

    await meshManager.authenticate(peripheral, credentials);

    assert.callCount(bluetooth.writeDevice, 2);
    assert.calledWith(
      bluetooth.writeDevice,
      peripheral,
      SERVICES.EXEC,
      CHARACTERISTICS.PAIR,
      commandsMock.generatePairCommand(),
      true,
    );
    assert.calledWith(
      bluetooth.writeDevice,
      peripheral,
      SERVICES.EXEC,
      CHARACTERISTICS.STATUS,
      PAYLOADS.AUTHENTICATE,
      true,
    );

    assert.calledOnce(bluetooth.readDevice);
    assert.calledWith(bluetooth.readDevice, peripheral, SERVICES.EXEC, CHARACTERISTICS.PAIR);
    assert.calledOnce(utilsMock.generateSessionKey);
  });

  it('Authenticate bad credentials', async () => {
    bluetooth.readDevice = fake.resolves([0x0e]);

    const meshManager = new AwoxMeshManager(gladys, bluetooth);

    try {
      await meshManager.authenticate(peripheral, credentials);
      assert.fail();
    } catch (e) {
      expect(e).instanceOf(BadParameters);
    }

    assert.callCount(bluetooth.writeDevice, 2);
    assert.calledWith(
      bluetooth.writeDevice,
      peripheral,
      SERVICES.EXEC,
      CHARACTERISTICS.PAIR,
      commandsMock.generatePairCommand(),
      true,
    );
    assert.calledWith(
      bluetooth.writeDevice,
      peripheral,
      SERVICES.EXEC,
      CHARACTERISTICS.STATUS,
      PAYLOADS.AUTHENTICATE,
      true,
    );

    assert.calledOnce(bluetooth.readDevice);
    assert.calledWith(bluetooth.readDevice, peripheral, SERVICES.EXEC, CHARACTERISTICS.PAIR);
    assert.notCalled(utilsMock.generateSessionKey);
  });

  it('Authenticate error', async () => {
    bluetooth.readDevice = fake.resolves([0x01]);

    const meshManager = new AwoxMeshManager(gladys, bluetooth);

    try {
      await meshManager.authenticate(peripheral, credentials);
      assert.fail();
    } catch (e) {
      expect(e).instanceOf(Error);
    }

    assert.callCount(bluetooth.writeDevice, 2);
    assert.calledWith(
      bluetooth.writeDevice,
      peripheral,
      SERVICES.EXEC,
      CHARACTERISTICS.PAIR,
      commandsMock.generatePairCommand(),
      true,
    );
    assert.calledWith(
      bluetooth.writeDevice,
      peripheral,
      SERVICES.EXEC,
      CHARACTERISTICS.STATUS,
      PAYLOADS.AUTHENTICATE,
      true,
    );

    assert.calledOnce(bluetooth.readDevice);
    assert.calledWith(bluetooth.readDevice, peripheral, SERVICES.EXEC, CHARACTERISTICS.PAIR);
    assert.notCalled(utilsMock.generateSessionKey);
  });
});
