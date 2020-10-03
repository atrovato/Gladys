const { expect } = require('chai');

const {
  decodeValue,
  encodeValue,
  encodeParamValue,
} = require('../../../../../services/bluetooth/lib/utils/bluetooth.utils');
const { INFORMATION_SERVICES } = require('../../../../../services/bluetooth/lib/device/bluetooth.information');

describe('bluetooth.utils decodeValue', () => {
  it('decodeValue no service', async () => {
    const originalValue = 'value';
    const value = decodeValue(INFORMATION_SERVICES, null, null, null, originalValue);
    expect(value).is.eq(originalValue);
  });

  it('decodeValue no characteristic', async () => {
    const originalValue = 'value';
    const value = decodeValue(INFORMATION_SERVICES, '1809', null, null, originalValue);
    expect(value).is.eq(originalValue);
  });

  it('decodeValue no specific decode func', async () => {
    const originalValue = 'value';
    const value = decodeValue(INFORMATION_SERVICES, '1809', '2a6e', null, originalValue);
    expect(value).is.eq(originalValue);
  });

  it('decodeValue no specific decode func, with feature', async () => {
    const originalValue = 'd';
    const value = decodeValue(INFORMATION_SERVICES, '1809', '2a6e', {}, originalValue);
    expect(value).is.eq(13);
  });
});

describe('bluetooth.utils encodeValue', () => {
  it('encodeValue no service', async () => {
    const originalValue = 'value';
    const value = encodeValue(INFORMATION_SERVICES, null, null, originalValue);
    expect(value).is.eq(originalValue);
  });

  it('encodeValue no characteristic', async () => {
    const originalValue = 'value';
    const value = encodeValue(INFORMATION_SERVICES, '1809', null, originalValue);
    expect(value).is.eq(originalValue);
  });

  it('encodeValue no specific decode func', async () => {
    const originalValue = 'value';
    const value = encodeValue(INFORMATION_SERVICES, '1809', '2a6e', originalValue);
    expect(value).is.eq(originalValue);
  });
});

describe('bluetooth.utils encodeParamValue', () => {
  it('encodeParamValue no value', async () => {
    const originalValue = null;
    const value = encodeParamValue(originalValue);
    expect(value).is.eq(undefined);
  });

  it('encodeParamValue empty value', async () => {
    const originalValue = '   \u0000   ';
    const value = encodeParamValue(originalValue);
    expect(value).is.eq(undefined);
  });

  it('encodeParamValue', async () => {
    const originalValue = 'value\u0000';
    const value = encodeParamValue(originalValue);
    expect(value).is.eq('value');
  });
});
