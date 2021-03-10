/**
 * @description Check is current device is generic compatible.
 * @param {Object} modelData - The device model data.
 * @returns {boolean} Returns true if device is "generic".
 * @example
 * isCompatible({ mesh: true, remote: true });
 */
function isCompatible(modelData) {
  const { mesh, remote } = modelData;
  return remote || mesh;
}

module.exports = {
  isCompatible,
};
