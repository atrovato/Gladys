const { expect } = require('chai');
const sinon = require('sinon');

const { fake } = sinon;
const EventEmitter = require('events');

const event = new EventEmitter();
const BluetoothManager = require('../../../../../services/bluetooth/lib');
const BluetoothMock = require('../../BluetoothMock.test');

const { EVENTS } = require('../../../../../utils/constants');

describe('BluetoothManager getRequiredServicesAndCharacteristics command', () => {
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

  it('list required services and characteristics', () => {
    const result = bluetoothManager.getRequiredServicesAndCharacteristics();
    const expectedResult = {
      '180a': ['2a29', '2a24'],
      '1800': ['2a00'],
    };

    expect(expectedResult).deep.eq(result);
  });
});
