const { expect } = require('chai');
const sinon = require('sinon');

const { assert, fake } = sinon;

const { connectAndRead } = require('../../../../../services/bluetooth/lib/utils/connectAndRead');
const BluetoothError = require('../../../../../services/bluetooth/lib/BluetoothError');

describe('Bluetooth connectAndRead', () => {
  let now;
  let clock;

  beforeEach(() => {
    sinon.reset();
    now = new Date();
    clock = sinon.useFakeTimers(now.getTime());
  });

  afterEach(() => {
    clock.restore();
  });

  it('connectAndRead no callback', () => {
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
      connect: fake.returns(null),
    };

    connectAndRead(peripheral, {}, undefined);

    assert.notCalled(peripheral.connect);
    assert.notCalled(peripheral.removeAllListeners);
    assert.notCalled(peripheral.disconnect);
  });

  it('connectAndRead errorneous on connect', () => {
    const callback = fake.returns(null);

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
      connect: (c) => {
        c('error');
      },
    };

    connectAndRead(peripheral, {}, callback);

    const expectedError = new BluetoothError('connectFail', 'error');
    assert.calledOnce(callback);
    expect(callback.lastCall.args).to.be.lengthOf(1);
    expect(callback.lastCall.args[0].code).eq(expectedError.code);
    expect(callback.lastCall.args[0].message).eq(expectedError.message);

    assert.notCalled(peripheral.removeAllListeners);
    assert.notCalled(peripheral.disconnect);
  });

  it('connectAndRead errorneous on discover services', () => {
    const callback = fake.returns(null);

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
      connect: (c) => {
        c();
      },
      discoverServices: (arg1, c) => {
        c('error');
      },
    };

    connectAndRead(peripheral, {}, callback);

    const expectedError = new BluetoothError('discoverServiceError', 'error');
    assert.calledOnce(callback);
    expect(callback.lastCall.args).to.be.lengthOf(1);
    expect(callback.lastCall.args[0].code).eq(expectedError.code);
    expect(callback.lastCall.args[0].message).eq(expectedError.message);

    assert.notCalled(peripheral.removeAllListeners);
    assert.notCalled(peripheral.disconnect);
  });

  it('connectAndRead errorneous on discover characteristics', () => {
    const callback = fake.returns(null);

    const service1800 = {
      uuid: '1800',
      discoverCharacteristics: (arg0, c) => {
        c('error');
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
      connect: (c) => {
        c();
      },
      discoverServices: (arg1, c) => {
        c(null, services);
      },
    };

    connectAndRead(peripheral, { '1800': ['2a00'] }, callback);

    clock.tick(100000);

    assert.calledOnce(callback);
    expect(callback.lastCall.args).to.be.lengthOf(2);
    expect(callback.lastCall.args[0]).eq(null);
    expect(callback.lastCall.args[1]).deep.eq({});

    assert.notCalled(peripheral.removeAllListeners);
    assert.notCalled(peripheral.disconnect);
  });

  it('connectAndRead success', () => {
    const resultMap = { '2a00': 'nut' };

    const characteristic2a00 = {
      uuid: '2a00',
      properties: ['read'],
      read: (callback) => {
        callback(undefined, 'nut');
      },
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

    const callback = fake.returns(null);

    connectAndRead(peripheral, { '1800': ['2a00'] }, callback);

    assert.calledOnce(callback);
    expect(callback.lastCall.args).to.be.lengthOf(2);
    expect(callback.lastCall.args[0]).eq(null);
    expect(callback.lastCall.args[1]).deep.eq(resultMap);

    assert.notCalled(peripheral.removeAllListeners);
    assert.notCalled(peripheral.disconnect);
  });
});
