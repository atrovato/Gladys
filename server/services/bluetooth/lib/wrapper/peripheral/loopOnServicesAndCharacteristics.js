const { getCharacteristicFromPeripheral } = require('./getCharacteristicFromPeripheral');

/**
 * @description Ask peripheral for information services.
 * @param {Object} peripheral - Bluetooth peripheral.
 * @param {Object} device - Bluetooth device.
 * @param {Object} servicesAndCharacteristics - Object with first service UUID as key,
 * containing another object with characteritic as key.
 * @returns {Promise<any[]>} - A successful Promise.
 * @example
 * loopOnServicesAndCharacteristics({}, {}, { '1800': {'2a29': (characteristic, device) => ()} });
 */
async function loopOnServicesAndCharacteristics(peripheral, device, servicesAndCharacteristics) {
  return Promise.all(
    Object.keys(servicesAndCharacteristics).map(async (serviceUuid) => {
      // Check for more information
      const managedCharacteristics = servicesAndCharacteristics[serviceUuid];
      return Promise.all(
        Object.keys(managedCharacteristics).map(async (characteristicUuid) => {
          const characteristic = await getCharacteristicFromPeripheral(peripheral, serviceUuid, characteristicUuid);

          if (characteristic) {
            await managedCharacteristics[characteristicUuid](characteristic, device);
          }

          return Promise.resolve();
        }),
      );
    }),
  );
}

module.exports = {
  loopOnServicesAndCharacteristics,
};
