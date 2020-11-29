import { Component } from 'preact';
import { Text, Localizer } from 'preact-i18n';
import { connect } from 'unistore/preact';
import { Link } from 'preact-router/match';
import cx from 'classnames';
import update from 'immutability-helper';

import actions from '../actions';
import { RequestStatus } from '../../../../../../utils/consts';

import { getModelData } from '../../../../../../../../server/services/awox/lib/utils/awox.devices';
import UpdateDeviceFeature from '../../../../../../components/device/UpdateDeviceFeature';
import BluetoothPeripheralFeatures from '../../../bluetooth/setup-page/BluetoothPeripheralFeatures';
import { PARAMS } from '../../../../../../../../server/services/bluetooth/lib/utils/bluetooth.constants';
import { PARAMS as AWOX_PARAMS } from '../../../../../../../../server/services/awox/lib/mesh/awox.mesh.constants';
import { DEVICE_FEATURE_CATEGORIES, DEVICE_FEATURE_TYPES } from '../../../../../../../../server/utils/constants';

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

  updateDeviceParam = (name, value) => {
    const paramIndex = this.state.device.params.findIndex(p => p.name === name);
    if (paramIndex >= 0) {
      const device = update(this.state.device, {
        params: {
          [paramIndex]: {
            value: {
              $set: value
            }
          }
        }
      });

      this.setState({
        device
      });
    }
  };

  updateRemote = e => {
    const remote = this.state.remotes.find(r => r.external_id === e.target.value);

    let remoteUser, remotePass;
    if (remote) {
      const { params } = remote;
      remoteUser = params.find(p => p.name === AWOX_PARAMS.MESH_USER).value;
      remotePass = params.find(p => p.name === AWOX_PARAMS.MESH_PASSWORD).value;
    }

    this.updateDeviceParam(AWOX_PARAMS.MESH_USER, remoteUser);
    this.updateDeviceParam(AWOX_PARAMS.MESH_REMOTE, remoteUser);
    this.updateDeviceParam(AWOX_PARAMS.MESH_PASSWORD, remotePass);
    this.setState({ selectedRemote: !!remote });
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

  testDevice = async (e, value) => {
    e.preventDefault();

    const { device } = this.state;
    const feature = device.features.find(
      f => f.category === DEVICE_FEATURE_CATEGORIES.LIGHT && f.type === DEVICE_FEATURE_TYPES.LIGHT.BINARY
    );
    this.setState({
      awoxTestStatus: RequestStatus.Getting
    });
    try {
      await this.props.httpClient.post(`/api/v1/service/awox/peripheral/test`, { device, feature, value });
      this.setState({
        awoxTestStatus: RequestStatus.Success
      });
    } catch (e) {
      this.setState({
        awoxTestStatus: RequestStatus.Error
      });
    }
  };

  testDeviceOn = async e => {
    await this.testDevice(e, 1);
  };

  testDeviceOff = async e => {
    await this.testDevice(e, 0);
  };

  pairDevice = async e => {
    e.preventDefault();

    const { device } = this.state;
    this.setState({
      awoxPairStatus: RequestStatus.Getting
    });
    try {
      await this.props.httpClient.post(`/api/v1/service/awox/peripheral/pair`, { device });
      this.setState({
        awoxPairStatus: RequestStatus.Success
      });
    } catch (e) {
      this.setState({
        awoxPairStatus: RequestStatus.Error
      });
    }
  };

  loadRemotes = async () => {
    this.setState({
      awoxRemoteStatus: RequestStatus.Getting
    });
    try {
      const remotes = await this.props.httpClient.get(`/api/v1/service/awox/remotes`);
      this.setState({
        remotes,
        awoxRemoteStatus: RequestStatus.Success
      });
    } catch (e) {
      this.setState({
        awoxRemoteStatus: RequestStatus.Error
      });
    }
  };

  constructor(props) {
    super(props);

    const device = props.peripheral;
    this.state = {
      device,
      modelData: getModelData(device)
    };

    this.createDevice = this.createDevice.bind(this);

    this.updateName = this.updateName.bind(this);
    this.updateRoom = this.updateRoom.bind(this);
    this.updateRemote = this.updateRemote.bind(this);
  }

  async componentWillMount() {
    this.props.getIntegrationByName('awox');

    const { remote, mesh } = this.state.modelData;
    if (!remote && mesh) {
      this.loadRemotes();
    }
  }

  render(
    { houses, bluetoothStatus, reloadDevice, currentIntegration = {}, awoxSaveStatus },
    { device, modelData, awoxTestStatus, awoxPairStatus, awoxRemoteStatus, remotes = [], selectedRemote }
  ) {
    const disableForm = awoxSaveStatus === RequestStatus.Getting;
    const deviceFeatures = device.features || [];

    const params = device.params || [];
    const manufacturerParam = params.find(p => p.name === PARAMS.MANUFACTURER);
    const manufacturerValue = (manufacturerParam || { value: null }).value;

    const bluetoothDevice = !device.service_id || device.service_id === currentIntegration.id;
    const buttonDisabled =
      awoxTestStatus === RequestStatus.Getting ||
      awoxPairStatus === RequestStatus.Getting ||
      disableForm ||
      !device.features ||
      !device.features.length ||
      !bluetoothDevice;

    const { remote, mesh } = modelData;
    const createDisabled = buttonDisabled || ((remote || mesh) && awoxPairStatus !== RequestStatus.Success);
    const pairable = remote || !selectedRemote;

    return (
      <form>
        {!bluetoothDevice && (
          <div class="alert alert-warning">
            <Text id="integration.awox.setup.notManagedByAwox" fields={{ service: device.service.name }} />
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
                <Text id="integration.awox.device.nameLabel" />
              </label>
              <Localizer>
                <input
                  name="name"
                  value={device.name}
                  onChange={this.updateName}
                  class="form-control"
                  placeholder={<Text id="integration.awox.device.namePlaceholder" />}
                  disabled={disableForm}
                  required
                />
              </Localizer>
            </div>

            <div class="form-group">
              <label class="form-label">
                <Text id="integration.awox.device.externalIdLabel" />
              </label>
              <input value={device.external_id} class="form-control" disabled />
            </div>

            <div class="form-group">
              <label for="room" class="form-label">
                <Text id="integration.awox.device.roomLabel" />
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
                <Text id="integration.awox.device.manufacturerLabel" />
              </label>
              <input type="text" class="form-control" disabled value={manufacturerValue} />
            </div>

            <div class="form-group">
              <label class="form-label">
                <Text id="integration.awox.device.modelLabel" />
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
            <div class="row">
              {deviceFeatures.map((feature, index) => (
                <UpdateDeviceFeature
                  feature={feature}
                  featureIndex={index}
                  updateFeatureProperty={this.updateFeatureProperty}
                />
              ))}
            </div>
          </BluetoothPeripheralFeatures>

          {!remote && mesh && (
            <div
              class={cx('dimmer', {
                active: awoxRemoteStatus === RequestStatus.Getting
              })}
            >
              <div class="loader" />
              <div class="dimmer-content">
                <div class="form-group">
                  <label for="room" class="form-label">
                    <Text id="integration.awox.setup.remoteLabel" />
                  </label>
                  <select name="remote" onChange={this.updateRemote} class="form-control" disabled={disableForm}>
                    <option value="">
                      <Text id="global.emptySelectOption" />
                    </option>
                    {remotes.map(remote => {
                      return <option value={remote.external_id}>{remote.name}</option>;
                    })}
                  </select>
                </div>
              </div>
            </div>
          )}

          {!remote && (
            <div class="row">
              <div class="col text-center">
                <button class="btn btn-outline-secondary mr-1" disabled={buttonDisabled} onClick={this.testDeviceOn}>
                  <i class="fe fe-toggle-right mr-2" />
                  <Text id="integration.awox.setup.testOnButton" />
                </button>
                <button class="btn btn-outline-secondary ml-1" disabled={buttonDisabled} onClick={this.testDeviceOff}>
                  <i class="fe fe-toggle-left mr-2" />
                  <Text id="integration.awox.setup.testOffButton" />
                </button>
                {awoxTestStatus === RequestStatus.Error && (
                  <div class="alert alert-warning mt-2">
                    <Text id={`integration.awox.setup.${mesh ? 'meshTestErrorMessage' : 'testErrorMessage'}`} />
                  </div>
                )}
              </div>
            </div>
          )}

          {awoxPairStatus === RequestStatus.Error && (
            <div class="alert alert-danger">
              <Text id="integration.awox.setup.pairAlert" />
            </div>
          )}

          <div class="row mt-5">
            {pairable && awoxPairStatus !== RequestStatus.Success && (
              <div class="col">
                <button
                  type="submit"
                  class={cx('btn', 'btn-success', {
                    'btn-loading': buttonDisabled
                  })}
                  onClick={this.pairDevice}
                  disabled={buttonDisabled}
                >
                  <Text id="integration.awox.setup.peripheral.pairLabel" />
                </button>
              </div>
            )}
            {(!pairable || awoxPairStatus === RequestStatus.Success) && (
              <div class="col">
                <button type="submit" class="btn btn-success" disabled={createDisabled} onClick={this.createDevice}>
                  <Text id="integration.awox.setup.peripheral.createLabel" />
                </button>
              </div>
            )}
            <div class="col text-right">
              <Link href="/dashboard/integration/device/awox/bluetooth">
                <button type="button" class="btn btn-danger">
                  <Text id="integration.awox.setup.peripheral.cancelLabel" />
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
