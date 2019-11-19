import { Component } from 'preact';
import { connect } from 'unistore/preact';
import actions from './actions';
import BroadlinkPage from '../BroadlinkPage';
import integrationConfig from '../../../../../config/integrations';
import RemoteTab from './RemoteTab';

@connect('session,user,broadlinkDevices,getBroadlinkDevicesStatus,houses', actions)
class BroadlinkRemotePage extends Component {
  componentWillMount() {
    this.props.getBroadlinkRemotes(20, 0);
    this.props.getHouses();
    this.props.getIntegrationByName('broadlink');
  }

  render(props) {
    return (
      <BroadlinkPage integration={integrationConfig[props.user.language].broadlink}>
        <RemoteTab {...props} />
      </BroadlinkPage>
    );
  }
}

export default BroadlinkRemotePage;
