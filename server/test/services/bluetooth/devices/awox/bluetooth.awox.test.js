const { expect } = require('chai');
const sinon = require('sinon');

const awox = require('../../../../../services/bluetooth/devices/awox');

const remote = require('../../../../../services/bluetooth/devices/awox/models/awox.remote.mesh');
const smlc = require('../../../../../services/bluetooth/devices/awox/models/awox.smlc');
const smlcm = require('../../../../../services/bluetooth/devices/awox/models/awox.smlc.mesh');
const smlw = require('../../../../../services/bluetooth/devices/awox/models/awox.smlw');
const smlwm = require('../../../../../services/bluetooth/devices/awox/models/awox.smlw.mesh');

describe('Bluetooth AwoX -> getMatchingModels', () => {
  beforeEach(() => {
    sinon.reset();
  });

  it('not constructor', () => {
    const result = awox.getMatchingModels({});
    expect(result).deep.eq([]);
  });

  it('invalid constructor', () => {
    const result = awox.getMatchingModels({ '2a29': 'unknown' });
    expect(result).deep.eq([]);
  });

  it('valid constructor, no name', () => {
    const result = awox.getMatchingModels({ '2a29': 'AwoX' });
    expect(result).deep.eq([]);
  });

  it('valid constructor, SmartLIGHT Mesh Remote', () => {
    const result = awox.getMatchingModels({ '2a29': 'AwoX', '2a24': 'rcuBLABLAm_whatever' });
    expect(result).deep.eq([remote]);
  });

  it('valid constructor, SmartLIGHT Color', () => {
    const result = awox.getMatchingModels({ '2a29': 'AwoX', '2a24': 'anything-color' });
    expect(result).deep.eq([smlc]);
  });

  it('valid constructor, SmartLIGHT White', () => {
    const result = awox.getMatchingModels({ '2a29': 'AwoX', '2a24': 'anything-white' });
    expect(result).deep.eq([smlw]);
  });

  it('valid constructor, SmartLIGHT Mesh Color', () => {
    const result = awox.getMatchingModels({ '2a29': 'AwoX', '2a24': 'anythingm-color' });
    expect(result).deep.eq([smlcm]);
  });

  it('valid constructor, SmartLIGHT Mesh White', () => {
    const result = awox.getMatchingModels({ '2a29': 'AwoX', '2a24': 'anythingm-white' });
    expect(result).deep.eq([smlwm]);
  });
});
