import { Component } from 'preact';
import { connect } from 'unistore/preact';
import actions from '../actions';
import BroadlinkPage from '../../BroadlinkPage';
import integrationConfig from '../../../../../../config/integrations';
import uuid from 'uuid';
import update from 'immutability-helper';
import RemoteSetupTab from './RemoteSetupTab';

@connect(
  'session,user,httpClient,currentIntegration,houses',
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

  constructor(props) {
    super(props);

    this.state = {
      loading: true
    };

    this.updateDeviceProperty = this.updateDeviceProperty.bind(this);
  }

  async componentWillMount() {
    await this.props.getHouses();
    await this.props.getIntegrationByName('broadlink');

    let { deviceSelector } = this.props;
    let device;

    if (!deviceSelector) {
      const uniqueId = uuid.v4();
      device = {
        id: uniqueId,
        name: null,
        should_poll: false,
        external_id: uniqueId,
        service_id: this.props.currentIntegration.id,
        features: []
      };
    } else {
      const loadedDevice = await this.props.httpClient.get(`/api/v1/device/${deviceSelector}`);

      if (
        loadedDevice &&
        this.props.currentIntegration &&
        loadedDevice.service_id === this.props.currentIntegration.id
      ) {
        device = loadedDevice;
      }
    }

    this.setState({
      device,
      loading: false
    });
  }

  render(props, state) {
    return (
      <BroadlinkPage integration={integrationConfig[props.user.language].broadlink}>
        <RemoteSetupTab {...props} {...state} updateDeviceProperty={this.updateDeviceProperty} />
      </BroadlinkPage>
    );
  }
}

export default BroadlinkDeviceSetupPage;
