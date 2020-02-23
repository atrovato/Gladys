/**
 * @description Reads the value as readable string of the characteristic.
 * @param {Object} characteristic - Characteristic to read value from.
 * @returns {Promise<string>} The value reads from characteristic.
 * @example
 * readValue(characteristic);
 */
async function readValue(characteristic) {
  const value = await characteristic.read();
  return value.toString('utf-8').replace('\u0000', '');
}

module.exports = {
  readValue,
};
