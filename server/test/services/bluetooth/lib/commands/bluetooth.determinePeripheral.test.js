const sinon = require('sinon');

const { assert, fake } = sinon;
const EventEmitter = require('events');

const event = new EventEmitter();
const BluetoothManager = require('../../../../../services/bluetooth/lib');
const BluetoothMock = require('../../BluetoothMock.test');

const { EVENTS } = require('../../../../../utils/constants');

describe('BluetoothManager determinePeripheral command', () => {
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

  it('determine peripheral errorneous on connect', () => {
    const peripheral = {
      uuid: 'uuid',
      address: 'A1',
      rssi: 'R1',
      advertisement: {
        localName: 'P1',
      },
      lastSeen: 'D1',
      connectable: true,
      removeAllListeners: fake.returns(null),
      disconnect: fake.returns(null),
      connect: (callback) => {
        callback('error');
      },
    };
    bluetoothManager.peripherals.uuid = peripheral;

    bluetoothManager.determinePeripheral('uuid');

    const expectedMessage = {
      uuid: 'uuid',
      status: 'error',
      code: 'connectFail',
      message: 'error',
      peripheralInfo: undefined,
      matchingDevices: undefined,
    };
    eventWS.calledWith({ payload: expectedMessage, type: 'bluetooth.determine' });
    assert.notCalled(peripheral.removeAllListeners);
    assert.notCalled(peripheral.disconnect);
  });

  it('determine peripheral errorneous on discover services', () => {
    const peripheral = {
      uuid: 'uuid',
      address: 'A1',
      rssi: 'R1',
      advertisement: {
        localName: 'P1',
      },
      lastSeen: 'D1',
      connectable: true,
      removeAllListeners: fake.returns(null),
      disconnect: fake.returns(null),
      connect: (callback) => {
        callback();
      },
      discoverServices: (arg1, callback) => {
        callback('error');
      },
    };
    bluetoothManager.peripherals.uuid = peripheral;

    bluetoothManager.determinePeripheral('uuid');

    const expectedMessage = {
      uuid: 'uuid',
      status: 'error',
      code: 'discoverServiceError',
      message: 'error',
      peripheralInfo: undefined,
      matchingDevices: undefined,
    };
    eventWS.calledWith({ payload: expectedMessage, type: 'bluetooth.determine' });
    assert.notCalled(peripheral.removeAllListeners);
    assert.notCalled(peripheral.disconnect);
  });

  it('determine peripheral errorneous on discover characteristics', () => {
    const service1800 = {
      uuid: '1800',
      discoverCharacteristics: (callback) => {
        callback('error');
      },
    };

    const services = new Map();
    services.set('1800', service1800);

    const peripheral = {
      uuid: 'uuid',
      address: 'A1',
      rssi: 'R1',
      advertisement: {
        localName: 'P1',
      },
      lastSeen: 'D1',
      connectable: true,
      removeAllListeners: fake.returns(null),
      disconnect: fake.returns(null),
      connect: (callback) => {
        callback();
      },
      discoverServices: (arg1, callback) => {
        callback('error');
      },
    };
    bluetoothManager.peripherals.uuid = peripheral;

    bluetoothManager.determinePeripheral('uuid');

    const expectedMessage = {
      uuid: 'uuid',
      status: 'error',
      code: 'discoverCharacteristicError',
      message: 'error',
      peripheralInfo: undefined,
      matchingDevices: undefined,
    };
    eventWS.calledWith({ payload: expectedMessage, type: 'bluetooth.determine' });
    assert.notCalled(peripheral.removeAllListeners);
    assert.notCalled(peripheral.disconnect);
  });

  it('determine peripheral', () => {
    const characteristic2a00 = {
      uuid: '2a00',
      read: (callback) => {
        callback(undefined, 'nut');
      },
      properties: ['read'],
    };

    const characteristics = new Map();
    characteristics.set('2a00', characteristic2a00);

    const service1800 = {
      uuid: '1800',
      discoverCharacteristics: (arg1, callback) => {
        callback(undefined, characteristics);
      },
    };

    const services = new Map();
    services.set('1800', service1800);

    const peripheral = {
      uuid: 'uuid',
      address: 'A1',
      rssi: 'R1',
      advertisement: {
        localName: 'P1',
      },
      lastSeen: 'D1',
      connectable: true,
      removeAllListeners: fake.returns(null),
      disconnect: fake.returns(null),
      connect: (callback) => {
        callback(null, peripheral);
      },
      discoverServices: (arg1, callback) => {
        callback(null, services);
      },
    };
    bluetoothManager.peripherals.uuid = peripheral;

    bluetoothManager.determinePeripheral('uuid');

    const expectedMessage = {
      uuid: 'uuid',
      status: 'done',
      code: undefined,
      message: undefined,
      device: { brand: 'nut', model: 'tracker' },
    };
    assert.calledWith(eventWS, { payload: expectedMessage, type: 'bluetooth.determine' });
    assert.notCalled(peripheral.removeAllListeners);
    assert.notCalled(peripheral.disconnect);
  });
});
