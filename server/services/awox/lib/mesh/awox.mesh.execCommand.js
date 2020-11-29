const { SERVICES, CHARACTERISTICS } = require('./awox.mesh.constants');
const { generateCommandPacket } = require('./awox.mesh.commands');

/**
 * @description Send a command to a Mesh AwoX device.
 * @param {Object} device - The device to control.
 * @param {Object} command - The command to send ({ key, data}).
 * @param {boolean} updateDevice - Indicate if device can be updated.
 * @returns {Promise} Resolve when the message is send to device.
 * @example
 * execCommand({ external_id: 'bluetooth:0102030405'}, { key: [0x01], data: [0x00] }, true);
 */
async function execCommand(device, command, updateDevice) {
  const [, peripheralUuid] = device.external_id.split(':');

  return this.bluetooth.applyOnPeripheral(peripheralUuid, async (peripheral) => {
    const sessionKey = await this.getSessionKey(device, peripheral, updateDevice);

    // Generate command packet
    const commandPacket = generateCommandPacket(peripheralUuid, sessionKey, command);

    // Send command
    return this.bluetooth.writeDevice(peripheral, SERVICES.EXEC, CHARACTERISTICS.COMMAND, commandPacket);
  });
}

module.exports = {
  execCommand,
};
