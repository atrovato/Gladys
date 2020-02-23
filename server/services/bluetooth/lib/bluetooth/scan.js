const { TIMERS } = require('../utils/constants');
const { ServiceNotConfiguredError } = require('../../../../utils/coreErrors');
const logger = require('../../../../utils/logger');

/**
 * @description Scan Bluetooth peripherals.
 * @example
 * bluetooth.scan();
 */
async function scan() {
  if (this.powered) {
    if (!this.scanning) {
      logger.debug('Bluetooth: scan in progress...');

      const discoveredPeripherals = [];
      this.discoveredDevices = {};
      this.bluetooth.startScanning((peripheral) => discoveredPeripherals.push(peripheral));
      this.scanning = true;
      this.broadcastStatus();

      // Scanning timeout
      await new Promise((resolve) => setTimeout(resolve, TIMERS.SCAN));

      // Scanning all found peripherals
      logger.debug(`Bluetooth: discovered ${discoveredPeripherals.length} peripherals`);
      // Explore peripherals async
      discoveredPeripherals.forEach(async (peripheral, index) => {
        logger.debug(`Bluetooth: explore ${index + 1}/${discoveredPeripherals.length} peripheral`);
        this.explore(peripheral);
      });
    }

    logger.warn('Bluetooth: stop scanning');
    this.bluetooth.stopScanning();
    this.scanning = false;

    this.broadcastStatus();

    return null;
  }

  throw new ServiceNotConfiguredError('Impossible to scan Bluetooth devices while it is not powered');
}

module.exports = {
  scan,
};
