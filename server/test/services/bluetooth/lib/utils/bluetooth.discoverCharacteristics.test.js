const { expect } = require('chai');
const sinon = require('sinon');

const { fake, assert } = sinon;

const {
  discoverCharacteristics,
} = require('../../../../../services/bluetooth/lib/utils/service/bluetooth.discoverCharacteristics');
const { NotFoundError } = require('../../../../../utils/coreErrors');

describe('Discover bluetooth characteristics', () => {
  let service;
  let characteristic;
  let characteristics;
  let throwError;
  let discovered;

  beforeEach(() => {
    throwError = false;

    characteristic = { uuid: 'uuid' };
    characteristics = [characteristic];
    discovered = false;

    service = {
      uuid: 'serviceUUID',
      discoverCharacteristics: (arg, callback) => {
        discovered = true;

        if (throwError) {
          callback('error');
        } else {
          callback(null, characteristics);
        }
      },
    };
  });

  afterEach(() => {
    sinon.reset();
  });

  it('Discover service characteristics with success', async () => {
    const result = await discoverCharacteristics(service, ['fff1']);

    const expectedResult = { [characteristic.uuid]: characteristic };

    expect(result).deep.eq(expectedResult);
    expect(discovered).is.eq(true);
  });

  it('Discover service characteristics with error', async () => {
    throwError = true;

    try {
      await discoverCharacteristics(service, ['fff1']);
      assert.fail('Should have fail');
    } catch (e) {
      expect(e).is.instanceOf(Error);
      expect(discovered).is.eq(true);
    }
  });

  it('Discover service characteristics with error (none found)', async () => {
    characteristics = fake.resolves([]);

    try {
      await discoverCharacteristics(service, ['fff1']);
      assert.fail('Should have fail');
    } catch (e) {
      expect(e).is.instanceOf(NotFoundError);
      expect(discovered).is.eq(true);
    }
  });

  it('Discover service characteristics all already discovered', async () => {
    const tmpCharacteristcs = [{ uuid: 'fff2' }];
    service.characteristics = tmpCharacteristcs;

    const result = await discoverCharacteristics(service, ['fff2']);

    const expectedResult = { fff2: tmpCharacteristcs[0] };

    expect(result).deep.eq(expectedResult);
    expect(discovered).is.eq(false);
  });

  it('Discover service characteristics half already discovered', async () => {
    const tmpCharacteristcs = [{ uuid: 'fff2' }];
    service.characteristics = tmpCharacteristcs;

    const result = await discoverCharacteristics(service, ['fff1', 'fff2']);

    const expectedResult = { fff2: tmpCharacteristcs[0], [characteristic.uuid]: characteristic };

    expect(result).deep.eq(expectedResult);
    expect(discovered).is.eq(true);
  });
});
