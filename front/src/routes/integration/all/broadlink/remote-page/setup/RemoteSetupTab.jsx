import { Component } from 'preact';
import { Text, Localizer } from 'preact-i18n';
import { Link } from 'preact-router/match';
import cx from 'classnames';

class RemoteSetupTab extends Component {
  updateDeviceName = e => {
    this.props.updateDeviceProperty('name', e.target.value);
  };

  updateDeviceRoom = e => {
    this.props.updateDeviceProperty('room_id', e.target.value);
  };

  render(props) {
    return (
      <div class="card">
        <div class="card-header">
          <Link href="/dashboard/integration/device/broadlink">
            <button class="btn btn-secondary mr-2">
              ◀️ <Text id="integration.broadlink.setup.returnButton" />
            </button>
          </Link>
          <h3 class="card-title">
            {(props.device && props.device.name) || <Text id="integration.broadlink.setup.noNameLabel" />}
          </h3>
        </div>
        <div
          class={cx('dimmer', {
            active: props.loading
          })}
        >
          <div class="loader" />
          <div class="dimmer-content">
            <div class="card-body">
              {props.saveStatus && (
                <div class="alert alert-danger">
                  <Text id="integration.broadlink.setup.saveError" />
                </div>
              )}
              {!props.loading && !props.device && (
                <div>
                  <p class="alert alert-danger">
                    <Text id="integration.broadlink.setup.notFound" />
                  </p>
                  <Link href="/dashboard/integration/device/broadlink">
                    <button type="button" class="btn btn-outline-secondary btn-sm">
                      <Text id="integration.broadlink.setup.backToList" />
                    </button>
                  </Link>
                </div>
              )}
              {props.device && (
                <div>
                  <div class="form-group">
                    <label class="form-label" for="remoteName">
                      <Text id="integration.broadlink.remote.nameLabel" />
                    </label>
                    <Localizer>
                      <input
                        type="text"
                        id="remoteName"
                        value={props.device.name}
                        onInput={this.updateDeviceName}
                        class="form-control"
                        placeholder={<Text id="integration.broadlink.remote.namePlaceholder" />}
                      />
                    </Localizer>
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="remoteRoom">
                      <Text id="integration.broadlink.remote.roomLabel" />
                    </label>
                    <select onChange={this.updateDeviceRoom} class="form-control" id="remoteRoom">
                      <option value="">
                        <Text id="global.emptySelectOption" />
                      </option>
                      {props.houses &&
                        props.houses.map(house => (
                          <optgroup label={house.name}>
                            {house.rooms.map(room => (
                              <option selected={room.id === props.device.room_id} value={room.id}>
                                {room.name}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                    </select>
                  </div>

                  <div class="form-group">
                    <Link href="/dashboard/integration/device/broadlink">
                      <button class="btn btn-secondary mr-2">
                        ◀️ <Text id="integration.broadlink.setup.returnButton" />
                      </button>
                    </Link>
                    <button onClick={props.saveDevice} class="btn btn-success mr-2">
                      <Text id="integration.broadlink.setup.saveButton" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RemoteSetupTab;
