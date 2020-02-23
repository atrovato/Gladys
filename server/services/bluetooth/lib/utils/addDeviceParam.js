/**
 * @description Add or update a param to a device.
 * @param {Object} device - Device to add parameter.
 * @param {string} paramName - The key.
 * @param {any} paramValue - The value.
 * @returns {Object} The device.
 * @example
 * addDeviceParam({params: []}, 'paramName', 'paramValue')
 */
function addDeviceParam(device, paramName, paramValue) {
  const paramId = device.params.findIndex((p) => p.name === paramName);

  if (paramId >= 0) {
    device.params[paramId].value = paramValue;
  } else {
    device.params.push({ name: paramName, paramValue });
  }

  return device;
}

module.exports = {
  addDeviceParam,
};
