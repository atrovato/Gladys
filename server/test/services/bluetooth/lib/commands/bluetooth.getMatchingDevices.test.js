const { expect } = require('chai');
const sinon = require('sinon');

const { fake } = sinon;
const EventEmitter = require('events');

const event = new EventEmitter();
const BluetoothManager = require('../../../../../services/bluetooth/lib');
const BluetoothMock = require('../../BluetoothMock.test');

const { EVENTS } = require('../../../../../utils/constants');

describe('BluetoothManager getMatchingDevices command', () => {
  let bluetooth;
  let bluetoothManager;
  let eventWS;

  beforeEach(() => {
    bluetooth = new BluetoothMock();

    const gladys = {
      event,
    };
    bluetoothManager = new BluetoothManager(bluetooth, gladys, 'de051f90-f34a-4fd5-be2e-e502339ec9bc');

    sinon.reset();

    eventWS = fake.returns(null);
    event.on(EVENTS.WEBSOCKET.SEND_ALL, eventWS);
  });

  afterEach(() => {
    bluetooth.removeAllListeners();
    event.removeAllListeners();
  });

  it('get not existing matching device', () => {
    const charMap = { none: 'none' };
    const result = bluetoothManager.getMatchingDevices(charMap);
    expect([]).deep.eq(result);
  });

  it('get single matching device', () => {
    const charMap = { '2a00': 'nut' };
    const result = bluetoothManager.getMatchingDevices(charMap);
    expect([{ brand: 'nut', model: 'tracker' }]).deep.eq(result);
  });
});
