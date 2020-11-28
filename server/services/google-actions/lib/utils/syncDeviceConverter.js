const { determineTypeAndTraits } = require('./determineTypeAndTraits');

/**
 * @description Converts a Gladys device into a Google Actions device.
 * @param {Object} gladysDevice - Gladys device.
 * @returns {Object} GoogleActions device.
 * @example
 * syncDeviceConverter(device);
 */
function syncDeviceConverter(gladysDevice) {
  const { type, traits, attributes } = determineTypeAndTraits(gladysDevice);
  if (!type || !traits.length) {
    return null;
  }

  const device = {
    id: gladysDevice.selector,
    type,
    traits,
    name: {
      name: gladysDevice.name,
    },
    attributes,
    deviceInfo: {
      model: gladysDevice.model,
    },
    roomHint: gladysDevice.room ? gladysDevice.room.name : undefined,
    willReportState: true,
  };

  return device;
}

module.exports = {
  syncDeviceConverter,
};
