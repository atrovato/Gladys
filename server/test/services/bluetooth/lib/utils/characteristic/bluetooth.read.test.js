const { expect } = require('chai');
const sinon = require('sinon');

const { assert } = sinon;

const { BadParameters } = require('../../../../../../utils/coreErrors');

const { read } = require('../../../../../../services/bluetooth/lib/utils/characteristic/bluetooth.read');

describe('bluetooth.characteristic.read', () => {
  let characteristic;

  let hasRead;
  let throwError;

  beforeEach(() => {
    hasRead = false;
    throwError = false;

    characteristic = {
      properties: ['read'],
      read: (callback) => {
        hasRead = true;

        if (throwError) {
          callback('error');
        } else {
          callback(null, 'value');
        }
      },
    };
  });

  it('characteristic.read char no props', async () => {
    delete characteristic.properties;

    try {
      await read(characteristic);
      assert.fail('Should have fail');
    } catch (e) {
      expect(hasRead).eq(false);
      expect(e).to.be.instanceOf(BadParameters);
    }
  });

  it('characteristic.read char no read props', async () => {
    characteristic.properties = ['write'];

    try {
      await read(characteristic);
      assert.fail('Should have fail');
    } catch (e) {
      expect(hasRead).eq(false);
      expect(e).to.be.instanceOf(BadParameters);
    }
  });

  it('characteristic.read with success', async () => {
    const hasReadValue = await read(characteristic);

    expect(hasReadValue).deep.eq('value');
    expect(hasRead).eq(true);
  });

  it('characteristic.read error', async () => {
    throwError = true;

    try {
      await read(characteristic);
      assert.fail('Should have fail');
    } catch (e) {
      expect(hasRead).eq(true);
      expect(e).to.be.instanceOf(Error);
    }
  });
});
