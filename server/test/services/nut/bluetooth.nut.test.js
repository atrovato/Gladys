const { expect } = require('chai');
const sinon = require('sinon');

const nut = require('../../../services/nut');
const nutDevice = require('../../../services/nut/models/nut.tracker');

describe('Bluetooth Nut -> getMatchingModels', () => {
  beforeEach(() => {
    sinon.reset();
  });

  it('not constructor', () => {
    const result = nut.getMatchingModels({});
    expect(result).deep.eq([]);
  });

  it('invalid constructor', () => {
    const result = nut.getMatchingModels({ '2a00': 'unknown' });
    expect(result).deep.eq([]);
  });

  it('valid constructor', () => {
    const result = nut.getMatchingModels({ '2a00': 'Nut' });
    expect(result).deep.eq([nutDevice]);
  });
});
