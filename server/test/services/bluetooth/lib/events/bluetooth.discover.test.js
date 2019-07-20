const { expect } = require('chai');
const sinon = require('sinon');

const { assert, fake } = sinon;
const EventEmitter = require('events');

const event = new EventEmitter();
const BluetoothManager = require('../../../../../services/bluetooth/lib');
const BluetoothMock = require('../../BluetoothMock.test');

const { EVENTS } = require('../../../../../utils/constants');

describe('BluetoothManager discover event', () => {
  let bluetooth;
  let bluetoothManager;
  let eventWS;
  let clock;
  let now;

  beforeEach(() => {
    bluetooth = new BluetoothMock();

    const gladys = {
      event,
    };
    bluetoothManager = new BluetoothManager(bluetooth, gladys, 'de051f90-f34a-4fd5-be2e-e502339ec9bc');

    sinon.reset();

    eventWS = fake.returns(null);
    event.on(EVENTS.WEBSOCKET.SEND_ALL, eventWS);

    now = new Date();
    clock = sinon.useFakeTimers(now.getTime());
  });

  afterEach(() => {
    bluetooth.removeAllListeners();
    clock.restore();
    event.removeAllListeners();
  });

  it('should add discovered peripheral', () => {
    const newPeripheral = {
      uuid: 'UUID',
      address: 'ADDRESS',
      rssi: 'RSSI',
      advertisement: {
        localName: 'NAME',
      },
      state: 'state',
    };

    bluetoothManager.discover(newPeripheral);

    const expectedPeripheral = { ...newPeripheral, lastSeen: now };
    const expectedWSPeripheral = {
      name: 'NAME',
      uuid: 'UUID',
      address: 'ADDRESS',
      rssi: 'RSSI',
      lastSeen: now,
      state: 'state',
      connectable: undefined,
    };
    expect({ UUID: expectedPeripheral }).deep.eq(bluetoothManager.peripherals);

    assert.calledWith(eventWS, { payload: expectedWSPeripheral, type: 'bluetooth.discover' });
  });

  it('should add discovered connected peripheral', () => {
    const newPeripheral = {
      uuid: 'UUID',
      address: 'ADDRESS',
      rssi: 'RSSI',
      advertisement: {
        localName: 'NAME',
      },
      state: 'connected',
      connectable: true,
    };

    bluetoothManager.discover(newPeripheral);

    const expectedPeripheral = { ...newPeripheral, lastSeen: now };
    const expectedWSPeripheral = {
      name: 'NAME',
      uuid: 'UUID',
      address: 'ADDRESS',
      rssi: 'RSSI',
      lastSeen: now,
      state: 'connected',
      connectable: true,
    };
    expect({ UUID: expectedPeripheral }).deep.eq(bluetoothManager.peripherals);

    assert.calledWith(eventWS, { payload: expectedWSPeripheral, type: 'bluetooth.discover' });
  });
});
