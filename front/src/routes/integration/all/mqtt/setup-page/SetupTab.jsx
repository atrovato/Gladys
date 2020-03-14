import { Component } from 'preact';
import { Text, MarkupText, Localizer } from 'preact-i18n';
import cx from 'classnames';
import { RequestStatus } from '../../../../../utils/consts';

class SetupTab extends Component {
  toggleCredentialEdition = e => {
    e.preventDefault();
    this.setState({ editCredential: !this.state.editCredential });
  };

  updateUsername = e => {
    e.preventDefault();
    this.props.updateConfiguration('mqttURL', e.target.value);
  };

  updateUsername = e => {
    e.preventDefault();
    this.setState({ username: e.target.value });
  };

  updatePassword = e => {
    e.preventDefault();
    this.setState({ password: e.target.value });
  };

  saveConfiguration = async e => {
    let credential;

    if (this.state.editCredential) {
      credential = {
        username: this.state.username,
        password: this.state.password
      };
    }

    await this.props.saveConfiguration(credential);
  };

  render(props, state) {
    return (
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">
            <Text id="integration.mqtt.setup.title" />
          </h3>
        </div>
        <div class="card-body">
          <div
            class={cx('dimmer', {
              active: props.connectMqttStatus === RequestStatus.Getting
            })}
          >
            <div class="loader" />
            <div class="dimmer-content">
              <p>
                <MarkupText id="integration.mqtt.setup.mqttDescription" />
              </p>
              {props.connectMqttStatus === RequestStatus.Error && (
                <p class="alert alert-danger">
                  <Text id="integration.mqtt.setup.error" />
                </p>
              )}
              {props.connectMqttStatus === RequestStatus.Success && !props.mqttConnected && (
                <p class="alert alert-info">
                  <Text id="integration.mqtt.setup.connecting" />
                </p>
              )}
              {props.mqttConnected && (
                <p class="alert alert-success">
                  <Text id="integration.mqtt.setup.connected" />
                </p>
              )}
              {props.mqttConnectionError && (
                <p class="alert alert-danger">
                  <Text id="integration.mqtt.setup.connectionError" />
                </p>
              )}
              <form>
                <div class="form-group">
                  <label for="mqttURL" class="form-label">
                    <Text id={`integration.mqtt.setup.urlLabel`} />
                  </label>
                  <Localizer>
                    <input
                      name="mqttURL"
                      placeholder={<Text id="integration.mqtt.setup.urlPlaceholder" />}
                      class="form-control"
                      value={props.mqttURL}
                      onInput={this.updateURL}
                    />
                  </Localizer>
                </div>

                <div class="text-center mt-2 mb-2">
                  <button
                    class={cx('btn', {
                      'btn-primary': !state.editCredential,
                      'btn-danger': state.editCredential
                    })}
                    onClick={this.toggleCredentialEdition}
                  >
                    {!state.editCredential && <Text id="integration.mqtt.setup.editCredentialLabel" />}
                    {state.editCredential && <Text id="integration.mqtt.setup.cancelCredentialLabel" />}
                  </button>
                </div>

                <div class={cx({ collapse: !state.editCredential })}>
                  <div class="form-group">
                    <label for="mqttUsername" class="form-label">
                      <Text id={`integration.mqtt.setup.userLabel`} />
                    </label>
                    <Localizer>
                      <input
                        name="mqttUsername"
                        placeholder={<Text id="integration.mqtt.setup.userPlaceholder" />}
                        class="form-control"
                        onInput={this.updateUsername}
                      />
                    </Localizer>
                  </div>

                  <div class="form-group">
                    <label for="mqttPassword" class="form-label">
                      <Text id={`integration.mqtt.setup.passwordLabel`} />
                    </label>
                    <Localizer>
                      <input
                        name="mqttPassword"
                        type="password"
                        placeholder={<Text id="integration.mqtt.setup.passwordPlaceholder" />}
                        class="form-control"
                        onInput={this.updatePassword}
                      />
                    </Localizer>
                  </div>
                </div>

                <div class="row mt-5">
                  <div class="col">
                    <button type="submit" class="btn btn-success" onClick={this.saveConfiguration}>
                      <Text id="integration.mqtt.setup.saveLabel" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SetupTab;
