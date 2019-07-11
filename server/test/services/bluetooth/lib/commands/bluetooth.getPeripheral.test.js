const { expect } = require('chai');
const sinon = require('sinon');

const { fake } = sinon;
const EventEmitter = require('events');

const event = new EventEmitter();
const BluetoothManager = require('../../../../../services/bluetooth/lib');
const BluetoothMock = require('../../BluetoothMock.test');

const { EVENTS } = require('../../../../../utils/constants');

describe('BluetoothManager getPeripheral command', () => {
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

  it('get peripheral by uuid', () => {
    bluetoothManager.peripherals.uuid = {
      uuid: 'P1',
      address: 'A1',
      rssi: 'R1',
      advertisement: {
        localName: 'P1',
      },
      lastSeen: 'D1',
    };

    const result = bluetoothManager.getPeripheral('uuid');
    const expectedResult = {
      name: 'P1',
      uuid: 'P1',
      address: 'A1',
      rssi: 'R1',
      lastSeen: 'D1',
      state: undefined,
      connectable: undefined,
    };

    expect(expectedResult).deep.eq(result);
  });

  it('get not existing peripheral by uuid', () => {
    const result = bluetoothManager.getPeripheral('uuid');
    expect(undefined).eq(result);
  });
});
