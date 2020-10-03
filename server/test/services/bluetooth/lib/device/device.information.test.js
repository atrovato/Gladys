const { expect } = require('chai');

const {
  decodeValue,
  encodeValue,
  encodeParamValue,
} = require('../../../../../services/bluetooth/lib/device/bluetooth.information');

describe('bluetooth.device.information decodeValue', () => {
  it('decodeValue no service', async () => {
    const originalValue = 'value';
    const value = decodeValue(null, null, null, originalValue);
    expect(value).is.eq(originalValue);
  });

  it('decodeValue no characteristic', async () => {
    const originalValue = 'value';
    const value = decodeValue('1809', null, null, originalValue);
    expect(value).is.eq(originalValue);
  });

  it('decodeValue no specific decode func', async () => {
    const originalValue = 'value';
    const value = decodeValue('1809', '2a6e', null, originalValue);
    expect(value).is.eq(originalValue);
  });

  it('decodeValue no specific decode func, with feature', async () => {
    const originalValue = 'd';
    const value = decodeValue('1809', '2a6e', {}, originalValue);
    expect(value).is.eq(13);
  });
});

describe('bluetooth.device.information encodeValue', () => {
  it('encodeValue no service', async () => {
    const originalValue = 'value';
    const value = encodeValue(null, null, originalValue);
    expect(value).is.eq(originalValue);
  });

  it('encodeValue no characteristic', async () => {
    const originalValue = 'value';
    const value = encodeValue('1809', null, originalValue);
    expect(value).is.eq(originalValue);
  });

  it('encodeValue no specific decode func', async () => {
    const originalValue = 'value';
    const value = encodeValue('1809', '2a6e', originalValue);
    expect(value).is.eq(originalValue);
  });
});

describe('bluetooth.device.information encodeParamValue', () => {
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
