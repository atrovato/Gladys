const { expect } = require('chai');
const sinon = require('sinon');

const { assert } = sinon;

const { BadParameters } = require('../../../../../../utils/coreErrors');

const { write } = require('../../../../../../services/bluetooth/lib/utils/characteristic/bluetooth.write');

describe('bluetooth.characteristic.write', () => {
  let characteristic;

  let hasWrite;
  let throwError;

  beforeEach(() => {
    hasWrite = false;
    throwError = false;

    characteristic = {
      properties: ['write'],
      write: (data, arg2, callback) => {
        hasWrite = true;

        if (throwError) {
          callback('error');
        } else {
          callback();
        }
      },
    };
  });

  it('characteristic.write char no props', async () => {
    delete characteristic.properties;

    const originalValue = [0x01];
    try {
      await write(characteristic, originalValue);
      assert.fail('Should have fail');
    } catch (e) {
      expect(hasWrite).eq(false);
      expect(e).to.be.instanceOf(BadParameters);
    }
  });

  it('characteristic.write char no write props', async () => {
    characteristic.properties = ['read'];

    const originalValue = [0x01];
    try {
      await write(characteristic, originalValue);
      assert.fail('Should have fail');
    } catch (e) {
      expect(hasWrite).eq(false);
      expect(e).to.be.instanceOf(BadParameters);
    }
  });

  it('characteristic.write array with success', async () => {
    const originalValue = [0x01];
    const wroteValue = await write(characteristic, originalValue);

    expect(wroteValue).deep.eq(originalValue);
    expect(hasWrite).eq(true);
  });

  it('characteristic.write buffer with success', async () => {
    const originalValue = Buffer.from([0x01]);
    const wroteValue = await write(characteristic, originalValue);

    expect(wroteValue).deep.eq(originalValue);
    expect(hasWrite).eq(true);
  });

  it('characteristic.write error', async () => {
    throwError = true;
    const originalValue = Buffer.from([0x01]);

    try {
      await write(characteristic, originalValue);
      assert.fail('Should have fail');
    } catch (e) {
      expect(hasWrite).eq(true);
      expect(e).to.be.instanceOf(Error);
    }
  });
});
