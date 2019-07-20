const { expect } = require('chai');
const sinon = require('sinon');

const { assert, fake } = sinon;
const EventEmitter = require('events');

const event = new EventEmitter();
const BluetoothManager = require('../../../../../services/bluetooth/lib');

const { EVENTS } = require('../../../../../utils/constants');

describe('BluetoothManager getStatus command', () => {
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

  it('should get status not setted', () => {
    const result = bluetoothManager.getStatus();
    expect(result).eq('poweredOff');
    assert.notCalled(eventWS);
  });

  it('should get status ready and scanning', () => {
    bluetoothManager.ready = true;
    bluetoothManager.scanning = true;
    const result = bluetoothManager.getStatus();
    expect(result).eq('scanning');
    assert.notCalled(eventWS);
  });

  it('should get status ready not scanning', () => {
    bluetoothManager.ready = true;
    bluetoothManager.scanning = false;
    const result = bluetoothManager.getStatus();
    expect(result).eq('ready');
    assert.notCalled(eventWS);
  });

  it('should get status not ready not scanning', () => {
    bluetoothManager.ready = false;
    bluetoothManager.scanning = false;
    const result = bluetoothManager.getStatus();
    expect(result).eq('poweredOff');
    assert.notCalled(eventWS);
  });

  it('should get status not ready but scanning', () => {
    bluetoothManager.ready = false;
    bluetoothManager.scanning = true;
    const result = bluetoothManager.getStatus();
    expect(result).eq('poweredOff');
    assert.notCalled(eventWS);
  });
});
