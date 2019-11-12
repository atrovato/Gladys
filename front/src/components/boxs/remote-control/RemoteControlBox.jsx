import { Component } from 'preact';
import { connect } from 'unistore/preact';
import actions from '../../../actions/dashboard/edit-boxes/editRemoteControl';
import RemoteControlLayout from '../../remote-control/RemoteControlLayout';
import { RequestStatus } from '../../../utils/consts';

@connect(
  'DashboardRemoteControlStatus,remote',
  actions
)
class RemoteControlBoxComponent extends Component {
  componentDidMount() {
    this.props.getRemoteControl(this.props.box, this.props.x, this.props.y);
  }

  render(props) {
    if (props.DashboardRemoteControlStatus === RequestStatus.Error) {
      return null;
    }

    let remoteName;
    let featureByType;
    if (props.remote) {
      remoteName = props.remote.name;
      featureByType = {};
      props.remote.features.map(feature => {
        featureByType[feature.type] = feature;
      });
      console.log(featureByType);
    }

    return (
      <RemoteControlLayout
        {...props}
        loading={props.DashboardRemoteControlStatus === RequestStatus.Getting}
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
