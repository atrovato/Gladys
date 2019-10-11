const { BroadlinkDeviceSP2, BroadlinkDeviceMP1, BroadlinkDeviceRM2 } = require('broadlink-js');

/**
 * @description Store discovered peripheral.
 * @param {Object} peripheralInfo - Peripheral information generated by Broadlink library.
 * @example
 * gladys.broadlink.addPeripheral({
 *  name: 'RM3 Pro Plus',
 *  address: '192.168.1.1',
 *  ...
 * });
 */
function addPeripheral(peripheralInfo) {
  let broadlinkDevice;
  switch (peripheralInfo.module) {
    case 'sp2': {
      broadlinkDevice = new BroadlinkDeviceSP2(peripheralInfo);
      break;
    }
    case 'unknow':
    case 'rm2': {
      broadlinkDevice = new BroadlinkDeviceRM2(peripheralInfo);
      break;
    }
    case 'mp1': {
      broadlinkDevice = new BroadlinkDeviceMP1(peripheralInfo);
      break;
    }
    default:
      throw new Error(`Broadlink ${peripheralInfo.module} is not recognized.`);
  }

  const peripheral = {
    name: peripheralInfo.name,
    address: peripheralInfo.address,
    mac: peripheralInfo.mac.toString('hex'),
    canLearn: !!broadlinkDevice.learnCode,
    hasTemperatureSensor: !!broadlinkDevice.getTemperature,
    ready: false,
  };
  this.peripherals[peripheral.mac] = peripheral;
  this.broadlinkDevices[peripheral.mac] = broadlinkDevice;

  broadlinkDevice.on('ready', () => {
    this.peripherals[peripheral.mac].ready = true;
  });
}

module.exports = {
  addPeripheral,
};
