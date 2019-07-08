const { expect } = require('chai');
const sinon = require('sinon');

const { read } = require('../../../../../services/bluetooth/lib/utils/read');

let clock;

describe('Reading bluetooth packets', () => {
  let peripheral;
  let characteristic;
  let characteristicProps;
  let throwTimeout;
  let throwError;
  let called;

  beforeEach(() => {
    clock = sinon.useFakeTimers();
    throwTimeout = false;
    throwError = false;
    characteristicProps = ['read'];
    called = false;

    peripheral = { uuid: 'MAC Address' };

    characteristic = {
      uuid: 'uuid',
      properties: characteristicProps,
      read: (callback) => {
        called = true;

        if (throwTimeout) {
          clock.tick(100000);
        } else if (throwError) {
          callback('Error');
        } else {
          callback(false, 'value');
        }
      },
    };
  });

  afterEach(() => {
    clock.restore();
  });

  it('Read packet with success', () => {
    const callback = (error, data) => {
      expect(null).eq(error);

      expect(true).eq(called);

      expect('value').eq(data);
    };

    read(peripheral, characteristic, callback);
  });

  it('Read packet with timeout', () => {
    const callback = (error, data) => {
      expect(null).not.eq(error);
      expect('BluetoothError').eq(error.name);
      expect('timeout').eq(error.code);

      expect(true).eq(called);

      expect(undefined).eq(data);
    };

    throwTimeout = true;

    read(peripheral, characteristic, callback);
  });

  it('Read packet with error', () => {
    const callback = (error, data) => {
      expect(null).not.eq(error);
      expect('BluetoothError').eq(error.name);
      expect('readError').eq(error.code);

      expect(true).eq(called);

      expect(undefined).eq(data);
    };

    throwError = true;

    read(peripheral, characteristic, callback);
  });

  it('Read packet on non readable characteristics', () => {
    const callback = (error, data) => {
      expect(null).not.eq(error);
      expect('BluetoothError').eq(error.name);
      expect('notReadable').eq(error.code);

      expect(false).eq(called);

      expect(undefined).eq(data);
    };

    characteristic.properties = [];

    read(peripheral, characteristic, callback);
  });
});
