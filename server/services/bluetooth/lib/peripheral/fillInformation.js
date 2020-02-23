const { addDeviceParam } = require('../utils/addDeviceParam');
const { loopOnServicesAndCharacteristics } = require('../wrapper/peripheral/loopOnServicesAndCharacteristics');
const { readValue } = require('../wrapper/characteristic/readValue');

const INFORMATION_SERVICES = {
  // Generic access
  '1800': {
    // Device name
    '2a00': async (characteristic, device) => {
      const value = await readValue(characteristic);
      addDeviceParam(device, 'deviceName', value);
    },
  },
  // Device information
  '180a': {
    // Manufacturer name
    '2a29': async (characteristic, device) => {
      const value = await readValue(characteristic);
      addDeviceParam(device, 'manufacturer', value);
    },
    // Model
    '2a24': async (characteristic, device) => {
      const value = await readValue(characteristic);
      device.model = value;
    },
  },
};

/**
 * @description Fill device with recognized peripheral information.
 * @param {Object} peripheral - Bluetooth peripheral.
 * @param {Object} device - Bluetooth device.
 * @returns {Promise<any[]>} - A successful Promise.
 * @example
 * fillInformation({}, {});
 */
async function fillInformation(peripheral, device) {
  return loopOnServicesAndCharacteristics(peripheral, device, INFORMATION_SERVICES);
}

module.exports = {
  fillInformation,
};
