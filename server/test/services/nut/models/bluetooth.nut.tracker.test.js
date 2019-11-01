const { expect } = require('chai');
const sinon = require('sinon');

const model = require('../../../../services/nut/models/nut.tracker');

describe('Bluetooth model Tracker', () => {
  beforeEach(() => {
    sinon.reset();
  });

  it('name', () => {
    expect(model.name).eq('tracker');
  });

  it('matches', () => {
    const result = model.matches();
    expect(result).eq(true);
  });

  it('device', () => {
    const result = model.device;
    expect(result).not.eq(undefined);
    expect(result.features).to.have.lengthOf(1);
    expect(result.features[0].category).eq('battery');
  });

  it('pollFeature', () => {
    const result = model.pollFeature;
    expect(result).not.eq(undefined);
    expect(Object.keys(result)).to.have.lengthOf(1);
  });

  it('pollFeature battery no data', () => {
    const result = model.pollFeature.battery.transformResult();
    expect(result).eq(undefined);
  });

  it('pollFeature battery no data', () => {
    const result = model.pollFeature.battery.transformResult({ '1888': 'invalid' });
    expect(result).eq(undefined);
  });

  it('pollFeature battery no data', () => {
    const result = model.pollFeature.battery.transformResult({ '2a19': Buffer.from([0x61]) });
    expect(result).eq(97);
  });
});
