import { Component } from 'preact';
import { Text, Localizer } from 'preact-i18n';
import RemoteControlSelector from '../../../../../../components/remote-control/RemoteControlSelector';
import RemoteControlLayout from '../../../../../../components/remote-control/RemoteControlLayout';

class RemoteCreation extends Component {
  updateDeviceName = e => {
    this.props.updateDeviceProperty('name', e.target.value);
  };

  updateDeviceRoom = e => {
    this.props.updateDeviceProperty('room_id', e.target.value);
  };

  updateDeviceModel = e => {
    const peripheralName = e.target.value;
    const selectedModel = this.props.broadlinkPeripherals.find(p => p.name === peripheralName);
    const newState = {
      selectedModel
    };
    this.props.updateState(newState);
  };

  updateRemoteTypeAndButtons = (remoteType, buttonByFeature) => {
    const buttons = Object.keys(buttonByFeature).map(key => {
      const button = { ...buttonByFeature[key] };
      button.feature = key;
      return button;
    });
    this.props.updateState({
      remoteType,
      buttons
    });
  };

  render(props) {
    return (
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
          <label class="form-label" for="remotePeripheral">
            <Text id="integration.broadlink.setup.peripheralLabel" />
          </label>
          <select onChange={this.updateDeviceModel} class="form-control" id="remotePeripheral">
            <option value="" disabled={true} selected={!props.device.model}>
              <Text id="global.emptySelectOption" />
            </option>
            {props.broadlinkPeripherals &&
              props.broadlinkPeripherals.map(peripheral => (
                <option selected={peripheral.name === props.device.model} value={peripheral.name}>
                  {peripheral.name} ({peripheral.address})
                </option>
              ))}
          </select>
        </div>

        <RemoteControlSelector
          remoteType={props.remoteType}
          updateRemoteTypeAndButtons={this.updateRemoteTypeAndButtons}
        />

        <div class="row">
          <div class="col-sm-4">
            <RemoteControlLayout
              remoteType={props.remoteType}
              remoteName={props.device.name}
              onClick={props.selectButton}
            />
          </div>

          <div class="col-sm-8">{props.selectedButton}</div>
        </div>
      </div>
    );
  }
}

export default RemoteCreation;
