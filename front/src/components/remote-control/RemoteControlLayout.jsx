import { DEVICE_FEATURE_CATEGORIES } from '../../../../server/utils/constants';
import TelevisionRemoteBox from './templates/television/TelevisionRemoteBox';

const RemoteControlLayout = ({ remoteType, remoteName, onClick }) => {
  let remoteComponent;
  switch (remoteType) {
    case DEVICE_FEATURE_CATEGORIES.TELEVISION: {
      remoteComponent = <TelevisionRemoteBox onClick={onClick} />;
      break;
    }
    default: {
      remoteComponent = null;
    }
  }

  if (!remoteComponent) {
    return null;
  }

  return (
    <div class="card">
      <div class="card-header">{remoteName}</div>

      <div class="p-5">{remoteComponent}</div>
    </div>
  );
};

export default RemoteControlLayout;
