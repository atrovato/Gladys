import { Component } from 'preact';
import { connect } from 'unistore/preact';
import actions from './actions';
import BroadlinkPage from '../BroadlinkPage';
import integrationConfig from '../../../../../config/integrations';

@connect(
  'session,user,broadlinkRemotes,getBroadlinkRemotesStatus',
  actions
)
class BroadlinkRemotePage extends Component {
  componentWillMount() {
    this.props.getBroadlinkDevices(20, 0);
    this.props.getHouses();
    this.props.getIntegrationByName('broadlink');
  }

  render(props, {}) {
    return <BroadlinkPage integration={integrationConfig[props.user.language].broadlink} />;
  }
}

export default BroadlinkRemotePage;
