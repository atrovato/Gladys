import { Component } from 'preact';
import { connect } from 'unistore/preact';
import actions from '../actions';
import BroadlinkPage from '../../BroadlinkPage';
import integrationConfig from '../../../../../../config/integrations';
import uuid from 'uuid';
import update from 'immutability-helper';
import RemoteSetupTab from './RemoteSetupTab';
import { route } from 'preact-router';

@connect(
  'session,user,httpClient,currentIntegration,houses,broadlinkPeripherals',
  actions
)
class BroadlinkDeviceSetupPage extends Component {
  updateState(newState) {
    this.setState(newState);
  }

  updateDeviceProperty(property, value) {
    const device = update(this.state.device, {
      [property]: {
        $set: value
      }
    });

    this.setState({
      device
    });
  }

  updateButton(button) {
    const buttonIndex = this.state.buttons.findIndex(b => b.id === button.id);

    const buttons = update(this.state.buttons, {
      [buttonIndex]: {
        $set: button
      }
    });

    this.setState({
      buttons
    });
  }

  deleteButton(button) {
    const buttonIndex = this.state.buttons.findIndex(b => b.id === button.id);

    const buttons = update(this.state.buttons, {
      $splice: [[buttonIndex, 1]]
    });

    this.setState({
      buttons
    });
  }

  async saveDevice() {
    this.setState({
      loading: true
    });

    const { device, remoteType } = this.state;
    device.features = this.state.buttons
      .filter(button => button.code)
      .map(button => {
        const { id, key } = button;
        const externalId = `${device.external_id}:${key}`;

        return {
          id,
          name: key,
          external_id: externalId,
          selector: externalId,
          category: remoteType,
          type: key,
          read_only: true,
          keep_history: false,
          has_feedback: false,
          min: 0,
          max: 0
        };
      });

    try {
      await this.props.httpClient.post('/api/v1/device', device);
      route('/dashboard/integration/device/broadlink');
    } catch (e) {
      this.setState({
        loading: false,
        saveStatus: e
      });
    }
  }

  testButton(button) {
    try {
      this.props.httpClient.post('/api/v1/service/broadlink/send', {
        peripheral: this.state.selectedModel.mac,
        code: button.code
      });
    } catch (e) {
      // Nothing to do
    }
  }

  selectButton(value) {
    this.setState({
      selectedButton: value
    });
  }

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      buttons: []
    };

    this.updateState = this.updateState.bind(this);
    this.updateDeviceProperty = this.updateDeviceProperty.bind(this);
    this.updateButton = this.updateButton.bind(this);
    this.deleteButton = this.deleteButton.bind(this);
    this.saveDevice = this.saveDevice.bind(this);
    this.testButton = this.testButton.bind(this);
    this.selectButton = this.selectButton.bind(this);
  }

  async componentWillMount() {
    await this.props.getHouses();
    await this.props.getIntegrationByName('broadlink');
    await this.props.getBroadlinkPeripherals();

    let { deviceSelector } = this.props;
    let device;
    let buttons = [];
    let selectedModel;

    if (!deviceSelector) {
      const uniqueId = uuid.v4();
      device = {
        id: uniqueId,
        name: null,
        should_poll: false,
        external_id: uniqueId,
        service_id: this.props.currentIntegration.id
      };
      buttons = [];

      if (this.props.broadlinkPeripherals.length === 1) {
        device.model = this.props.broadlinkPeripherals[0].mac;
        selectedModel = this.props.broadlinkPeripherals[0];
      }
    } else {
      const loadedDevice = await this.props.httpClient.get(`/api/v1/device/${deviceSelector}`);

      if (
        loadedDevice &&
        this.props.currentIntegration &&
        loadedDevice.service_id === this.props.currentIntegration.id
      ) {
        device = loadedDevice;

        buttons = device.features.map(feature => {
          const { id, name } = feature;
          const code = feature.last_value_string;
          const externalId = feature.external_id;
          const splittedExternalId = externalId.split(':');

          return {
            id,
            name,
            code,
            icon: splittedExternalId[1],
            position: {
              x: parseInt(splittedExternalId[2], 10),
              y: parseInt(splittedExternalId[3], 10)
            }
          };
        });

        selectedModel = this.props.broadlinkPeripherals.find(p => p.mac === device.model);
      }
    }

    this.setState({
      loading: false,
      device,
      buttons,
      selectedModel
    });
  }

  render(props, state) {
    return (
      <BroadlinkPage integration={integrationConfig[props.user.language].broadlink}>
        <RemoteSetupTab
          {...state}
          updateState={this.updateState}
          updateDeviceProperty={this.updateDeviceProperty}
          updateDeviceModelProperty={this.updateDeviceModelProperty}
          updateButton={this.updateButton}
          deleteButton={this.deleteButton}
          saveDevice={this.saveDevice}
          testButton={this.testButton}
          selectButton={this.selectButton}
        />
      </BroadlinkPage>
    );
  }
}

export default BroadlinkDeviceSetupPage;
