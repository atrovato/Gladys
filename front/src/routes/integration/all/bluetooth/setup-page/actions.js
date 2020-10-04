import update from 'immutability-helper';
import { RequestStatus } from '../../../../../utils/consts';

import createActionsHouse from '../../../../../actions/house';
import createActionsBluetooth from '../commons/actions';

const createActions = store => {
  const houseActions = createActionsHouse(store);
  const bluetoothActions = createActionsBluetooth(store);
  const actions = {
    async getPeripherals(state) {
      store.setState({
        bluetoothGetPeripheralsStatus: RequestStatus.Getting
      });
      try {
        const bluetoothPeripherals = await state.httpClient.get('/api/v1/service/bluetooth/peripheral');
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
    async addPeripheral(state, peripheral) {
      const peripheralKey = peripheral.selector;
      const currentIndex = (state.bluetoothPeripherals || []).findIndex(p => p.selector === peripheralKey);

      let bluetoothPeripherals;
      if (currentIndex >= 0) {
        bluetoothPeripherals = update(state.bluetoothPeripherals, {
          [currentIndex]: { $set: peripheral }
        });
      } else {
        bluetoothPeripherals = update(state.bluetoothPeripherals, {
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

      const { httpClient } = state;

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
  return Object.assign({}, actions, houseActions, bluetoothActions);
};

export default createActions;
