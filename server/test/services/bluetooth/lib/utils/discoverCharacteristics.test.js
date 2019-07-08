const { expect } = require('chai');
const sinon = require('sinon');

const { discoverCharacteristics } = require('../../../../../services/bluetooth/lib/utils/discoverCharacteristics');

let clock;

describe('Discover bluetooth characteristics', () => {
  let peripheral;
  let service;
  let characteristc;
  let characteristcs;
  let throwTimeout;
  let throwError;
  let discovered;

  beforeEach(() => {
    clock = sinon.useFakeTimers();
    throwTimeout = false;
    throwError = false;

    peripheral = { address: 'MAC adress' };
    characteristc = { uuid: 'uuid' };
    characteristcs = [characteristc];
    discovered = false;

    service = {
      uuid: 'serviceUUID',
      discoverCharacteristics: (characteristic, callback) => {
        discovered = true;

        if (throwTimeout) {
          clock.tick(100000);
        } else if (throwError) {
          callback('Error', null);
        } else {
          callback(null, characteristcs);
        }
      },
    };
  });

  afterEach(() => {
    clock.restore();
  });

  it('Discover service characteristics with success', () => {
    const callback = (error, characteristicMap) => {
      expect(null).eq(error);

      expect(true).eq(discovered);

      const expectedResult = new Map();
      expectedResult.set(characteristc.uuid, characteristc);
      expect(expectedResult).deep.eq(characteristicMap);
    };

    discoverCharacteristics(peripheral, service, ['fff1'], callback);
  });

  it('Discover service characteristics with timeout', () => {
    const callback = (error, characteristicMap) => {
      expect(null).not.eq(error);
      expect('BluetoothError').eq(error.name);
      expect('timeout').eq(error.code);

      expect(true).eq(discovered);

      expect(undefined).eq(characteristicMap);
    };

    throwTimeout = true;

    discoverCharacteristics(peripheral, service, ['fff1'], callback);
  });

  it('Discover service characteristics with error', () => {
    const callback = (error, characteristicMap) => {
      expect(null).not.eq(error);
      expect('BluetoothError').eq(error.name);
      expect('discoverCharacteristicError').eq(error.code);

      expect(true).eq(discovered);

      expect(undefined).eq(characteristicMap);
    };

    throwError = true;

    discoverCharacteristics(peripheral, service, ['fff1'], callback);
  });

  it('Discover service characteristics with error (none found)', () => {
    const callback = (error, serviceMap) => {
      expect(null).not.eq(error);
      expect('BluetoothError').eq(error.name);
      expect('noCharacteristicFound').eq(error.code);

      expect(true).eq(discovered);

      expect(undefined).eq(serviceMap);
    };

    characteristcs = [];

    discoverCharacteristics(peripheral, service, ['fff1'], callback);
  });

  it('Discover service characteristics all already discovered', () => {
    const tmpCharacteristcs = [{ uuid: 'fff2' }];
    service.characteristics = tmpCharacteristcs;

    const callback = (error, characteristicMap) => {
      expect(null).eq(error);

      expect(false).eq(discovered);

      const expectedResult = new Map();
      expectedResult.set('fff2', tmpCharacteristcs[0]);
      expect(expectedResult).deep.eq(characteristicMap);
    };

    discoverCharacteristics(peripheral, service, ['fff2'], callback);
  });

  it('Discover service characteristics half already discovered', () => {
    const tmpCharacteristcs = [{ uuid: 'fff2' }];
    service.characteristics = tmpCharacteristcs;

    const callback = (error, characteristicMap) => {
      expect(null).eq(error);

      expect(true).eq(discovered);

      const expectedResult = new Map();
      expectedResult.set('fff2', tmpCharacteristcs[0]);
      expectedResult.set(characteristc.uuid, characteristc);
      expect(expectedResult).deep.eq(characteristicMap);
    };

    discoverCharacteristics(peripheral, service, ['fff1', 'fff2'], callback);
  });
});
