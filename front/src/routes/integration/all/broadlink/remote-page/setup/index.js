import { Component } from 'preact';
import { connect } from 'unistore/preact';
import actions from '../actions';
import BroadlinkPage from '../../BroadlinkPage';
import integrationConfig from '../../../../../../config/integrations';
import uuid from 'uuid';
import update from 'immutability-helper';
import RemoteSetupTab from './RemoteSetupTab';
import { DEVICE_FEATURE_CATEGORIES, DEVICE_FEATURE_TYPES } from '../../../../../../../../server/utils/constants';
import { route } from 'preact-router';

@connect(
  'session,user,httpClient,currentIntegration,houses,broadlinkPeripherals',
  actions
)
class BroadlinkDeviceSetupPage extends Component {
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

  updateDeviceModelProperty(model) {
    this.updateDeviceProperty('model', model.name);
    this.setState({
      selectedModel: model
    });
  }

  updateButtonCreationProperty(property, value) {
    const buttonCreation = update(this.state.buttonCreation, {
      [property]: {
        $set: value
      }
    });

    this.setState({
      buttonCreation
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

  createPendingButton() {
    const { buttonCreation } = this.state;
    buttonCreation.id = uuid.v4();
    buttonCreation.type = 'REMOTE_BUTTON';

    const buttons = update(this.state.buttons, {
      $push: [buttonCreation]
    });

    this.setState({
      buttonCreation: {},
      buttons
    });
  }

  async saveDevice() {
    this.setState({
      loading: true
    });

    const device = { ...this.state.device };
    device.features = this.state.buttons
      .filter(button => button.position)
      .map(button => {
        const { id, name, code, icon, position } = button;
        const externalId = `${device.external_id}:${icon}:${position.x}:${position.y}`;

        return {
          id,
          name,
          external_id: externalId,
          selector: externalId,
          category: DEVICE_FEATURE_CATEGORIES.REMOTE,
          type: DEVICE_FEATURE_TYPES.REMOTE.BUTTON,
          read_only: true,
          keep_history: false,
          has_feedback: false,
          min: 0,
          max: 0,
          last_value_string: code
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
      console.log(e);
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      buttons: [],
      buttonCreation: {}
    };

    this.updateDeviceProperty = this.updateDeviceProperty.bind(this);
    this.updateDeviceModelProperty = this.updateDeviceModelProperty.bind(this);
    this.updateButtonCreationProperty = this.updateButtonCreationProperty.bind(this);
    this.createPendingButton = this.createPendingButton.bind(this);
    this.updateButton = this.updateButton.bind(this);
    this.deleteButton = this.deleteButton.bind(this);
    this.saveDevice = this.saveDevice.bind(this);
    this.testButton = this.testButton.bind(this);
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
      device,
      loading: false,
      buttonCreation: {},
      buttons,
      selectedModel
    });
  }

  render(props, state) {
    return (
      <BroadlinkPage integration={integrationConfig[props.user.language].broadlink}>
        <RemoteSetupTab
          {...props}
          {...state}
          updateDeviceProperty={this.updateDeviceProperty}
          updateDeviceModelProperty={this.updateDeviceModelProperty}
          updateButtonCreationProperty={this.updateButtonCreationProperty}
          createPendingButton={this.createPendingButton}
          updateButton={this.updateButton}
          deleteButton={this.deleteButton}
          saveDevice={this.saveDevice}
          testButton={this.testButton}
        />
      </BroadlinkPage>
    );
  }
}

export default BroadlinkDeviceSetupPage;
