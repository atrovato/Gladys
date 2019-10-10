import { RequestStatus } from '../../../../../utils/consts';
import update from 'immutability-helper';
import uuid from 'uuid';
import createActionsHouse from '../../../../../actions/house';
import createActionsIntegration from '../../../../../actions/integration';
import debounce from 'debounce';

function createActions(store) {
  const houseActions = createActionsHouse(store);
  const integrationActions = createActionsIntegration(store);
  const actions = {
    async getBroadlinkDevices(state, take, skip) {
      store.setState({
        getBroadlinkDevicesStatus: RequestStatus.Getting
      });
      try {
        const options = {
          service: 'broadlink',
          order_dir: state.getBroadlinkDeviceOrderDir || 'asc',
          take,
          skip
        };
        if (state.broadlinkDeviceSearch && state.broadlinkDeviceSearch.length) {
          options.search = state.broadlinkDeviceSearch;
        }
        const broadlinkDevicesReceived = await state.httpClient.get('/api/v1/service/broadlink/device', options);
        let broadlinkDevices;
        if (skip === 0) {
          broadlinkDevices = broadlinkDevicesReceived;
        } else {
          broadlinkDevices = update(state.broadlinkDevices, {
            $push: broadlinkDevicesReceived
          });
        }
        store.setState({
          broadlinkDevices,
          getBroadlinkDevicesStatus: RequestStatus.Success
        });
      } catch (e) {
        store.setState({
          broadlinkDevices: [],
          getBroadlinkDevicesStatus: RequestStatus.Error
        });
      }
    },
    async saveDevice(state, device, index) {
      const savedDevice = await state.httpClient.post('/api/v1/device', device);
      const newState = update(state, {
        broadlinkDevices: {
          $splice: [[index, 1, savedDevice]]
        }
      });
      store.setState(newState);
    },
    updateDeviceProperty(state, index, property, value) {
      const newState = update(state, {
        broadlinkDevices: {
          [index]: {
            [property]: {
              $set: value
            }
          }
        }
      });
      store.setState(newState);
    },
    async deleteDevice(state, device, index) {
      await state.httpClient.delete('/api/v1/device/' + device.selector);
      const newState = update(state, {
        broadlinkDevices: {
          $splice: [[index, 1]]
        }
      });
      store.setState(newState);
    },
    async search(state, e) {
      store.setState({
        broadlinkDeviceSearch: e.target.value
      });
      await actions.getBroadlinkDevices(store.getState(), 20, 0);
    },
    async changeOrderDir(state, e) {
      store.setState({
        getBroadlinkDeviceOrderDir: e.target.value
      });
      await actions.getBroadlinkDevices(store.getState(), 20, 0);
    },
    addDeviceFeature(state, index, category, type) {
      const uniqueId = uuid.v4();
      const broadlinkDevices = update(state.broadlinkDevices, {
        [index]: {
          features: {
            $push: [
              {
                id: uniqueId,
                category,
                type,
                read_only: false,
                has_feedback: false
              }
            ]
          }
        }
      });

      store.setState({
        broadlinkDevices
      });
    },
    updateFeatureProperty(state, deviceIndex, featureIndex, property, value) {
      const broadlinkDevices = update(state.broadlinkDevices, {
        [deviceIndex]: {
          features: {
            [featureIndex]: {
              [property]: {
                $set: value
              }
            }
          }
        }
      });

      store.setState({
        broadlinkDevices
      });
    },
    deleteFeature(state, deviceIndex, featureIndex) {
      const broadlinkDevices = update(state.broadlinkDevices, {
        [deviceIndex]: {
          features: {
            $splice: [[featureIndex, 1]]
          }
        }
      });

      store.setState({
        broadlinkDevices
      });
    }
  };
  actions.debouncedSearch = debounce(actions.search, 200);
  return Object.assign({}, houseActions, integrationActions, actions);
}

export default createActions;
