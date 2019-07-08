const { expect } = require('chai');
const sinon = require('sinon');

const { assert, fake } = sinon;
const EventEmitter = require('events');

const event = new EventEmitter();
const BluetoothManager = require('../../../../services/bluetooth/lib');
const BluetoothMock = require('../BluetoothMock.test');

const { EVENTS } = require('../../../../utils/constants');

describe('BluetoothManager commands', () => {
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

  it('should start Bluetooth bindings', () => {
    bluetoothManager.start();

    expect(1).eq(bluetooth.listenerCount('stateChange'));
    expect(1).eq(bluetooth.listenerCount('scanStart'));
    expect(1).eq(bluetooth.listenerCount('scanStop'));
    expect(1).eq(bluetooth.listenerCount('discover'));

    // All listeners
    expect(4).eq(bluetooth.eventNames().length);

    assert.notCalled(eventWS);
  });

  it('should stop Bluetooth', () => {
    bluetoothManager.stop();

    // No more listener
    expect(0).eq(bluetooth.eventNames().length);

    assert.calledOnce(bluetooth.stopScanning);
    assert.notCalled(eventWS);
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

  it('list required services and characteristics', () => {
    const result = bluetoothManager.getRequiredServicesAndCharacteristics();
    const expectedResult = {
      '180a': ['2a29', '2a24'],
      '1800': ['2a00'],
    };

    expect(expectedResult).deep.eq(result);
  });

  it('get brands', () => {
    const result = bluetoothManager.getBrands();
    const expectedResult = ['awox', 'nut'];

    expect(expectedResult).to.have.members(Object.keys(result));
  });

  it('get peripheral by uuid', () => {
    bluetoothManager.peripherals.uuid = {
      uuid: 'P1',
      address: 'A1',
      rssi: 'R1',
      advertisement: {
        localName: 'P1',
      },
      lastSeen: 'D1',
    };

    const result = bluetoothManager.getPeripheral('uuid');
    const expectedResult = {
      name: 'P1',
      uuid: 'P1',
      address: 'A1',
      rssi: 'R1',
      lastSeen: 'D1',
      state: undefined,
      connectable: undefined,
    };

    expect(expectedResult).deep.eq(result);
  });

  it('get not existing peripheral by uuid', () => {
    const result = bluetoothManager.getPeripheral('uuid');
    expect(undefined).eq(result);
  });

  it('get not existing matching device', () => {
    const charMap = { none: 'none' };
    const result = bluetoothManager.getMatchingDevices(charMap);
    expect([]).deep.eq(result);
  });

  it('get single matching device', () => {
    const charMap = { '2a00': 'nut' };
    const result = bluetoothManager.getMatchingDevices(charMap);
    expect([{ brand: 'nut', model: 'Smart Tracker' }]).deep.eq(result);
  });

  it('get device features', () => {
    const result = bluetoothManager.getDeviceFeatures('nut', 'Smart Tracker');
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
    assert.calledOnce(peripheral.removeAllListeners);
    assert.calledOnce(peripheral.disconnect);
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
    assert.calledOnce(peripheral.removeAllListeners);
    assert.calledOnce(peripheral.disconnect);
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
    assert.calledOnce(peripheral.removeAllListeners);
    assert.calledOnce(peripheral.disconnect);
  });

  it('determine peripheral', () => {
    const characteristic = {
      uuid: '2a00',
      read: (callback) => {
        callback(undefined, 'nut');
      },
    };
    const service1800 = {
      uuid: '1800',
      discoverCharacteristics: (arg1, callback) => {
        callback(undefined, [characteristic]);
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
      status: 'done',
      code: undefined,
      message: undefined,
      device: { brand: 'nut', model: 'Smart Tracker' },
    };
    eventWS.calledWith({ payload: expectedMessage, type: 'bluetooth.determine' });
  });
});

describe('BluetoothManager events', () => {
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

  it('should handle start scanning', () => {
    bluetoothManager.ready = true;
    bluetoothManager.scanStart();

    expect(true).eq(bluetoothManager.scanning);

    assert.calledWith(eventWS, { payload: { bluetoothStatus: 'scanning' }, type: 'bluetooth.status' });
  });

  it('should handle stop scanning', () => {
    bluetoothManager.ready = true;
    bluetoothManager.scanStop();

    expect(false).eq(bluetoothManager.scanning);

    assert.calledWith(eventWS, { payload: { bluetoothStatus: 'ready' }, type: 'bluetooth.status' });
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
