import { Component } from 'preact';
import { Text, Localizer } from 'preact-i18n';
import { connect } from 'unistore/preact';
import { Link } from 'preact-router/match';
import actions from '../actions';
import { RequestStatus, DeviceFeatureCategoriesIcon } from '../../../../../../utils/consts';
import { WEBSOCKET_MESSAGE_TYPES } from '../../../../../../../../server/utils/constants';

@connect(
  'session,httpClient,bluetoothBrands,houses',
  actions
)
class ConfigurePeripheral extends Component {
  connected(data) {
    if (data.uuid === this.props.peripheral.uuid) {
      if (data.status === 'done') {
        this.setState({
          enableAutoDetect: false,
          autoDetect: false,
          bluetoothConnectStatut: RequestStatus.Success,
          device: {
            ...data.device
          }
        });

        const { device } = this.state;
        if (device.brand && device.model) {
          this.loadDeviceFeatures(device.brand, device.model);
        }
      } else {
        this.setState({
          autoDetect: false,
          bluetoothConnectStatut: RequestStatus.Error
        });
      }
    }
  }

  selectBrand(event) {
    const { device } = this.state;
    const selectedBrand = event.target.value;

    if (device.brand !== selectedBrand) {
      let model;

      if (this.props.bluetoothBrands[selectedBrand].length === 1) {
        model = this.props.bluetoothBrands[selectedBrand][0];
        this.loadDeviceFeatures(selectedBrand, model);
      }

      this.setState({
        device: {
          ...device,
          brand: selectedBrand,
          model,
          features: undefined
        }
      });
    }
  }

  selectModel(event) {
    const { device } = this.state;
    const selectedModel = event.target.value;

    if (device.model !== selectedModel) {
      this.loadDeviceFeatures(device.brand, selectedModel);

      this.setState({
        device: {
          ...device,
          model: selectedModel
        }
      });
    }
  }

  async loadDeviceFeatures(brand, model) {
    this.setState({
      bluetoothFeatureStatus: RequestStatus.Getting
    });

    try {
      const features = await this.props.httpClient.get(`/api/v1/service/bluetooth/brand/${brand}/${model}`);

      const { device } = this.state;
      this.setState({
        bluetoothFeatureStatus: RequestStatus.Success,
        device: {
          ...device,
          features
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
      this.props.httpClient.post(`/api/v1/service/bluetooth/peripheral/${this.props.peripheral.uuid}/connect`);
    } catch (e) {
      this.setState({
        autoDetect: false,
        bluetoothConnectStatut: RequestStatus.Error
      });
    }
  }

  createDevice(e) {
    e.preventDefault();
    this.props.saveDevice(this.state.device);
  }

  constructor(props) {
    super(props);

    this.state = {
      device: {
        name: props.peripheral.name
      },
      autoDetect: false,
      enableAutoDetect: true,
      disableForm: false
    };

    this.autoDetect = this.autoDetect.bind(this);
    this.loadDeviceFeatures = this.loadDeviceFeatures.bind(this);
    this.createDevice = this.createDevice.bind(this);

    this.selectBrand = this.selectBrand.bind(this);
    this.selectModel = this.selectModel.bind(this);
  }

  componentWillMount() {
    this.props.loadBrands();

    this.props.session.dispatcher.addListener(WEBSOCKET_MESSAGE_TYPES.BLUETOOTH.DETERMINE, data =>
      this.connected(data)
    );
  }

  render(props, {}) {
    const { device, autoDetect, enableAutoDetect, bluetoothConnectStatut, bluetoothSaveStatus } = this.state;
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
        if (device && device.brand) {
          autoDetectText = (
            <span>
              <Text id="integration.bluetooth.setup.peripheral.autoDetectSuccess" />
              &nbsp;
              <Text id={'integration.bluetooth.setup.peripheral.brands.' + device.brand + '.title'}>
                {device.brand}
              </Text>
              &nbsp;-&nbsp;
              <Text id={'integration.bluetooth.setup.peripheral.brands.' + device.brand + '.models.' + device.model}>
                {device.model}
              </Text>
              .
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

        <h4>{peripheral.name || peripheral.address}</h4>

        <div>
          <div class="form-group">
            <label for="name" class="form-label">
              <Text id="integration.bluetooth.device.nameLabel" />
            </label>
            <Localizer>
              <input
                name="name"
                value={device.name}
                class="form-control"
                placeholder={<Text id="integration.bluetooth.device.namePlaceholder" />}
                disabled={disableForm}
              />
            </Localizer>
          </div>

          <div class="form-group">
            <label class="form-label">
              <Text id="integration.bluetooth.setup.addressLabel" />
            </label>
            <Localizer>
              <input value={peripheral.address} class="form-control" disabled />
            </Localizer>
          </div>

          <div class="form-group">
            <label for="room" class="form-label">
              <Text id="integration.bluetooth.device.roomLabel" />
            </label>
            <select name="room" onChange={this.updateRoom} class="form-control" disabled={disableForm}>
              <option value=""><Text id="global.emptySelectOption" /></option>
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
              class={'btn btn-sm btn-outline-' + autoDetectColor}
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
          <select
            name="brand"
            class="form-control custom-select"
            onChange={this.selectBrand}
            disabled={autoDetect || disableForm}
          >
            <option hidden disabled value selected={!(device || {}).brand}><Text id="global.emptySelectOption" /></option>
            {bluetoothBrands &&
              Object.keys(bluetoothBrands).map(brand => (
                <option value={brand} selected={brand === device.brand}>
                  <Text id={'integration.bluetooth.setup.peripheral.brands.' + brand + '.title'}>{brand}</Text>
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
            class="form-control custom-select"
            onChange={this.selectModel}
            disabled={autoDetect || !device.brand || disableForm}
          >
            <option hidden disabled value selected={!(device || {}).model}><Text id="global.emptySelectOption" /></option>
            {bluetoothBrands &&
              bluetoothBrands[device.brand] &&
              bluetoothBrands[device.brand].map(model => (
                <option value={model} selected={model === device.model}>
                  <Text id={'integration.bluetooth.setup.peripheral.brands.' + device.brand + '.models.' + model}>
                    {model}
                  </Text>
                </option>
              ))}
          </select>
        </div>

        {device.features && (
          <div class="form-group">
            <label class="form-label">
              <Text id="integration.bluetooth.device.featuresLabel" />
            </label>
            <div class="tags">
              {device.features.map(feature => (
                <span class="tag">
                  <Text id={`deviceFeatureCategory.${feature.category}`} />
                  <div class="tag-addon">
                    <i class={`fe fe-${DeviceFeatureCategoriesIcon[feature.category]}`} />
                  </div>
                </span>
              ))}
            </div>
          </div>
        )}

        <div class="row">
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
      </form>
    );
  }
}

export default ConfigurePeripheral;
