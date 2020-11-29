/**
 * @description Check is current device is generic compatible.
 * @param {Object} modelData - The device model data.
 * @returns {boolean} Returns true if device is "generic".
 * @example
 *
 * isCompatible({ mesh: true, remote: true });
 */
function isCompatible(modelData) {
  const { remote, mesh, color, white } = modelData;
  return !remote && !mesh && (color || white);
}

module.exports = {
  isCompatible,
};
