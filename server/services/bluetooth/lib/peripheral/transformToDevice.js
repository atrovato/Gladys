const { addSelector } = require('../../../../utils/addSelector');
/**
 * @description Transform Noble peripheral to Gladys Bluetooth peripheral.
 * @param {Object} peripheral - Bluetooth peripheral.
 * @returns {Object} Peripheral transformed for Gladys.
 * @example
 * transform({});
 */
function transformToDevice(peripheral) {
  const { uuid, name, connectable } = peripheral;
  const externalId = `bluetooth:${uuid}`;
  const params = [
    {
      name: 'connectable',
      value: connectable === true,
    },
    {
      name: 'loaded',
      value: false,
    },
  ];
  const device = {
    name: name || uuid,
    external_id: externalId,
    selector: externalId,
    features: [],
    params,
    last_value_changed: new Date(),
  };
  addSelector(device);
  return device;
}

module.exports = {
  transformToDevice,
};
