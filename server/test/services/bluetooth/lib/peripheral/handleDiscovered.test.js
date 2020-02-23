const { expect } = require('chai');
const sinon = require('sinon');

const { assert, fake } = sinon;
const EventEmitter = require('events');

const event = new EventEmitter();
const BluetoothManager = require('../../../../../services/bluetooth/lib');

const { EVENTS } = require('../../../../../utils/constants');

const gladys = {
  event,
};
const serviceUuid = 'de051f90-f34a-4fd5-be2e-e502339ec9bc';

describe('BluetoothManager discover event', () => {
  let bluetoothManager;
  let eventWS;

  beforeEach(() => {
    bluetoothManager = new BluetoothManager(gladys, serviceUuid);

    sinon.reset();

    eventWS = fake.returns(null);
    event.on(EVENTS.WEBSOCKET.SEND_ALL, eventWS);
  });

  afterEach(() => {
    event.removeAllListeners();
  });

  it('should add discovered peripheral', async () => {
    const peripheral = {
      uuid: 'UUID',
    };
    const device = {
      name: 'NAME',
      external_id: 'bluetooth:UUID',
      selector: 'bluetooth-uuid',
      last_value_changed: new Date(),
      features: [],
      params: [
        {
          name: 'connectable',
          value: true,
        },
      ],
    };

    await bluetoothManager.handleDiscovered(peripheral, device);

    expect(bluetoothManager.discoveredDevices).to.deep.eq({ UUID: device });

    assert.calledWith(eventWS, { payload: device, type: 'bluetooth.discover' });
  });
});
