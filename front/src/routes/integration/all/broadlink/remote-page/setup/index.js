import { Component } from 'preact';
import { connect } from 'unistore/preact';
import actions from '../actions';
import BroadlinkPage from '../../BroadlinkPage';
import integrationConfig from '../../../../../../config/integrations';
import uuid from 'uuid';
import update from 'immutability-helper';
import RemoteSetupTab from './RemoteSetupTab';
import { route } from 'preact-router';
import ButtonOptions from '../../../../../../components/remote-control/templates';

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

  deleteButton() {
    const { buttons, selectedButton } = this.state;
    delete buttons[selectedButton];

    this.setState({
      buttons,
      selectedButton: undefined
    });
  }

  async saveDevice() {
    this.setState({
      loading: true
    });

    const { device, buttons } = this.state;
    device.params = [];
    device.features = Object.keys(buttons).map(key => {
      const externalId = `${device.external_id}:${key}`;

      device.params.push({
        name: `code_${key}`,
        value: buttons[key]
      });

      return {
        name: key,
        external_id: externalId,
        selector: externalId,
        category: device.model,
        type: key,
        read_only: false,
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

  testSelectedButton() {
    try {
      const { buttons, selectedButton, selectedModel } = this.state;
      this.props.httpClient.post('/api/v1/service/broadlink/send', {
        peripheral: selectedModel.mac,
        code: buttons[selectedButton]
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

  storeButtonCode(code) {
    let { selectedButton, learnAllMode } = this.state;

    const buttons = update(this.state.buttons, {
      [selectedButton]: {
        $set: code
      }
    });

    this.setState({
      buttons
    });

    if (learnAllMode) {
      const toLearn = update(this.state.toLearn, {
        $splice: [[0, 1]]
      });

      learnAllMode = toLearn.length > 0;

      if (learnAllMode) {
        selectedButton = toLearn[0];
      } else {
        selectedButton = undefined;
      }

      this.setState({
        toLearn,
        learnAllMode,
        selectedButton
      });
    }
  }

  learnAll() {
    const buttons = Object.keys(ButtonOptions[this.state.device.model]);
    this.setState({
      learnAllMode: true,
      toLearn: buttons,
      selectedButton: buttons[0]
    });
  }

  quitLearnMode() {
    this.setState({
      learnAllMode: false,
      toLearn: [],
      selectedButton: undefined
    });
  }

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      buttons: {}
    };

    this.updateState = this.updateState.bind(this);
    this.updateDeviceProperty = this.updateDeviceProperty.bind(this);
    this.deleteButton = this.deleteButton.bind(this);
    this.saveDevice = this.saveDevice.bind(this);
    this.testSelectedButton = this.testSelectedButton.bind(this);
    this.selectButton = this.selectButton.bind(this);
    this.storeButtonCode = this.storeButtonCode.bind(this);
    this.learnAll = this.learnAll.bind(this);
    this.quitLearnMode = this.quitLearnMode.bind(this);
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

        // Load select peripheral
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
          {...props}
          {...state}
          updateState={this.updateState}
          updateDeviceProperty={this.updateDeviceProperty}
          updateDeviceModelProperty={this.updateDeviceModelProperty}
          deleteButton={this.deleteButton}
          saveDevice={this.saveDevice}
          testSelectedButton={this.testSelectedButton}
          selectButton={this.selectButton}
          storeButtonCode={this.storeButtonCode}
          learnAll={this.learnAll}
          quitLearnMode={this.quitLearnMode}
        />
      </BroadlinkPage>
    );
  }
}

export default BroadlinkDeviceSetupPage;
