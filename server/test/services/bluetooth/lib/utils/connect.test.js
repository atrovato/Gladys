const { expect } = require('chai');
const sinon = require('sinon');

const { connect } = require('../../../../../services/bluetooth/lib/utils/connect');

let clock;

describe('Connect bluetooth peripherals', () => {
  let peripheral;
  let throwTimeout;
  let throwError;

  beforeEach(() => {
    clock = sinon.useFakeTimers();
    throwTimeout = false;
    throwError = false;

    peripheral = {
      connected: false,
      connectable: true,
      addressType: 'public',
      connect(callback) {
        this.connected = true;

        if (throwTimeout) {
          clock.tick(100000);
        } else if (throwError) {
          callback('Error');
        } else {
          callback();
        }
      },
    };
  });

  afterEach(() => {
    clock.restore();
  });

  it('Connect to peripheral with success', () => {
    const callback = (error) => {
      expect(null).eq(error);

      expect(true).eq(peripheral.connected);
    };

    connect(
      peripheral,
      callback,
    );
  });

  it('Connect to no peripheral', () => {
    const callback = (error) => {
      expect(null).not.eq(error);
      expect('BluetoothError').eq(error.name);
      expect('notExist').eq(error.code);

      expect(false).eq(peripheral.connected);
    };

    connect(
      null,
      callback,
    );
  });

  it('Connect to peripheral with timeout', () => {
    const callback = (error) => {
      expect(null).not.eq(error);
      expect('BluetoothError').eq(error.name);
      expect('timeout').eq(error.code);

      expect(true).eq(peripheral.connected);
    };

    throwTimeout = true;

    connect(
      peripheral,
      callback,
    );
  });

  it('Connect to peripheral with error', () => {
    const callback = (error) => {
      expect(null).not.eq(error);
      expect('connectFail').eq(error.code);

      expect(true).eq(peripheral.connected);
    };

    throwError = true;

    connect(
      peripheral,
      callback,
    );
  });

  it('Connect to peripheral with error (not connectable)', () => {
    const callback = (error) => {
      expect(undefined).not.eq(error);
      expect('BluetoothError').eq(error.name);
      expect('notConnectable').eq(error.code);

      expect(false).eq(peripheral.connected);
    };

    peripheral.connectable = false;

    connect(
      peripheral,
      callback,
    );
  });

  it('Connect to peripheral already connected', () => {
    const callback = (error) => {
      expect(null).eq(error);

      expect(false).eq(peripheral.connected);
    };

    peripheral.state = 'connected';

    connect(
      peripheral,
      callback,
    );
  });
});
