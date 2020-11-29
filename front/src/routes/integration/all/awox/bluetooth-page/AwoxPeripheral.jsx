import { Text } from 'preact-i18n';
import { Component } from 'preact';
import { Link } from 'preact-router';
import { connect } from 'unistore/preact';

import { PARAMS } from '../../../../../../../server/services/bluetooth/lib/utils/bluetooth.constants';
import actions from '../../bluetooth/setup-page/actions';
import BluetoothPeripheralFeatures from '../../bluetooth/setup-page/BluetoothPeripheralFeatures';

@connect('', actions)
class AwoxPeripheral extends Component {
  scan = () => {
    this.props.scan(this.props.peripheral.selector);
  };

  render({ peripheral, bluetoothStatus, currentIntegration }) {
    const params = peripheral.params || [];
    const manufacturerParam = params.find(p => p.name === PARAMS.MANUFACTURER);
    const manufacturerValue = (manufacturerParam || { value: '' }).value;
    const awoxDevice = manufacturerValue.toLowerCase() === 'awox' || peripheral.service_id === currentIntegration.id;
    const unknownDevice = manufacturerValue === '' || !peripheral.service_id;

    return (
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">{peripheral.name}</h3>
          </div>
          <div class="card-body">
            <div class="form-group">
              <label class="form-label">
                <Text id="integration.awox.device.externalIdLabel" />
              </label>
              <input type="text" class="form-control" disabled value={peripheral.external_id} />
            </div>
            <div class="form-group">
              <label class="form-label">
                <Text id="integration.awox.device.manufacturerLabel" />
              </label>
              <input type="text" class="form-control" disabled value={manufacturerValue} />
            </div>
            <div class="form-group">
              <label class="form-label">
                <Text id="integration.awox.device.modelLabel" />
              </label>
              <input type="text" class="form-control" disabled value={peripheral.model} />
            </div>
            <BluetoothPeripheralFeatures
              peripheral={peripheral}
              bluetoothStatus={bluetoothStatus}
              scan={this.scan}
              bluetoothDevice={unknownDevice}
            />
            <div class="form-group">
              {awoxDevice && (
                <Link href={`/dashboard/integration/device/awox/bluetooth/${peripheral.selector}`}>
                  {!peripheral.id && (
                    <button class="btn btn-success">
                      <Text id="integration.awox.setup.createDeviceInGladys" />
                    </button>
                  )}
                  {peripheral.id && (
                    <button class="btn btn-primary">
                      <Text id="integration.awox.setup.updateDeviceInGladys" />
                    </button>
                  )}
                </Link>
              )}
              {!awoxDevice && (
                <button class="btn btn-outline-secondary" disabled>
                  <Text id="integration.awox.setup.notAwoxDevice" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AwoxPeripheral;
