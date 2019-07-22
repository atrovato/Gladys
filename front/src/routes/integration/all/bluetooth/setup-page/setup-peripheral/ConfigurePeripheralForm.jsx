import { Component } from 'preact';
import { Text, Localizer } from 'preact-i18n';
import { connect } from 'unistore/preact';
import { Link } from 'preact-router/match';
import actions from '../actions';
import { RequestStatus, DeviceFeatureCategoriesIcon } from '../../../../../../utils/consts';
import { WEBSOCKET_MESSAGE_TYPES } from '../../../../../../../../server/utils/constants';
import cx from 'classnames';

import ConfigurePeripheralConfigrationForm from './ConfigurePeripheralConfigurationForm';

@connect(
  'session,httpClient,bluetoothBrands,houses,currentIntegration',
  actions
)
class ConfigurePeripheral extends Component {
  connected(data) {
    const { device } = this.state;
    if (data.uuid === device.external_id) {
      const dataDevice = data.detection;

      if (data.status === 'done' && dataDevice) {
        this.setState({
          enableAutoDetect: false,
          autoDetect: false,
          bluetoothConnectStatut: RequestStatus.Success,
          brand: dataDevice.brand,
          model: dataDevice.model,
          device: {
            ...this.state.device,
            ...dataDevice.device
          }
        });
      } else {
        this.setState({
          autoDetect: false,
          bluetoothConnectStatut: RequestStatus.Error
        });
      }
    }
  }

  selectBrand(event) {
    const { device, brand } = this.state;
    const selectedBrand = event.target.value;

    if (brand !== selectedBrand) {
      let model;

      const params = (device.params || []).slice();
      const brandParam = params.find(p => p.name === 'brand');
      if (brandParam) {
        brandParam.value = selectedBrand;
      } else {
        params.push({
          name: 'brand',
          value: brand
        });
      }

      this.setState({
        device: {
          ...device,
          features: undefined,
          params
        },
        brand: selectedBrand,
        model
      });

      if (this.props.bluetoothBrands[selectedBrand].length === 1) {
        model = this.props.bluetoothBrands[selectedBrand][0];
        this.selectModel({ target: { value: model } });
      }
    }
  }

  selectModel(event) {
    const { device, model, brand } = this.state;
    const selectedModel = event.target.value;

    if (model !== selectedModel) {
      this.loadDeviceFeatures(brand, selectedModel);

      const params = (device.params || []).slice();
      const brandParam = params.find(p => p.name === 'model');
      if (brandParam) {
        brandParam.value = selectedModel;
      } else {
        params.push({
          name: 'model',
          value: model
        });
      }

      this.setState({
        device: {
          ...device,
          params
        },
        model: selectedModel
      });
    }
  }

  async loadDeviceFeatures(brand, model) {
    this.setState({
      bluetoothFeatureStatus: RequestStatus.Getting
    });

    try {
      const bluetoothDevice = await this.props.httpClient.get(`/api/v1/service/bluetooth/brand/${brand}/${model}`);

      const { device } = this.state;
      this.setState({
        bluetoothFeatureStatus: RequestStatus.Success,
        device: {
          ...device,
          ...bluetoothDevice
        }
      });
    } catch (e) {
      this.setState({
        bluetoothFeatureStatus: RequestStatus.Error
      });
    }
  }

  autoDetect() {
    this.setState({
      autoDetect: true,
      bluetoothConnectStatut: RequestStatus.Getting
    });

    try {
      this.props.httpClient.post(`/api/v1/service/bluetooth/peripheral/${this.state.device.external_id}/connect`);
    } catch (e) {
      this.setState({
        autoDetect: false,
        bluetoothConnectStatut: RequestStatus.Error
      });
    }
  }

  updateName(e) {
    this.setState({
      device: {
        ...this.state.device,
        name: e.target.value
      }
    });
  }

  updateRoom(e) {
    this.setState({
      device: {
        ...this.state.device,
        room_id: e.target.value
      }
    });
  }

  updateFeatureName(e, index) {
    e.preventDefault();

    const { device } = this.state;
    const features = device.features.slice();
    features[index] = e.target.value;

    this.setState({
      device: {
        ...device,
        features
      }
    });
  }

  updateParamValue(e, paramName) {
    e.preventDefault();

    const { device } = this.state;
    const params = (device.params || []).slice();
    const param = params.find(param => param.name === paramName);

    console.log('paramName =', paramName);
    console.log('param =', param);

    if (param) {
      param.value = e.target.value;

      console.log('param =', param);
      console.log('params =', params);

      this.setState({
        device: {
          ...device,
          params
        }
      });
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      device: {
        name: props.peripheral.name,
        external_id: props.peripheral.uuid
      },
      autoDetect: false,
      enableAutoDetect: true
    };

    this.autoDetect = this.autoDetect.bind(this);
    this.loadDeviceFeatures = this.loadDeviceFeatures.bind(this);
    this.createDevice = this.createDevice.bind(this);

    this.connected = this.connected.bind(this);

    this.selectBrand = this.selectBrand.bind(this);
    this.selectModel = this.selectModel.bind(this);

    this.updateName = this.updateName.bind(this);
    this.updateRoom = this.updateRoom.bind(this);
    this.updateFeatureName = this.updateFeatureName.bind(this);
    this.updateParamValue = this.updateParamValue.bind(this);
  }

  createDevice(e) {
    e.preventDefault();

    this.props.createDevice(this.state.device);
  }

  componentWillMount() {
    this.props.loadBrands();
    this.props.getIntegrationByName('bluetooth');

    this.props.session.dispatcher.addListener(WEBSOCKET_MESSAGE_TYPES.BLUETOOTH.DETERMINE, data =>
      this.connected(data)
    );
  }

  render(props, {}) {
    const {
      device,
      brand,
      model,
      autoDetect,
      enableAutoDetect,
      bluetoothConnectStatut,
      bluetoothSaveStatus
    } = this.state;
    const { peripheral, bluetoothBrands, houses } = props;

    let autoDetectText;
    let autoDetectColor;
    switch (bluetoothConnectStatut) {
      case RequestStatus.Getting:
        autoDetectText = <Text id="integration.bluetooth.setup.peripheral.autoDetectConnecting" />;
        autoDetectColor = 'secondary';
        break;
      case RequestStatus.Error:
        autoDetectText = <Text id="integration.bluetooth.setup.peripheral.autoDetectError" />;
        autoDetectColor = 'danger';
        break;
      case RequestStatus.Success:
        if (brand) {
          autoDetectText = (
            <span>
              <Text id="integration.bluetooth.setup.peripheral.autoDetectSuccess" />
              &nbsp;
              <Text id={`integration.bluetooth.setup.peripheral.brands.${brand}.title`}>{brand}</Text>
              &nbsp;-&nbsp;
              <Text id={`integration.bluetooth.setup.peripheral.brands.${brand}.models.${model}`}>{model}</Text>.
            </span>
          );
          autoDetectColor = 'success';
        } else {
          autoDetectText = <Text id="integration.bluetooth.setup.peripheral.autoDetectSuccessEmpty" />;
          autoDetectColor = 'danger';
        }
        break;
      default:
        autoDetectText = <Text id="integration.bluetooth.setup.peripheral.autoDetect" />;
        autoDetectColor = 'primary';
    }

    const disableForm = bluetoothSaveStatus === RequestStatus.Getting;

    return (
      <form>
        {bluetoothSaveStatus === RequestStatus.Error && (
          <div class="alert alert-danger">
            <Text id="integration.bluetooth.setup.saveError" />
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
                <Text id="integration.bluetooth.setup.addressLabel" />
              </label>
              <input value={peripheral.address} class="form-control" disabled />
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
          </div>

          <div class="row mt-5">
            <div class="col text-center">
              <button
                type="button"
                class={`btn btn-sm btn-outline-${autoDetectColor}`}
                disabled={!enableAutoDetect || autoDetect || disableForm}
                onClick={this.autoDetect}
              >
                {autoDetectText}
              </button>
            </div>
          </div>

          <div class="form-group">
            <label for="brand" class="form-label">
              <Text id="integration.bluetooth.setup.peripheral.brandSelection" />
            </label>
            <select name="brand" class="form-control" onChange={this.selectBrand} disabled={autoDetect || disableForm}>
              <option hidden disabled value selected={!brand}>
                <Text id="global.emptySelectOption" />
              </option>
              {bluetoothBrands &&
                Object.keys(bluetoothBrands).map(b => (
                  <option value={b} selected={b === brand}>
                    <Text id={`integration.bluetooth.setup.peripheral.brands.${b}.title`}>{b}</Text>
                  </option>
                ))}
            </select>
          </div>

          <div class="form-group">
            <label for="model" class="form-label">
              <Text id="integration.bluetooth.setup.peripheral.modelSelection" />
            </label>
            <select
              name="model"
              class="form-control"
              onChange={this.selectModel}
              disabled={autoDetect || !brand || disableForm}
            >
              <option hidden disabled value selected={!model}>
                <Text id="global.emptySelectOption" />
              </option>
              {bluetoothBrands &&
                bluetoothBrands[brand] &&
                bluetoothBrands[brand].map(m => (
                  <option value={m} selected={m === model}>
                    <Text id={`integration.bluetooth.setup.peripheral.brands.${brand}.models.${m}`}>{m}</Text>
                  </option>
                ))}
            </select>
          </div>

          {device.features && (
            <div class="form-group">
              <label class="form-label">
                <Text id="integration.bluetooth.device.featuresLabel" />
              </label>
              <ul class="tags">
                {device.features.map((feature, index) => (
                  <li class="form-group">
                    <div class="input-group mb-2">
                      <div class="input-group-prepend">
                        <span class="tag input-group-text">
                          <Text id={`deviceFeatureCategory.${feature.category}`} />
                          <div class="tag-addon">
                            <i class={`fe fe-${DeviceFeatureCategoriesIcon[feature.category]}`} />
                          </div>
                        </span>
                      </div>
                      <Localizer>
                        <input
                          class="form-control form-control-sm"
                          placeholder={
                            <Text
                              id="integration.bluetooth.device.featureNamePlaceholder"
                              fields={{ type: feature.type, name: `${device.name} ${feature.type}` }}
                            />
                          }
                          value={feature.name}
                          disabled={disableForm}
                          key={`feature-${index}`}
                          onChange={e => this.updateFeatureName(e, index)}
                          required
                        />
                      </Localizer>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <ConfigurePeripheralConfigrationForm
            device={this.state.device}
            updateParamValue={this.updateParamValue}
            disableForm={disableForm}
          />

          <div class="row mt-10">
            <div class="col">
              <button
                type="submit"
                class="btn btn-success"
                disabled={disableForm || autoDetect || !device.features}
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

export default ConfigurePeripheral;
