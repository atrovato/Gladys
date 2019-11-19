/**
 * @description Send the new device value to Broadlink device.
 * @param {Object} device - Updated Gladys device.
 * @param {Object} deviceFeature - Updated Gladys device feature.
 * @param {string|number} value - The new device feature value.
 * @example
 * setValue(device, deviceFeature, 0);
 */
function setValue(device, deviceFeature, value) {
  const splittedId = device.external_id.split(':');
  const peripheral = splittedId[1];
  const convertedValue = value === 1 ? 'on' : value;

  switch (device.model) {
    case 'sp2': {
      this.broadlinkDevices[peripheral].setPower(convertedValue);
      break;
    }
    case 'mp1': {
      this.broadlinkDevices[peripheral].setPower(convertedValue, splittedId[2]);
      break;
    }
    default: {
      const param = device.params.find((p) => p.name === `code_${deviceFeature.type}`);
      if (param) {
        this.send(peripheral, param.value);
      }
    }
  }

  return null;
}

module.exports = {
  setValue,
};
