const { expect } = require('chai');
const sinon = require('sinon');

const { assert, fake } = sinon;

const { BadParameters } = require('../../../../../../utils/coreErrors');

const { subscribe } = require('../../../../../../services/bluetooth/lib/utils/characteristic/bluetooth.subscribe');

describe('bluetooth.characteristic.subscribe', () => {
  let characteristic;

  let hasRead;
  let throwError;

  beforeEach(() => {
    hasRead = false;
    throwError = false;

    characteristic = {
      properties: ['notify'],
      subscribe: (callback) => {
        hasRead = true;

        if (throwError) {
          callback('error');
        } else {
          callback();
        }
      },
      on: fake.returns(null),
    };
  });

  afterEach(() => {
    sinon.reset();
  });

  it('characteristic.subscribe char no props', async () => {
    delete characteristic.properties;

    try {
      await subscribe(characteristic, null);
      assert.fail('Should have fail');
    } catch (e) {
      expect(hasRead).eq(false);
      expect(e).to.be.instanceOf(BadParameters);

      assert.notCalled(characteristic.on);
    }
  });

  it('characteristic.subscribe char no subscribe props', async () => {
    characteristic.properties = ['write'];

    try {
      await subscribe(characteristic, null);
      assert.fail('Should have fail');
    } catch (e) {
      expect(hasRead).eq(false);
      expect(e).to.be.instanceOf(BadParameters);

      assert.notCalled(characteristic.on);
    }
  });

  it('characteristic.subscribe with success', async () => {
    await subscribe(characteristic, null);

    expect(hasRead).eq(true);

    assert.calledOnce(characteristic.on);
  });

  it('characteristic.subscribe with success (with indicate)', async () => {
    characteristic.properties = ['indicate'];

    await subscribe(characteristic, null);

    expect(hasRead).eq(true);

    assert.calledOnce(characteristic.on);
  });

  it('characteristic.subscribe error', async () => {
    throwError = true;

    try {
      await subscribe(characteristic, null);
      assert.fail('Should have fail');
    } catch (e) {
      expect(hasRead).eq(true);
      expect(e).to.be.instanceOf(Error);

      assert.notCalled(characteristic.on);
    }
  });
});
