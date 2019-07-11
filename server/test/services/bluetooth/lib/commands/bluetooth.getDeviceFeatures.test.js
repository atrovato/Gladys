const { expect } = require('chai');
const sinon = require('sinon');

const { fake } = sinon;
const EventEmitter = require('events');

const event = new EventEmitter();
const BluetoothManager = require('../../../../../services/bluetooth/lib');
const BluetoothMock = require('../../BluetoothMock.test');

const { EVENTS } = require('../../../../../utils/constants');

describe('BluetoothManager getDeviceFeatures command', () => {
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

  it('get device features', () => {
    const result = bluetoothManager.getDeviceFeatures('nut', 'tracker');
    expect(1).eq(result.length);
  });

  it('get device unknow moodel features', () => {
    const result = bluetoothManager.getDeviceFeatures('nut', 'unknow');
    expect(undefined).eq(result);
  });

  it('get unknown device features', () => {
    const result = bluetoothManager.getDeviceFeatures('unknown', 'unknown');
    expect(undefined).eq(result);
  });
});
