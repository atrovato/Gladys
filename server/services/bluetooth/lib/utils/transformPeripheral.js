/**
 * @description Transform Noble peripheral to Gladys Bluetooth peripheral.
 * @param {Object} noblePeripheral - Noble peripheral.
 * @returns {Object} Peripheral transformed for Gladys.
 * @example
 * transformPeripheral(noblePeripheral);
 */
function transformPeripheral(noblePeripheral) {
  return {
    uuid: noblePeripheral.uuid,
    name: noblePeripheral.advertisement.localName,
    address: noblePeripheral.address,
    rssi: noblePeripheral.rssi,
    lastSeen: noblePeripheral.lastSeen,
    state: noblePeripheral.state,
    connectable: noblePeripheral.connectable,
  };
}

module.exports = {
  transformPeripheral,
};
