/**
 * @description Retrieve current Bluetooth status.
 * @returns {Object} Bluetooth status.
 * @example
 * bluetooth.getStatus();
 */
function getStatus() {
  return {
    powered: this.powered,
    scanning: this.scanning,
  };
}

module.exports = {
  getStatus,
};
