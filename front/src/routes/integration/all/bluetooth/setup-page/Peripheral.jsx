import { Text } from 'preact-i18n';
import { Component } from 'preact';
import get from 'get-value';
import { RequestStatus, DeviceFeatureCategoriesIcon } from '../../../../../utils/consts';
import { Link } from 'preact-router';
import dayjs from 'dayjs';
import cx from 'classnames';

class Peripheral extends Component {
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

  render({ device, ...props }, { error, deviceCreated }) {
    const parameters = {};
    device.params.forEach(param => {
      parameters[param.name] = param.value;
    });

    const hasFeature = device.features && device.features.length > 0;
    const peripheralUuid = device.external_id.replace('bluetooth:', '');

    return (
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">{device.name}</h3>
          </div>
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
          <div
            class={cx('dimmer', {
              active: !parameters.loaded
            })}
          >
            <div class="loader" />
            <div class="dimmer-content">
              <div class="card-body">
                <div class="form-group">
                  <label class="form-label">
                    <Text id="integration.bluetooth.setup.deviceNameLabel" />
                    <div class="float-right font-weight-normal">
                      {parameters.deviceName || <Text id="integration.bluetooth.setup.noValue" />}
                    </div>
                  </label>
                </div>
                <div class="form-group">
                  <label class="form-label">
                    <Text id="integration.bluetooth.setup.manufacturerLabel" />
                    <div class="float-right font-weight-normal">
                      {parameters.manufacturer || <Text id="integration.bluetooth.setup.noValue" />}
                    </div>
                  </label>
                </div>
                <div class="form-group">
                  <label class="form-label">
                    <Text id="integration.bluetooth.setup.modelLabel" />
                    <div class="float-right font-weight-normal">
                      {device.model || <Text id="integration.bluetooth.setup.noValue" />}
                    </div>
                  </label>
                </div>
                <div class="form-group">
                  <label class="form-label">
                    <Text id="integration.bluetooth.setup.externalIdLabel" />
                    <div class="float-right font-weight-normal">{device.external_id.replace('bluetooth:', '')}</div>
                  </label>
                </div>
                <div class="form-group">
                  <label class="form-label">
                    <Text id="integration.bluetooth.setup.lastSeenLabel" />
                    <div class="float-right font-weight-normal">
                      {dayjs(device.last_value_changed)
                        .locale(props.user.language)
                        .fromNow()}
                    </div>
                  </label>
                </div>
                <div class="form-group">
                  <label class="form-label">
                    <Text id="integration.bluetooth.device.featuresLabel" />
                  </label>
                  {hasFeature && (
                    <div class="tags">
                      {device.features.map(feature => (
                        <span class="tag">
                          <Text id={`deviceFeatureCategory.${feature.category}.${feature.type}`} />
                          <div class="tag-addon">
                            <i
                              class={`fe fe-${get(DeviceFeatureCategoriesIcon, `${feature.category}.${feature.type}`)}`}
                            />
                          </div>
                        </span>
                      ))}
                    </div>
                  )}
                  {!hasFeature && (
                    <div class="text-muted">
                      <Text id="integration.bluetooth.setup.noFeatures" />
                    </div>
                  )}
                </div>
                <div class="form-group">
                  {parameters.connectable && (
                    <Link href={'/dashboard/integration/device/bluetooth/setup/' + peripheralUuid}>
                      <button class="btn btn-success">
                        <Text id="integration.bluetooth.setup.createDeviceInGladys" />
                      </button>
                    </Link>
                  )}
                  {!parameters.connectable && (
                    <button class="btn btn-danger" disabled>
                      <Text id="integration.bluetooth.setup.notConnectable" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Peripheral;
