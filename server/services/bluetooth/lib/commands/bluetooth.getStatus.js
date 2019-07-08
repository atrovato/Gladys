/**
 * @description Retrieve current Bluetooth status.
 * @example
 * bluetooth.getStatus();
 */
function getStatus() {
  let bluetoothStatus = 'loading';
  if (!this.ready) {
    bluetoothStatus = 'poweredOff';
  } else if (this.scanning) {
    bluetoothStatus = 'scanning';
  } else {
    bluetoothStatus = 'ready';
  }
  return bluetoothStatus;
}

module.exports = {
  getStatus,
};
