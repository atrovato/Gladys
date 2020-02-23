import { Component } from 'preact';
import { connect } from 'unistore/preact';
import { Text } from 'preact-i18n';

import BluetoothPage from '../../BluetoothPage';
import PeripheralNotFound from './PeripheralNotFound';
import ConfigurePeripheral from './ConfigurePeripheral';
import { RequestStatus } from '../../../../../../utils/consts';
import actions from '../actions';
import { WEBSOCKET_MESSAGE_TYPES } from '../../../../../../../../server/utils/constants';

@connect(
  'session,httpClient,houses,bluetoothPowered,bluetoothScanning',
  actions
)
class BluetoothConnnectPage extends Component {
  constructor(props) {
    super(props);

    const { matches } = props;

    this.state = {
      uuid: matches.uuid,
      status: RequestStatus.Getting
    };
  }

  async componentWillMount() {
    this.props.getStatus();
    this.props.getHouses();

    this.props.session.dispatcher.addListener(WEBSOCKET_MESSAGE_TYPES.BLUETOOTH.STATE, payload =>
      this.props.updateStatus(payload)
    );

    try {
      const peripheral = await this.props.httpClient.get(`/api/v1/service/bluetooth/discover/${this.state.uuid}`);

      this.setState({
        peripheral,
        status: RequestStatus.Success
      });
    } catch (e) {
      this.setState({
        status: RequestStatus.Error
      });
    }
  }

  render() {
    const { uuid, peripheral, status } = this.state;
    const { bluetoothPowered } = this.props;

    let content;
    if (bluetoothPowered) {
      switch (status) {
        case RequestStatus.Getting:
          content = (
            <div class="dimmer active">
              <div class="loader" />
            </div>
          );
          break;
        case RequestStatus.Success:
          if (peripheral.features) {
            peripheral.features.forEach(feature => {
              feature.name = <Text id={`deviceFeatureCategory.${feature.category}.${feature.type}`} />;
            });
          }
          content = <ConfigurePeripheral peripheral={peripheral} />;
          break;
        case RequestStatus.Error:
        default:
          content = <PeripheralNotFound uuid={uuid} />;
      }
    } else {
      content = (
        <div class="alert alert-warning">
          <Text id="integration.bluetooth.setup.bluetoothNotReadyError" />
        </div>
      );
    }

    return (
      <BluetoothPage {...uuid}>
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">
              <Text id="integration.bluetooth.setup.peripheral.title" />
            </h3>
          </div>
          <div class="card-body">{content}</div>
        </div>
      </BluetoothPage>
    );
  }
}

export default BluetoothConnnectPage;
