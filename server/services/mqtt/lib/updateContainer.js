const logger = require('../../../utils/logger');
const { CONFIGURATION, DEFAULT } = require('./constants');
const containerParams = require('../docker/eclipse-mosquitto-container.json');

/**
 * @description Updates MQTT container configuration according to required changes.
 * @param {Object} configuration - MQTT service configuration.
 * @returns {Promise} Current MQTT network configuration.
 * @example
 * updateContainer({ mqttUrl, mqttPort });
 */
async function updateContainer(configuration) {
  logger.info('MQTT: checking for required changes...');

  // Check for port listener option
  const { useEmbeddedBroker, mosquittoVersion } = configuration;
  if (useEmbeddedBroker && mosquittoVersion === undefined) {
    const dockerContainers = await this.gladys.system.getContainers({
      all: true,
      filters: { name: [containerParams.name] },
    });

    // Remove non versionned container
    if (dockerContainers.length !== 0) {
      const [container] = dockerContainers;
      await this.gladys.system.removeContainer(container.id);
    }

    // Reinstall container with explicit version
    await this.installContainer(false);

    await this.gladys.variable.setValue(
      CONFIGURATION.MQTT_MOSQUITTO_VERSION,
      DEFAULT.MOSQUITTO_VERSION,
      this.serviceId,
    );
    configuration.mqttPort = DEFAULT.MOSQUITTO_VERSION;
  }

  return configuration;
}

module.exports = {
  updateContainer,
};
