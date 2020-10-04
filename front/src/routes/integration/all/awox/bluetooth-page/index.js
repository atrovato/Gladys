import { Component } from 'preact';
import { connect } from 'unistore/preact';

import actions from './actions';
import AwoxPage from '../AwoxPage';
import BluetoothPeripheralTab from './BluetoothPeripheralTab';
import { WEBSOCKET_MESSAGE_TYPES } from '../../../../../../../server/utils/constants';

@connect('user,session,bluetoothPeripheralUuids,bluetoothPeripherals,bluetoothStatus,currentIntegration', actions)
class AwoxBluetoothPage extends Component {
  componentWillMount() {
    this.props.getIntegrationByName('awox');
    this.props.getPeripherals();
    this.props.getStatus();

    this.props.session.dispatcher.addListener(WEBSOCKET_MESSAGE_TYPES.BLUETOOTH.DISCOVER, this.props.addPeripheral);
  }

  componentWillUnmount() {
    this.props.session.dispatcher.removeListener(WEBSOCKET_MESSAGE_TYPES.BLUETOOTH.DISCOVER, this.props.addPeripheral);
  }

  render(props, {}) {
    return (
      <AwoxPage>
        <BluetoothPeripheralTab {...props} />
      </AwoxPage>
    );
  }
}

export default AwoxBluetoothPage;
