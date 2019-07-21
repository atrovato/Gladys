const sinon = require('sinon');

const { assert, fake } = sinon;
const EventEmitter = require('events');

const BluetoothManager = require('../../../../../services/bluetooth/lib');
const BluetoothError = require('../../../../../services/bluetooth/lib/BluetoothError');

const { EVENTS } = require('../../../../../utils/constants');

describe('BluetoothManager determinePeripheral command', () => {
  let bluetoothManager;
  let eventWS;
  let event;

  beforeEach(() => {
    event = new EventEmitter();
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

  it('determine peripheral errorneous', () => {
    bluetoothManager.readPeripheral = (arg1, arg2, cb) => {
      cb(new BluetoothError('connectFail', 'error'));
    };

    bluetoothManager.determinePeripheral('uuid');

    const expectedMessage = {
      uuid: 'uuid',
      status: 'error',
      code: 'connectFail',
      message: 'error',
      detection: undefined,
    };

    assert.calledWith(eventWS, { payload: expectedMessage, type: 'bluetooth.determine' });
  });

  it('determine peripheral', () => {
    bluetoothManager.readPeripheral = (arg1, arg2, cb) => {
      cb(null, { '2a00': 'nut' });
    };

    bluetoothManager.determinePeripheral('uuid');

    const expectedMessage = {
      uuid: 'uuid',
      status: 'done',
      code: undefined,
      message: undefined,
      detection: { brand: 'nut', model: 'tracker', device: bluetoothManager.getGladysDevice('nut', 'tracker') },
    };

    assert.calledWith(eventWS, { payload: expectedMessage, type: 'bluetooth.determine' });
  });

  it('determine peripheral but undefined value', () => {
    bluetoothManager.readPeripheral = (arg1, arg2, cb) => {
      cb(null, { '2a00': undefined });
    };

    bluetoothManager.determinePeripheral('uuid');

    const expectedMessage = {
      uuid: 'uuid',
      status: 'done',
      code: undefined,
      message: undefined,
      detection: undefined,
    };

    assert.calledWith(eventWS, { payload: expectedMessage, type: 'bluetooth.determine' });
  });
});
