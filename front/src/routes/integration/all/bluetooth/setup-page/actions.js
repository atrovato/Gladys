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
          ...bluetoothStatus,
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
        const bluetoothPeripherals = await state.httpClient.get('/api/v1/service/bluetooth/peripheral');
        const bluetoothPeripheralUuids = Object.keys(bluetoothPeripherals);
        store.setState({
          bluetoothPeripherals,
          bluetoothPeripheralUuids,
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
        bluetoothScanStatus: RequestStatus.Getting
      });

      let action;
      if (state.bluetoothStatus === 'scanning') {
        action = 'off';
      } else {
        action = 'on';
      }

      try {
        const bluetoothStatus = await state.httpClient.post('/api/v1/service/bluetooth/scan', {
          scan: action
        });
        store.setState({
          ...bluetoothStatus,
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
        ...bluetoothStatus
      });
    },
    async addPeripheral(state, peripheral) {
      let bluetoothPeripherals = {};
      Object.assign(bluetoothPeripherals, state.bluetoothPeripherals);
      const bluetoothPeripheralUuids = (state.bluetoothPeripheralUuids || []).slice();
      const uuid = peripheral.uuid;

      const foundPeripheral = bluetoothPeripherals[uuid];
      if (!foundPeripheral) {
        bluetoothPeripheralUuids.push(uuid);
      }

      bluetoothPeripherals[uuid] = peripheral;
      store.setState({
        bluetoothPeripherals,
        bluetoothPeripheralUuids
      });
    },
    async loadBrands(state) {
      store.setState({
        bluetoothBrandStatut: RequestStatus.Getting
      });

      try {
        const bluetoothBrands = await state.httpClient.get('/api/v1/service/bluetooth/brand');
        store.setState({
          bluetoothBrandStatut: RequestStatus.Success,
          bluetoothBrands
        });
      } catch (e) {
        store.setState({
          bluetoothBrandStatut: RequestStatus.Error
        });
      }
    },
    async saveDevice(state, device) {
      store.setState({
        bluetoothSaveStatus: RequestStatus.Getting
      });

      device.service_id = state.currentIntegration.id;
      device.external_id = `bluetooth:${device.uuid}:${device.brand}:${device.model}`;
      device.features.forEach(feature => {
        feature.name = `${device.name} ${feature.type}`;
        feature.external_id = `${device.external_id}:${feature.type.replace(' ', '_')}`;
        feature.selector = feature.external_id;
      });

      try {
        await state.httpClient.post(`/api/v1/device`, device);
        store.setState({
          bluetoothSaveStatus: RequestStatus.Success
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
