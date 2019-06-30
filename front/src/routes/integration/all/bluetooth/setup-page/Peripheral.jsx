import { Text } from 'preact-i18n';
import { Component } from 'preact';
import cx from 'classnames';

import { RequestStatus } from '../../../../../utils/consts';

class BluetoothNode extends Component {
  createDevice = async () => {
    this.setState({ loading: true });
    try {
      await this.props.createDevice(this.props.node);
      this.setState({ deviceCreated: true });
    } catch (e) {
      this.setState({ error: RequestStatus.Error });
    }
    this.setState({ loading: false });
  };

  render(props, { loading, error, deviceCreated }) {
    return (
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">{props.peripheral.name || props.peripheral.uuid}</h3>
          </div>
          <div
            class={cx('dimmer', {
              active: loading
            })}
          >
            <div class="loader" />
            <div class="dimmer-content">
              {error && (
                <div class="alert alert-danger">
                  <Text id="integration.bluetooth.setup.createDeviceError" />
                </div>
              )}
              {deviceCreated && (
                <div class="alert alert-success">
                  <Text id="integration.bluetooth.setup.deviceCreatedSuccess" />
                </div>
              )}
              <div class="card-body">
                <div class="form-group">
                  <label>
                    <Text id="integration.bluetooth.setup.rssiLabel" />
                  </label>
                  <input type="text" class="form-control" disabled value={props.peripheral.rssi} />
                </div>
                <div class="form-group">
                  <label>
                    <Text id="integration.bluetooth.setup.addressLabel" />
                  </label>
                  <input type="text" class="form-control" disabled value={props.peripheral.address} />
                </div>
                <div class="form-group">
                  <label>
                    <Text id="integration.bluetooth.setup.lastSeenLabel" />
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    disabled
                    value={new Date(props.peripheral.lastSeen).toLocaleTimeString()}
                  />
                </div>
                <div class="form-group">
                  <button class="btn btn-success">
                    <Text id="integration.bluetooth.setup.createDeviceInGladys" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default BluetoothNode;
