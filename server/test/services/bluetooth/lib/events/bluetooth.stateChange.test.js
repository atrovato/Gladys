const { expect } = require('chai');
const sinon = require('sinon');

const { assert, fake } = sinon;
const EventEmitter = require('events');

const event = new EventEmitter();
const BluetoothManager = require('../../../../../services/bluetooth/lib');
const BluetoothMock = require('../../BluetoothMock.test');

const { EVENTS } = require('../../../../../utils/constants');

describe('BluetoothManager stateChange event', () => {
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
    clock.restore();
    event.removeAllListeners();
  });

  it('should handle state change power on', () => {
    bluetoothManager.stateChange('poweredOn');

    expect(true).eq(bluetoothManager.ready);

    assert.calledWith(eventWS, { payload: { bluetoothStatus: 'ready' }, type: 'bluetooth.status' });
  });

  it('should handle state change power off', () => {
    bluetoothManager.stateChange('anything esle');

    expect(false).eq(bluetoothManager.ready);

    assert.calledWith(eventWS, { payload: { bluetoothStatus: 'poweredOff' }, type: 'bluetooth.status' });
  });

  it('should handle state change power off and remove listeners', () => {
    const peripheral = {
      uuid: 'P1',
      address: 'A1',
      rssi: 'R1',
      advertisement: {
        localName: 'P1',
      },
      lastSeen: 'D1',
      removeAllListeners: fake.returns(null),
    };
    bluetoothManager.peripherals.P1 = peripheral;

    bluetoothManager.stateChange('anything esle');

    expect(false).eq(bluetoothManager.ready);

    assert.calledWith(eventWS, { payload: { bluetoothStatus: 'poweredOff' }, type: 'bluetooth.status' });
    assert.calledOnce(peripheral.removeAllListeners);
  });
});
