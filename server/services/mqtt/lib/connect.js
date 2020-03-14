const logger = require('../../../utils/logger');
const { CONFIGURATION } = require('./constants');
const { EVENTS, WEBSOCKET_MESSAGE_TYPES, ITEMS } = require('../../../utils/constants');
const { ServiceNotConfiguredError } = require('../../../utils/coreErrors');

/**
 * @description Connect and listen to all topics.
 * @param {Object} credential - MQTT credentials.
 * @example
 * connect({ username: 'username', password: 'password' });
 */
async function connect(credential = undefined) {
  const mqttUrl = await this.gladys.variable.getValue(CONFIGURATION.MQTT_URL_KEY, this.serviceId);

  const variablesFound = mqttUrl;
  if (!variablesFound) {
    this.configured = false;
    throw new ServiceNotConfiguredError('MQTT is not configured.');
  }
  this.configured = true;

  if (this.mqttClient) {
    this.disconnect();
  }

  if (credential) {
    await this.gladys.credentialManager.create(credential, this.serviceId, ITEMS.SERVICE);
  }
  const mqttCredential = this.gladys.stateManager.get('serviceCredential', this.serviceId);

  logger.debug(`Trying to connect to MQTT server ${mqttUrl}...`);
  this.mqttClient = this.mqttLibrary.connect(mqttUrl, mqttCredential);
  this.mqttClient.on('connect', () => {
    logger.info(`Connected to MQTT server ${mqttUrl}`);
    Object.keys(this.topicBinds).forEach((topic) => {
      this.subscribe(topic, this.topicBinds[topic]);
    });
    this.gladys.event.emit(EVENTS.WEBSOCKET.SEND_ALL, {
      type: WEBSOCKET_MESSAGE_TYPES.MQTT.CONNECTED,
    });
    this.connected = true;
  });
  this.mqttClient.on('error', (err) => {
    logger.warn(`Error while connecting to MQTT - ${err}`);
    this.gladys.event.emit(EVENTS.WEBSOCKET.SEND_ALL, {
      type: WEBSOCKET_MESSAGE_TYPES.MQTT.ERROR,
      payload: err,
    });
  });
  this.mqttClient.on('offline', () => {
    logger.warn(`Disconnected from MQTT server`);
    this.gladys.event.emit(EVENTS.WEBSOCKET.SEND_ALL, {
      type: WEBSOCKET_MESSAGE_TYPES.MQTT.ERROR,
      payload: 'DISCONNECTED',
    });
    this.connected = false;
  });
  this.mqttClient.on('message', (topic, message) => {
    this.handleNewMessage(topic, message.toString());
  });
}

module.exports = {
  connect,
};
