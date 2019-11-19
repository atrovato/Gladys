import { Component } from 'preact';
import { connect } from 'unistore/preact';
import actions from './actions';
import BroadlinkPage from '../BroadlinkPage';
import integrationConfig from '../../../../../config/integrations';
import PeripheralTab from './PeripheralTab';

@connect('session,user,broadlinkPeripherals,getBroadlinkPeripheralsStatus', actions)
class BroadlinkDevicePage extends Component {
  componentWillMount() {
    this.props.getBroadlinkPeripherals();
  }

  render(props, {}) {
    return (
      <BroadlinkPage integration={integrationConfig[props.user.language].broadlink}>
        <PeripheralTab {...props} />
      </BroadlinkPage>
    );
  }
}

export default BroadlinkDevicePage;
