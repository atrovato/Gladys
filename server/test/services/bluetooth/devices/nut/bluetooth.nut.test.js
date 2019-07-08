const { expect } = require('chai');
const sinon = require('sinon');

const awox = require('../../../../../services/bluetooth/devices/nut');

describe('Bluetooth Nut -> getMatchingModels', () => {
  beforeEach(() => {
    sinon.reset();
  });

  it('not constructor', () => {
    const result = awox.getMatchingModels({});
    expect(result).deep.eq([]);
  });

  it('invalid constructor', () => {
    const result = awox.getMatchingModels({ '2a00': 'unknown' });
    expect(result).deep.eq([]);
  });

  it('valid constructor', () => {
    const result = awox.getMatchingModels({ '2a00': 'Nut' });
    expect(result).deep.eq(['Smart Tracker']);
  });
});
