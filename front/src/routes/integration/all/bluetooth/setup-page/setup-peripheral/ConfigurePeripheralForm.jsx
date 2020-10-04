import { Component } from 'preact';
import { Text, Localizer } from 'preact-i18n';
import { connect } from 'unistore/preact';
import { Link } from 'preact-router/match';
import cx from 'classnames';
import update from 'immutability-helper';

import actions from '../actions';
import { RequestStatus } from '../../../../../../utils/consts';

import UpdateDeviceFeature from '../../../../../../components/device/UpdateDeviceFeature';
import BluetoothPeripheralFeatures from '../BluetoothPeripheralFeatures';
import { PARAMS } from '../../../../../../../../server/services/bluetooth/lib/utils/bluetooth.constants';

@connect('session,httpClient,houses,currentIntegration', actions)
class ConfigurePeripheralForm extends Component {
  updateName = e => {
    this.setState({
      device: {
        ...this.state.device,
        name: e.target.value
      }
    });
  };

  updateRoom = e => {
    this.setState({
      device: {
        ...this.state.device,
        room_id: e.target.value
      }
    });
  };

  updateFeatureProperty = (featureIndex, property, value) => {
    if (
      property === 'external_id' &&
      this.props.requiredExternalIdBase &&
      !value.startsWith(this.props.requiredExternalIdBase)
    ) {
      if (value.length < this.props.requiredExternalIdBase.length) {
        value = this.props.requiredExternalIdBase;
      } else {
        value = `${this.props.requiredExternalIdBase}${value}`;
      }
    }
    const device = update(this.state.device, {
      features: {
        [featureIndex]: {
          [property]: {
            $set: value
          }
        }
      }
    });

    this.setState({
      device
    });
  };

  createDevice = e => {
    e.preventDefault();

    const { device } = this.state;
    device.service_id = this.props.currentIntegration.id;
    this.props.createDevice(device);
  };

  constructor(props) {
    super(props);

    this.state = {
      device: props.peripheral
    };

    this.createDevice = this.createDevice.bind(this);

    this.updateName = this.updateName.bind(this);
    this.updateRoom = this.updateRoom.bind(this);
  }

  componentWillMount() {
    this.props.getIntegrationByName('bluetooth');
  }

  render({ houses, bluetoothStatus, reloadDevice, currentIntegration = {}, bluetoothSaveStatus }, { device }) {
    const disableForm = bluetoothSaveStatus === RequestStatus.Getting;
    const deviceFeatures = device.features || [];

    const params = device.params || [];
    const manufacturerParam = params.find(p => p.name === PARAMS.MANUFACTURER);
    const manufacturerValue = (manufacturerParam || { value: null }).value;

    const bluetoothDevice = !device.service_id || device.service_id === currentIntegration.id;

    return (
      <form>
        {!bluetoothDevice && (
          <div class="alert alert-warning">
            <Text id="integration.bluetooth.setup.notManagedByBluteooth" fields={{ service: device.service.name }} />
          </div>
        )}

        <div>
          <div>
            <div
              class={cx('form-group', {
                'was-validated': !device.name || device.name.length === 0
              })}
            >
              <label for="name" class="form-label">
                <Text id="integration.bluetooth.device.nameLabel" />
              </label>
              <Localizer>
                <input
                  name="name"
                  value={device.name}
                  onChange={this.updateName}
                  class="form-control"
                  placeholder={<Text id="integration.bluetooth.device.namePlaceholder" />}
                  disabled={disableForm}
                  required
                />
              </Localizer>
            </div>

            <div class="form-group">
              <label class="form-label">
                <Text id="integration.bluetooth.device.externalIdLabel" />
              </label>
              <input value={device.external_id} class="form-control" disabled />
            </div>

            <div class="form-group">
              <label for="room" class="form-label">
                <Text id="integration.bluetooth.device.roomLabel" />
              </label>
              <select name="room" onChange={this.updateRoom} class="form-control" disabled={disableForm}>
                <option value="">
                  <Text id="global.emptySelectOption" />
                </option>
                {houses &&
                  houses.map(house => (
                    <optgroup label={house.name}>
                      {house.rooms.map(room => (
                        <option selected={room.id === device.room_id} value={room.id}>
                          {room.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">
                <Text id="integration.bluetooth.device.manufacturerLabel" />
              </label>
              <input type="text" class="form-control" disabled value={manufacturerValue} />
            </div>

            <div class="form-group">
              <label class="form-label">
                <Text id="integration.bluetooth.device.modelLabel" />
              </label>
              <input type="text" class="form-control" disabled value={device.model} />
            </div>
          </div>

          <BluetoothPeripheralFeatures
            peripheral={device}
            bluetoothStatus={bluetoothStatus}
            scan={reloadDevice}
            bluetoothDevice={bluetoothDevice}
          >
            {deviceFeatures.map((feature, index) => (
              <UpdateDeviceFeature
                feature={feature}
                featureIndex={index}
                updateFeatureProperty={this.updateFeatureProperty}
              />
            ))}
          </BluetoothPeripheralFeatures>

          <div class="row mt-5">
            <div class="col">
              <button
                type="submit"
                class="btn btn-success"
                disabled={disableForm || !device.features || !bluetoothDevice}
                onClick={this.createDevice}
              >
                <Text id="integration.bluetooth.setup.peripheral.createLabel" />
              </button>
            </div>
            <div class="col text-right">
              <Link href="/dashboard/integration/device/bluetooth/setup">
                <button type="button" class="btn btn-danger" disabled={disableForm}>
                  <Text id="integration.bluetooth.setup.peripheral.cancelLabel" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

export default ConfigurePeripheralForm;
