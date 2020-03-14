import createActionsIntegration from '../../../../../actions/integration';
import { RequestStatus } from '../../../../../utils/consts';

const createActions = store => {
  const integrationActions = createActionsIntegration(store);
  const actions = {
    async loadProps(state) {
      let mqttURL;
      try {
        mqttURL = await state.httpClient.get('/api/v1/service/mqtt/variable/MQTT_URL');
      } finally {
        store.setState({
          mqttURL: (mqttURL || {}).value,
          connected: false
        });
      }
    },
    updateConfigration(state, key, value) {
      const data = {};
      data[key] = value;
      store.setState(data);
    },
    async saveConfiguration(state, credential) {
      event.preventDefault();
      store.setState({
        connectMqttStatus: RequestStatus.Getting,
        mqttConnected: false,
        mqttConnectionError: undefined
      });
      try {
        await state.httpClient.post('/api/v1/service/mqtt/variable/MQTT_URL', {
          value: state.mqttURL
        });

        await state.httpClient.post(`/api/v1/service/mqtt/connect`, { credential });

        store.setState({
          connectMqttStatus: RequestStatus.Success
        });

        setTimeout(() => store.setState({ connectMqttStatus: undefined }), 3000);
      } catch (e) {
        store.setState({
          connectMqttStatus: RequestStatus.Error,
          passwordChanges: false
        });
      }
    },
    displayConnectedMessage(state) {
      // display 3 seconds a message "MQTT connected"
      store.setState({
        mqttConnected: true,
        mqttConnectionError: undefined
      });
      setTimeout(
        () =>
          store.setState({
            mqttConnected: false,
            connectMqttStatus: undefined
          }),
        3000
      );
    },
    displayMqttError(state, error) {
      store.setState({
        mqttConnected: false,
        connectMqttStatus: undefined,
        mqttConnectionError: error
      });
    }
  };
  return Object.assign({}, actions, integrationActions);
};

export default createActions;
