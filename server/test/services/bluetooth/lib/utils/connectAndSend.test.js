const sinon = require('sinon');

const { assert, fake } = sinon;

const { connectAndSend } = require('../../../../../services/bluetooth/lib/utils/connectAndSend');

describe('Bluetooth connectAndSend', () => {
  beforeEach(() => {
    sinon.reset();
  });

  it('connectAndSend no callback', () => {
    const serviceUuid = undefined;
    const characteristicUuid = undefined;
    const value = [1];
    const callback = undefined;

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

    connectAndSend(peripheral, serviceUuid, characteristicUuid, value, callback);

    assert.notCalled(peripheral.connect);
    assert.notCalled(peripheral.removeAllListeners);
    assert.notCalled(peripheral.disconnect);
  });

  it('connectAndSend no value', () => {
    const serviceUuid = undefined;
    const characteristicUuid = undefined;
    const value = undefined;
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
      connect: fake.returns(null),
    };

    connectAndSend(peripheral, serviceUuid, characteristicUuid, value, callback);

    assert.notCalled(callback);
    assert.notCalled(peripheral.connect);
    assert.notCalled(peripheral.removeAllListeners);
    assert.notCalled(peripheral.disconnect);
  });

  it('connectAndSend errorneous on connect', () => {
    const serviceUuid = undefined;
    const characteristicUuid = undefined;
    const value = [1];
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

    connectAndSend(peripheral, serviceUuid, characteristicUuid, value, callback);

    assert.calledWith(callback, 'error');
    assert.notCalled(peripheral.removeAllListeners);
    assert.notCalled(peripheral.disconnect);
  });

  it('connectAndSend errorneous on discover services', () => {
    const serviceUuid = undefined;
    const characteristicUuid = undefined;
    const value = [1];
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

    connectAndSend(peripheral, serviceUuid, characteristicUuid, value, callback);

    assert.calledWith(callback, 'error');
    assert.notCalled(peripheral.removeAllListeners);
    assert.notCalled(peripheral.disconnect);
  });

  it('connectAndSend errorneous on discover characteristics', () => {
    const serviceUuid = '1800';
    const characteristicUuid = undefined;
    const value = [1];
    const callback = fake.returns(null);

    const service1800 = {
      uuid: '1800',
      discoverCharacteristics: (c) => {
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
        c('error');
      },
    };

    connectAndSend(peripheral, serviceUuid, characteristicUuid, value, callback);

    assert.calledWith(callback, 'error');
    assert.notCalled(peripheral.removeAllListeners);
    assert.notCalled(peripheral.disconnect);
  });

  it('connectAndSend success', () => {
    const serviceUuid = '1800';
    const characteristicUuid = '2a00';
    const value = [1];
    const callback = fake.returns(null);

    const characteristic2a00 = {
      uuid: '2a00',
      properties: ['write'],
      write: (v, withoutResponse, c) => {
        c(undefined, 'nut');
      },
    };

    const characteristics = new Map();
    characteristics.set('2a00', characteristic2a00);

    const service1800 = {
      uuid: '1800',
      discoverCharacteristics: (arg1, c) => {
        c(undefined, characteristics);
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
        c(null, peripheral);
      },
      discoverServices: (arg1, c) => {
        c(null, services);
      },
    };

    connectAndSend(peripheral, serviceUuid, characteristicUuid, value, callback);

    assert.calledWith(callback, 'error', undefined);

    callback.calledWith(undefined, value);
    assert.notCalled(peripheral.removeAllListeners);
    assert.notCalled(peripheral.disconnect);
  });
});
