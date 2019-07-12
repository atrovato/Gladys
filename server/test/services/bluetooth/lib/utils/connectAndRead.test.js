const sinon = require('sinon');

const { assert, fake } = sinon;

const { connectAndRead } = require('../../../../../services/bluetooth/lib/utils/connectAndRead');

describe('Bluetooth connectAndRead', () => {
  beforeEach(() => {
    sinon.reset();
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
    const callback = fake.returns(null);

    connectAndRead(peripheral, {}, callback);

    callback.calledWith('error', undefined);
    assert.notCalled(peripheral.removeAllListeners);
    assert.notCalled(peripheral.disconnect);
  });

  it('connectAndRead errorneous on discover services', () => {
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

    const callback = fake.returns(null);

    connectAndRead(peripheral, {}, callback);

    callback.calledWith('error', undefined);
    assert.notCalled(peripheral.removeAllListeners);
    assert.notCalled(peripheral.disconnect);
  });

  it('connectAndRead errorneous on discover characteristics', () => {
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

    const callback = fake.returns(null);

    connectAndRead(peripheral, {}, callback);

    callback.calledWith('error', undefined);
    assert.notCalled(peripheral.removeAllListeners);
    assert.notCalled(peripheral.disconnect);
  });

  it('connectAndRead success', () => {
    const resultMap = { '2a00': 'nut' };

    const characteristic2a00 = {
      uuid: '2a00',
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

    connectAndRead(peripheral, {}, callback);

    callback.calledWith(undefined, resultMap);
    assert.notCalled(peripheral.removeAllListeners);
    assert.notCalled(peripheral.disconnect);
  });
});
