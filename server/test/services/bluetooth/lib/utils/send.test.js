const { expect } = require('chai');
const sinon = require('sinon');

const { send } = require('../../../../../services/bluetooth/lib/utils/send');

let clock;

describe('Sending bluetooth packets', () => {
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
    characteristicProps = ['write'];
    called = false;

    peripheral = { address: 'MAC Address' };

    characteristic = {
      uuid: 'uuid',
      properties: characteristicProps,
      write: (data, withoutResponse, callback) => {
        called = true;

        if (throwTimeout) {
          clock.tick(100000);
        } else if (throwError) {
          callback('Error');
        } else {
          callback(false, data);
        }
      },
    };
  });

  afterEach(() => {
    clock.restore();
  });

  it('Send packet with success from array', () => {
    const callback = (error, data) => {
      expect(error).eq(null);

      expect(called).eq(true);

      expect(data).deep.eq([0x01]);
    };

    send(peripheral, characteristic, [0x01], callback);
  });

  it('Send packet with success from buffer', () => {
    const callback = (error, data) => {
      expect(error).eq(null);

      expect(called).eq(true);

      expect(data).deep.eq(Buffer.from([0x01]));
    };

    send(peripheral, characteristic, Buffer.from([0x01]), callback);
  });

  it('Send packet with timeout', () => {
    const callback = (error, data) => {
      expect(error).not.eq(null);
      expect(error.name).eq('BluetoothError');
      expect(error.code).eq('timeout');

      expect(called).eq(true);

      expect(data).eq(undefined);
    };

    throwTimeout = true;

    send(peripheral, characteristic, [0x01], callback);
  });

  it('Send packet with error', () => {
    const callback = (error, data) => {
      expect(error).not.eq(null);
      expect(error.name).eq('BluetoothError');
      expect(error.code).eq('sendError');

      expect(called).eq(true);

      expect(data).eq(undefined);
    };

    throwError = true;

    send(peripheral, characteristic, [0x01], callback);
  });

  it('Send packet on non writable characteristics', () => {
    const callback = (error, data) => {
      expect(error).not.eq(null);
      expect(error.name).eq('BluetoothError');
      expect(error.code).eq('notWritable');

      expect(called).eq(false);

      expect(data).eq(undefined);
    };

    characteristic.properties = [];

    send(peripheral, characteristic, [0x01], callback);
  });
});
