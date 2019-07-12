const { TIMERS } = require('../utils/constants');

let timer;

/**
 * @description Scan Bluetooth peripherals.
 * @param {boolean} state - Set _true_ to start scanning, default _false_.
 * @example
 * bluetooth.scan(true);
 */
function scan(state = false) {
  if (timer) {
    clearTimeout(timer);
  }

  if (this.ready && state) {
    this.bluetooth.startScanning();

    timer = setTimeout(() => {
      this.bluetooth.stopScanning();
    }, TIMERS.SCAN);
  } else {
    this.bluetooth.stopScanning();
  }
}

module.exports = {
  scan,
};
