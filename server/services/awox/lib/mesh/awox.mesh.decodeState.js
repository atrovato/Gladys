const { EVENTS, DEVICE_FEATURE_CATEGORIES, DEVICE_FEATURE_TYPES } = require('../../../../utils/constants');

const { PARAMS } = require('./awox.mesh.constants');
const { decryptPacket } = require('./awox.mesh.commands');

const extractValue = (message, feature) => {
  const { type } = feature;
  switch (type) {
    case DEVICE_FEATURE_TYPES.LIGHT.BINARY:
      return message.readUIntBE(12, 1) % 2;
    case DEVICE_FEATURE_TYPES.LIGHT.BRIGHTNESS:
      return message.readUIntBE(13, 1);
    case DEVICE_FEATURE_TYPES.LIGHT.TEMPERATURE:
      return message.readUIntBE(14, 1);
    case DEVICE_FEATURE_TYPES.LIGHT.SATURATION:
      return message.readUIntBE(15, 1);
    case DEVICE_FEATURE_TYPES.LIGHT.COLOR:
      return message.readUIntBE(16, 3);
    default:
      return undefined;
  }
};

/**
 * @description Control a Mesh AwoX device
 * @param {Object} device - The device to control.
 * @param {Buffer} state - Device value.
 * @example
 * decodeState({ external_id: 'bluetooth:0102030405'}, [0x00]);
 */
function decodeState(device, state) {
  const sessionKeyParam = device.params.find((p) => p.name === PARAMS.MESH_SESSION_KEY);

  if (!sessionKeyParam) {
    throw new Error(`AwoX Mesh: device ${device.selector} is not linked to Mesh session`);
  }

  const [, peripheralUuid] = device.external_id;
  const sessionKey = Buffer.from(sessionKeyParam.value, 'hex');
  // Decrypt state
  const message = decryptPacket(peripheralUuid, sessionKey, state);
  // Decode state
  // Status msg is 220 (DC in hexa), others are for some commands
  const messageType = message.readUIntBE(7, 1);

  if (messageType !== 220) {
    throw new Error(`AwoX Mesh: invalid message type from received data ${messageType}`);
  }

  // Convert and send new device states
  device.features
    .filter((feature) => feature.category === DEVICE_FEATURE_CATEGORIES.LIGHT)
    .forEach((feature) => {
      const newState = extractValue(message, feature);

      if (newState !== undefined && newState !== feature.last_value) {
        this.gladys.event.emit(EVENTS.DEVICE.NEW_STATE, {
          device_feature_external_id: feature.external_id,
          state: newState,
        });
      }
    });

  return null;
}

module.exports = {
  decodeState,
};
