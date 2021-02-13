const sinon = require('sinon');

const { assert, fake } = sinon;

const proxiquire = require('proxyquire').noCallThru();

const { MockedMqttClient } = require('../mocks.test');
const { CONFIGURATION, DEFAULT } = require('../../../../services/mqtt/lib/constants');

const installContainerMock = { installContainer: fake.resolves('command well executed') };
const MqttHandler = proxiquire('../../../../services/mqtt/lib', {
  './installContainer': installContainerMock,
});

const gladys = {
  variable: {
    setValue: fake.resolves(null),
  },
  system: {
    getContainers: fake.resolves([]),
    removeContainer: fake.resolves(null),
  },
};
const serviceId = 'faea9c35-759a-44d5-bcc9-2af1de37b8b4';

describe('mqttHandler.updateContainer', function Describe() {
  this.timeout(8000);

  let mqttHandler;

  beforeEach(() => {
    mqttHandler = new MqttHandler(gladys, MockedMqttClient, serviceId);
  });

  afterEach(() => {
    sinon.reset();
  });

  it('should updateContainer: not Docker configured', async () => {
    const config = { useEmbeddedBroker: false };

    await mqttHandler.updateContainer(config);

    assert.notCalled(gladys.system.getContainers);
    assert.notCalled(gladys.system.removeContainer);
    assert.notCalled(installContainerMock.installContainer);
    assert.notCalled(gladys.variable.setValue);
  });

  it('should updateContainer: no MQTT container found', async () => {
    const config = { useEmbeddedBroker: true };

    await mqttHandler.updateContainer(config);

    assert.calledOnce(gladys.system.getContainers);
    assert.notCalled(gladys.system.removeContainer);
    assert.calledOnce(installContainerMock.installContainer);

    assert.calledOnce(gladys.variable.setValue);
    assert.calledWith(
      gladys.variable.setValue,
      CONFIGURATION.MQTT_MOSQUITTO_VERSION,
      DEFAULT.MOSQUITTO_VERSION,
      serviceId,
    );
  });

  it('should updateContainer: MQTT container found', async () => {
    const config = { useEmbeddedBroker: true };
    gladys.system.getContainers = fake.resolves([{ id: 'container' }]);

    await mqttHandler.updateContainer(config);

    assert.calledOnce(gladys.system.getContainers);

    assert.calledOnce(gladys.system.removeContainer);
    assert.calledWith(gladys.system.removeContainer, 'container');

    assert.calledOnce(installContainerMock.installContainer);

    assert.calledOnce(gladys.variable.setValue);
    assert.calledWith(
      gladys.variable.setValue,
      CONFIGURATION.MQTT_MOSQUITTO_VERSION,
      DEFAULT.MOSQUITTO_VERSION,
      serviceId,
    );
  });
});
