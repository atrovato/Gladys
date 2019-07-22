import { Component } from 'preact';
import { Text, Localizer } from 'preact-i18n';
import cx from 'classnames';

class ConfigurePeripheralConfigurationForm extends Component {
  render({ device, updateParamValue, disableForm }, {}) {
    const params = (device.params || []).filter(param => {
      return param.name !== 'brand' && param.name !== 'model';
    });

    if (params.length === 0) {
      return null;
    } else {
      return (
        <div class="form-group">
          {params.map(param => (
            <div
              class={cx('form-group', {
                'was-validated': !param.value || param.value.length === 0
              })}
            >
              <label for="name" class="form-label">
                <Text id={`integration.bluetooth.device.configParam.${param.name}`}>{param.name}</Text>
              </label>
              <Localizer>
                <input
                  name="name"
                  value={param.value}
                  onChange={e => updateParamValue(e, param.name)}
                  class="form-control"
                  disabled={disableForm}
                  required
                />
              </Localizer>
            </div>
          ))}
        </div>
      );
    }
  }
}

export default ConfigurePeripheralConfigurationForm;
