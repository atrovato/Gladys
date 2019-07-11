import { Component } from 'preact';
import { connect } from 'unistore/preact';
import { Text } from 'preact-i18n';
import cx from 'classnames';

import BluetoothPage from '../../BluetoothPage';
import PeripheralNotFound from './PeripheralNotFound';
import ConfigurePeripheral from './ConfigurePeripheral';
import { RequestStatus } from '../../../../../../utils/consts';
import actions from '../actions';

@connect(
  'httpClient,houses',
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
    this.props.getHouses();

    try {
      const peripheral = await this.props.httpClient.get(`/api/v1/service/bluetooth/peripheral/${this.state.uuid}`);

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
    const { props } = this;

    let content;
    switch (status) {
      case RequestStatus.Getting:
        content = <div class="dimmer active"><div class="loader"></div></div>;
        break;
      case RequestStatus.Success:
        content = <ConfigurePeripheral peripheral={peripheral} />;
        break;
      case RequestStatus.Error:
      default:
        content = <PeripheralNotFound uuid={uuid} />;
    }

    return (
      <BluetoothPage {...uuid}>
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">
              <Text id="integration.bluetooth.setup.peripheral.title" />
            </h3>
          </div>
          <div class="card-body">
            <div
              class={cx('dimmer', {
                active:
                  props.bluetoothStatus === 'scanning' || props.bluetoothGetPeripheralsStatus === RequestStatus.Getting
              })}
            >
              <div class="loader" />
              <div class="dimmer-content" />
              {content}
            </div>
          </div>
        </div>
      </BluetoothPage>
    );
  }
}

export default BluetoothConnnectPage;
