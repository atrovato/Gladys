import update from 'immutability-helper';
import { RequestStatus } from '../../../../../utils/consts';
import createActionsHouse from '../../../../../actions/house';

const createActions = store => {
  const houseActions = createActionsHouse(store);
  const actions = {
    async getStatus(state) {
      store.setState({
        bluetoothGetDriverStatus: RequestStatus.Getting
      });
      try {
        const bluetoothStatus = await state.httpClient.get('/api/v1/service/bluetooth/status');
        store.setState({
          bluetoothPowered: bluetoothStatus.powered,
          bluetoothScanning: bluetoothStatus.scanning,
          bluetoothGetDriverStatus: RequestStatus.Success
        });
      } catch (e) {
        store.setState({
          bluetoothGetDriverStatus: RequestStatus.Error
        });
      }
    },
    async getPeripherals(state) {
      store.setState({
        bluetoothGetPeripheralsStatus: RequestStatus.Getting
      });
      try {
        const bluetoothPeripherals = await state.httpClient.get('/api/v1/service/bluetooth/discover');
        store.setState({
          bluetoothPeripherals,
          bluetoothGetPeripheralsStatus: RequestStatus.Success
        });
      } catch (e) {
        store.setState({
          bluetoothGetPeripheralsStatus: RequestStatus.Error
        });
      }
    },
    async scan(state) {
      store.setState({
        bluetoothPeripherals: undefined,
        bluetoothScanStatus: RequestStatus.Getting
      });

      try {
        const bluetoothStatus = await state.httpClient.post('/api/v1/service/bluetooth/scan');
        store.setState({
          bluetoothPowered: bluetoothStatus.powered,
          bluetoothScanning: bluetoothStatus.scanning,
          bluetoothScanStatus: RequestStatus.Success
        });
      } catch (e) {
        store.setState({
          bluetoothScanStatus: RequestStatus.Error
        });
      }
    },
    async updateStatus(state, bluetoothStatus) {
      store.setState({
        bluetoothPowered: bluetoothStatus.powered,
        bluetoothScanning: bluetoothStatus.scanning
      });
    },
    async addPeripheral(state, peripheral) {
      const externalId = peripheral.external_id;
      let bluetoothPeripherals = state.bluetoothPeripherals || [];
      const existingIndex = bluetoothPeripherals.findIndex(p => p.external_id === externalId);

      if (existingIndex >= 0) {
        bluetoothPeripherals = update(bluetoothPeripherals, {
          [existingIndex]: {
            $set: peripheral
          }
        });
      } else {
        bluetoothPeripherals = update(bluetoothPeripherals, {
          $push: [peripheral]
        });
      }

      store.setState({
        bluetoothPeripherals
      });
    },
    async resetSaveStatus() {
      store.setState({
        bluetoothSaveStatus: undefined
      });
    },
    async createDevice(state, device) {
      store.setState({
        bluetoothSaveStatus: RequestStatus.Getting
      });

      const { currentIntegration, httpClient } = state;

      device.service_id = currentIntegration.id;
      device.features.forEach(feature => {
        feature.external_id = `${device.external_id}:${feature.type.replace(' ', '_')}`;
        feature.selector = feature.external_id;
      });

      try {
        await httpClient.post(`/api/v1/device`, device);
        store.setState({
          bluetoothSaveStatus: RequestStatus.Success,
          bluetoothCreatedDevice: device
        });
      } catch (e) {
        store.setState({
          bluetoothSaveStatus: RequestStatus.Error
        });
      }
    },
    async getIntegrationByName(state, name) {
      const currentIntegration = await state.httpClient.get(`/api/v1/service/${name}`);
      store.setState({
        currentIntegration
      });
    }
  };
  return Object.assign({}, actions, houseActions);
};

export default createActions;
