const logger = require('../../../../utils/logger');

const { DEVICE_POLL_FREQUENCIES } = require('../../../../utils/constants');
const { addSelector } = require('../../../../utils/addSelector');
const { setDeviceFeature } = require('../../../../utils/setDeviceFeature');

const fillFeature = (serviceUuid, characteristic, device, tmpFeature) => {
  const externalId = `${device.external_id}:${serviceUuid}:${characteristic.uuid}`;
  const feature = { ...tmpFeature, external_id: externalId, selector: externalId };

  addSelector(feature);

  if (feature.read_only && !device.should_poll && !characteristic.notify) {
    device.should_poll = true;
    device.poll_frequency = DEVICE_POLL_FREQUENCIES.EVERY_MINUTES;
  }

  logger.trace(`Bluetooth: add new feature ${feature.name} to device ${device.name}`);
  return setDeviceFeature(device, feature);
};

const encodeParamValue = (value) => {
  let encodedValue;

  if (value) {
    encodedValue = value
      .toString('utf-8')
      .replace('\u0000', '')
      .trim();
  }

  if (encodedValue === '') {
    return undefined;
  }

  return encodedValue;
};

const defaultDecodeValue = (feature, value) => {
  if (feature) {
    return parseInt(value, 16);
  }

  return value;
};

const decodeValue = (serviceMap, serviceUuid, characteristicUuid, feature, value) => {
  const serviceInfo = serviceMap[serviceUuid];
  if (!serviceInfo) {
    logger.warn(`Bluetooth: unknown service ${serviceUuid}`);
    return defaultDecodeValue(feature, value);
  }

  const charInfo = serviceInfo[characteristicUuid];
  if (!charInfo) {
    logger.warn(`Bluetooth: unknown characteristic ${characteristicUuid} for ${serviceUuid}`);
    return defaultDecodeValue(feature, value);
  }

  return (serviceMap[serviceUuid][characteristicUuid].decode || defaultDecodeValue)(feature, value);
};

const defaultEncodeValue = (value) => value;

const encodeValue = (serviceMap, serviceUuid, characteristicUuid, value) => {
  const serviceInfo = serviceMap[serviceUuid];

  if (!serviceInfo) {
    logger.warn(`Bluetooth: unknown service ${serviceUuid}`);
    return defaultEncodeValue(value);
  }

  const charInfo = serviceInfo[characteristicUuid];
  if (!charInfo) {
    logger.warn(`Bluetooth: unknown characteristic ${characteristicUuid} for ${serviceUuid}`);
    return defaultEncodeValue(value);
  }

  return (serviceMap[serviceUuid][characteristicUuid].decode || defaultEncodeValue)(value);
};

module.exports = {
  fillFeature,
  encodeParamValue,
  decodeValue,
  encodeValue,
};
