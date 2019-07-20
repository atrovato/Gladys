const { expect } = require('chai');
const sinon = require('sinon');

const { assert, fake } = sinon;
const EventEmitter = require('events');

const event = new EventEmitter();
const BluetoothManager = require('../../../../../services/bluetooth/lib');

const { EVENTS } = require('../../../../../utils/constants');

describe('BluetoothManager getPeripherals command', () => {
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

  it('should get no peripherals', () => {
    const result = bluetoothManager.getPeripherals();
    expect(result).deep.eq({});
    assert.notCalled(eventWS);
  });

  it('should get retrieved peripherals', () => {
    bluetoothManager.peripherals.P1 = {
      uuid: 'P1',
      address: 'A1',
      rssi: 'R1',
      advertisement: {
        localName: 'P1',
      },
      lastSeen: 'D1',
    };
    bluetoothManager.peripherals.P2 = {
      uuid: 'P2',
      address: 'A2',
      rssi: 'R2',
      advertisement: {
        localName: 'P2',
      },
      lastSeen: 'D2',
    };
    bluetoothManager.peripherals.P3 = {
      uuid: 'P3',
      address: 'A3',
      rssi: 'R3',
      advertisement: {
        localName: 'P3',
      },
      lastSeen: 'D3',
    };

    const result = bluetoothManager.getPeripherals();
    expect(result).deep.eq({
      P1: {
        name: 'P1',
        uuid: 'P1',
        address: 'A1',
        rssi: 'R1',
        lastSeen: 'D1',
        state: undefined,
        connectable: undefined,
      },
      P2: {
        name: 'P2',
        uuid: 'P2',
        address: 'A2',
        rssi: 'R2',
        lastSeen: 'D2',
        state: undefined,
        connectable: undefined,
      },
      P3: {
        name: 'P3',
        uuid: 'P3',
        address: 'A3',
        rssi: 'R3',
        lastSeen: 'D3',
        state: undefined,
        connectable: undefined,
      },
    });
    assert.notCalled(eventWS);
  });
});
