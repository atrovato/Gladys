const { expect } = require('chai');
const sinon = require('sinon');

const { discoverServices } = require('../../../../../services/bluetooth/lib/utils/discoverServices');

let clock;

describe('Discover bluetooth services', () => {
  let peripheral;
  let service;
  let services;
  let throwTimeout;
  let throwError;
  let discovered;

  beforeEach(() => {
    clock = sinon.useFakeTimers();
    throwTimeout = false;
    throwError = false;

    service = { uuid: 'service1' };
    services = [service];

    discovered = false;

    peripheral = {
      address: 'MAC address',
      discoverServices: (uuids, callback) => {
        discovered = true;

        if (throwTimeout) {
          clock.tick(100000);
        } else if (throwError) {
          callback('Error', null);
        } else {
          callback(null, services);
        }
      },
    };
  });

  afterEach(() => {
    clock.restore();
  });

  it('Discover peripheral services with success', () => {
    const callback = (error, serviceMap) => {
      expect(null).eq(error);

      expect(true).eq(discovered);

      expect(1).eq(serviceMap.size);
    };

    discoverServices(peripheral, ['fff0'], callback);
  });

  it('Discover peripheral services with timeout', () => {
    const callback = (error, serviceMap) => {
      expect(null).not.eq(error);
      expect('BluetoothError').eq(error.name);
      expect('timeout').eq(error.code);

      expect(true).eq(discovered);

      expect(undefined).eq(serviceMap);
    };

    throwTimeout = true;

    discoverServices(peripheral, ['fff0'], callback);
  });

  it('Discover peripheral services with error', () => {
    const callback = (error, serviceMap) => {
      expect(null).not.eq(error);
      expect('BluetoothError').eq(error.name);
      expect('discoverServiceError').eq(error.code);

      expect(true).eq(discovered);

      expect(undefined).eq(serviceMap);
    };

    throwError = true;

    discoverServices(peripheral, ['fff0'], callback);
  });

  it('Discover peripheral services with error (none found)', () => {
    const callback = (error, serviceMap) => {
      expect(null).not.eq(error);
      expect('BluetoothError').eq(error.name);
      expect('noServiceFound').eq(error.code);

      expect(true).eq(discovered);

      expect(undefined).eq(serviceMap);
    };

    services = [];

    discoverServices(peripheral, ['fff0'], callback);
  });

  it('Discover service all already discovered', () => {
    const tmpServices = [{ uuid: 'fff2' }];
    peripheral.services = tmpServices;

    const callback = (error, serviceMap) => {
      expect(null).eq(error);

      expect(false).eq(discovered);

      const expectedResult = new Map();
      expectedResult.set('fff2', tmpServices[0]);
      expect(expectedResult).deep.eq(serviceMap);
    };

    discoverServices(peripheral, ['fff2'], callback);
  });

  it('Discover service half already discovered', () => {
    const tmpServices = [{ uuid: 'fff2' }];
    peripheral.services = tmpServices;

    const callback = (error, serviceMap) => {
      expect(null).eq(error);

      expect(true).eq(discovered);

      const expectedResult = new Map();
      expectedResult.set('fff2', tmpServices[0]);
      expectedResult.set(service.uuid, service);
      expect(expectedResult).deep.eq(serviceMap);
    };

    discoverServices(peripheral, ['fff0', 'fff2'], callback);
  });
});
