const sinon = require('sinon');

const { assert, fake } = sinon;
const EventEmitter = require('events');

const event = new EventEmitter();
const BluetoothManager = require('../../../../../services/bluetooth/lib');
const BluetoothMock = require('../../BluetoothMock.test');

const { EVENTS } = require('../../../../../utils/constants');

describe('BluetoothManager scan command', () => {
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

  it('should not scan, ready but no args', () => {
    bluetoothManager.ready = true;
    bluetoothManager.scan();
    assert.calledOnce(bluetooth.stopScanning);
    eventWS.calledWith({ payload: { bluetoothStatus: 'ready' }, type: 'bluetooth.status' });
  });

  it('should not scan, not ready no args', () => {
    bluetoothManager.ready = false;
    bluetoothManager.scan();
    assert.calledOnce(bluetooth.stopScanning);
    eventWS.calledWith({ payload: { bluetoothStatus: 'poweredOff' }, type: 'bluetooth.status' });
  });

  it('should not scan, ready no scan', () => {
    bluetoothManager.ready = true;
    bluetoothManager.scan(false);
    assert.calledOnce(bluetooth.stopScanning);
    eventWS.calledWith({ payload: { bluetoothStatus: 'ready' }, type: 'bluetooth.status' });
  });

  it('should scan', () => {
    bluetoothManager.ready = true;
    bluetoothManager.scan(true);
    assert.calledOnce(bluetooth.startScanning);
    eventWS.calledWith({ payload: { bluetoothStatus: 'ready' }, type: 'bluetooth.status' });
  });
});
