import { Component } from 'preact';
import { Text, Localizer } from 'preact-i18n';

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
    this.props.updateDeviceModelProperty(selectedModel);
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
      </div>
    );
  }
}

export default RemoteCreation;
