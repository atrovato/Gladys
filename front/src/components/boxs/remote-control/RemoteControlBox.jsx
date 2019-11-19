import { Component } from 'preact';
import { connect } from 'unistore/preact';
import get from 'get-value';
import actions from '../../../actions/dashboard/boxes/remoteControl';
import RemoteControlLayout from '../../remote-control/RemoteControlLayout';
import { DASHBOARD_BOX_STATUS_KEY, DASHBOARD_BOX_DATA_KEY, RequestStatus } from '../../../utils/consts';

@connect(
  'DashboardBoxDataRemote,DashboardBoxStatusRemote',
  actions
)
class RemoteControlBoxComponent extends Component {
  componentDidMount() {
    this.props.getRemoteControl(this.props.box, this.props.x, this.props.y);
  }

  render(props) {
    const boxData = get(props, `${DASHBOARD_BOX_DATA_KEY}Remote.${props.x}_${props.y}`);
    const boxStatus = get(props, `${DASHBOARD_BOX_STATUS_KEY}Remote.${props.x}_${props.y}`);
    const error = boxStatus === RequestStatus.Error;
    if (error || !boxData) {
      return null;
    }

    const { remote } = boxData;
    let remoteName;
    let featureByType;
    if (remote) {
      remoteName = remote.name;
      featureByType = {};
      remote.features.map(feature => {
        featureByType[feature.type] = feature;
      });
    }

    return (
      <RemoteControlLayout
        {...props}
        loading={boxStatus === RequestStatus.Getting}
        editionMode={false}
        remoteType={props.box.remoteType}
        onClick={props.setValue}
        remoteName={remoteName}
        featureByType={featureByType}
        dashboard={true}
      />
    );
  }
}

export default RemoteControlBoxComponent;
