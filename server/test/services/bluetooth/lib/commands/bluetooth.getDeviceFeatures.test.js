const { expect } = require('chai');
const sinon = require('sinon');

const { fake } = sinon;
const EventEmitter = require('events');

const event = new EventEmitter();
const BluetoothManager = require('../../../../../services/bluetooth/lib');
const BluetoothMock = require('../../BluetoothMock.test');

const { EVENTS } = require('../../../../../utils/constants');

describe('BluetoothManager getGladysDevice command', () => {
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
    const result = bluetoothManager.getGladysDevice('nut', 'tracker');
    expect(result.features).to.be.lengthOf(1);
  });

  it('get device unknow moodel features', () => {
    const result = bluetoothManager.getGladysDevice('nut', 'unknow');
    expect(undefined).eq(result);
  });

  it('get unknown device features', () => {
    const result = bluetoothManager.getGladysDevice('unknown', 'unknown');
    expect(undefined).eq(result);
  });
});
