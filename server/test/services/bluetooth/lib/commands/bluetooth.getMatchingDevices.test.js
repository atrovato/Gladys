const { expect } = require('chai');
const sinon = require('sinon');

const { fake } = sinon;
const EventEmitter = require('events');

const event = new EventEmitter();
const BluetoothManager = require('../../../../../services/bluetooth/lib');

const GenericDevice = require('../../../../../services/bluetooth/devices');

const { EVENTS } = require('../../../../../utils/constants');

describe('BluetoothManager getMatchingDevices command', () => {
  let bluetoothManager;
  let eventWS;

  beforeEach(() => {
    const gladys = {
      event,
    };
    bluetoothManager = new BluetoothManager({}, gladys, 'de051f90-f34a-4fd5-be2e-e502339ec9bc');

    sinon.reset();

    eventWS = fake.returns(null);
    event.on(EVENTS.WEBSOCKET.SEND_ALL, eventWS);
  });

  afterEach(() => {
    event.removeAllListeners();
  });

  it('get not existing matching device', () => {
    const charMap = { none: 'none' };
    const result = bluetoothManager.getMatchingDevices(charMap);
    expect(result).deep.eq([]);
  });

  it('get single matching device', () => {
    const charMap = { '2a00': 'nut' };
    const result = bluetoothManager.getMatchingDevices(charMap);
    expect(result).deep.eq([{ brand: 'nut', model: 'tracker' }]);
  });

  it('get matching device but missing method', () => {
    bluetoothManager.availableBrands.set('new', new GenericDevice({}));
    const charMap = { '?': '?' };
    const result = bluetoothManager.getMatchingDevices(charMap);
    expect(result).deep.eq([]);
  });
});
