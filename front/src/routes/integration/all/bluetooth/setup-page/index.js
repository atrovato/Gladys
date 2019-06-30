import { Component } from 'preact';
import { connect } from 'unistore/preact';
import actions from './actions';
import BluetoothPage from '../BluetoothPage';
import NodeTab from './PeripheralTab';
import { WEBSOCKET_MESSAGE_TYPES } from '../../../../../../../server/utils/constants';

@connect(
  'user,session,bluetoothPeripheralUuids,bluetoothPeripherals,bluetoothStatus,bluetoothGetDriverStatus',
  actions
)
class BluetoothSetupPage extends Component {
  componentWillMount() {
    this.props.getPeripherals();
    this.props.getStatus();

    this.props.session.dispatcher.addListener(WEBSOCKET_MESSAGE_TYPES.BLUETOOTH.SCAN_COMPLETE, payload => {
      this.props.getStatus();
      this.props.getPeripherals();
    });
  }

  render(props, {}) {
    return (
      <BluetoothPage>
        <NodeTab {...props} />
      </BluetoothPage>
    );
  }
}

export default BluetoothSetupPage;
