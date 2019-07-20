const { expect } = require('chai');
const sinon = require('sinon');

const { assert, fake } = sinon;
const EventEmitter = require('events');

const event = new EventEmitter();
const BluetoothManager = require('../../../../../services/bluetooth/lib');
const BluetoothMock = require('../../BluetoothMock.test');

const { EVENTS } = require('../../../../../utils/constants');

describe('BluetoothManager stop command', () => {
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

  it('check listeners are well removed', () => {
    bluetoothManager.stop();

    // No more listener
    expect(0).eq(bluetooth.eventNames().length);

    assert.calledOnce(bluetooth.stopScanning);
    assert.notCalled(eventWS);
  });

  it('check all periperhals disconnected', () => {
    const disconnect = fake.returns(null);

    bluetoothManager.peripherals.uuid = {
      disconnect,
    };
    bluetoothManager.stop();

    expect(0).eq(bluetooth.eventNames().length);

    assert.calledOnce(disconnect);
    assert.calledOnce(bluetooth.stopScanning);
    assert.notCalled(eventWS);
  });
});
