import { RequestStatus } from '../../../utils/consts';
import createBoxActions from '../boxActions';

function createActions(store) {
  const boxActions = createBoxActions(store);

  const actions = {
    async getDevices(state, remoteType) {
      store.setState({
        DashboardRemoteControlStatus: RequestStatus.Getting
      });
      try {
        const remoteDevices = await state.httpClient.get(`/api/v1/device/category/${remoteType}`);
        store.setState({
          remoteDevices,
          DashboardRemoteControlStatus: RequestStatus.Success
        });
      } catch (e) {
        store.setState({
          DashboardRemoteControlStatus: RequestStatus.Error
        });
      }
    },
    async getRemoteControl(state, box, x, y) {
      store.setState({
        DashboardRemoteControlStatus: RequestStatus.Getting
      });

      try {
        const remote = await state.httpClient.get(`/api/v1/device/${box.remote}`);
        store.setState({
          remote,
          DashboardRemoteControlStatus: RequestStatus.Success
        });
      } catch (e) {
        store.setState({
          DashboardRemoteControlStatus: RequestStatus.Error
        });
      }
    }
  };
  return Object.assign({}, actions, boxActions);
}

export default createActions;
