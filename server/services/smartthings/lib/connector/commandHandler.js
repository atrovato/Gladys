const { DeviceErrorTypes } = require('st-schema');
const { EVENTS, ACTIONS, ACTIONS_STATUS } = require('../../../../utils/constants');
const { CAPABILITY_BY_ID } = require('../utils/capabilities');

/**
 * @description Device command request. Control the devices and respond with new device states
 * @param {Object} response - CommandResponse response object.
 * @param {Array} requestedDevices - Of ST device commands.
 *
 * @see https://smartthings.developer.samsung.com/docs/devices/smartthings-schema/smartthings-schema-reference.html#Command
 * @see https://github.com/SmartThingsCommunity/st-schema-nodejs
 *
 * @example
 *  await smartthingsHandler.commandHandler(
 *    response,
 *    [
 *      {
 *        "externalDeviceId": "partner-device-id",
 *        "deviceCookie": {
 *          "lastcookie": "cookie value"
 *        },
 *        "commands":
 *        [
 *          {
 *            "component": "main",
 *            "capability": "st.switchLevel",
 *            "command": "setLevel",
 *            "arguments": [80]
 *          },
 *          {
 *            "component": "main",
 *            "capability": "st.switch",
 *            "command": "on",
 *            "arguments": []
 *          }
 *        ]
 *      },
 *    ]
 *  );
 */
function commandHandler(response, requestedDevices) {
  requestedDevices.forEach((device) => {
    const internalDevice = this.gladys.stateManager.get('deviceByExternalId', device.externalDeviceId);
    if (internalDevice) {
      device.commands.forEach((item) => {
        try {
          const capability = CAPABILITY_BY_ID[item.capability.substring(3)] || {};
          const commandCapability = capability.commands[item.command];
          const feature = internalDevice.features.find((f) => f.type === commandCapability.featureType);
          const value = commandCapability.readValue(item.arguments, feature);

          const action = {
            type: ACTIONS.DEVICE.SET_VALUE,
            device: internalDevice.selector,
            feature_category: feature.category,
            feature_type: feature.feature_type,
            value,
            status: ACTIONS_STATUS.PENDING,
          };
          this.gladys.event.emit(EVENTS.ACTION.TRIGGERED, action);
        } catch (e) {
          const deviceResponse = response.addDevice(device.externalDeviceId);
          deviceResponse.setError('Impossible to handle command', DeviceErrorTypes.CAPABILITY_NOT_SUPPORTED);
        }
      }, this);
    } else {
      const deviceResponse = response.addDevice(device.externalDeviceId);
      deviceResponse.setError('Device not found in Gladys', DeviceErrorTypes.DEVICE_DELETED);
    }
  }, this);

  return null;
}

module.exports = {
  commandHandler,
};
