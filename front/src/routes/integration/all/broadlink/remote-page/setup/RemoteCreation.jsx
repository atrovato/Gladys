import { Component } from 'preact';
import { Text, Localizer } from 'preact-i18n';
import RemoteControlSelector from '../../../../../../components/remote-control/RemoteControlSelector';
import RemoteControlLayout from '../../../../../../components/remote-control/RemoteControlLayout';
import LearningMode from './LearningMode';
import ButtonBox from '../../../../../../components/remote-control/ButtonBox';
import ButtonOptions from '../../../../../../components/remote-control/templates';

class RemoteCreation extends Component {
  updateDeviceName = e => {
    this.props.updateDeviceProperty('name', e.target.value);
  };

  updateDeviceRoom = e => {
    this.props.updateDeviceProperty('room_id', e.target.value);
  };

  updatePeripheralModel = e => {
    const peripheralName = e.target.value;
    const selectedModel = this.props.broadlinkPeripherals.find(p => p.name === peripheralName);
    const newState = {
      selectedModel
    };
    this.props.updateState(newState);
  };

  updateDeviceType = remoteType => {
    this.props.updateDeviceProperty('model', remoteType);
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
          <select onChange={this.updatePeripheralModel} class="form-control" id="remotePeripheral">
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

        <RemoteControlSelector remoteType={props.device.model} updateRemoteTypeAndButtons={this.updateDeviceType} />

        {props.device.model && (
          <div class="row">
            <div class="col-sm-4">
              <Localizer>
                <RemoteControlLayout
                  remoteType={props.device.model}
                  remoteName={props.device.name || <Text id="integration.broadlink.setup.noNameLabel" />}
                  onClick={props.selectButton}
                  editionMode={true}
                  featureByType={props.buttons}
                />
              </Localizer>
            </div>

            <div class="col-sm-8">
              {!props.selectedButton && (
                <div class="alert alert-secondary">
                  <Text id="integration.broadlink.setup.selectButtonLabel" />
                </div>
              )}
              {props.selectedButton && (
                <div class="text-center">
                  <div class="form-group">
                    <label class="form-label" for="remotePeripheral">
                      <Text id="integration.broadlink.setup.selectedButtonLabel" />
                    </label>

                    <ButtonBox
                      category={props.device.model}
                      featureName={props.selectedButton}
                      buttonProps={ButtonOptions[props.device.model][props.selectedButton]}
                      edited={true}
                    />
                    <span class="ml-3">
                      <Text id={`deviceFeatureCategory.${props.device.model}.${props.selectedButton}`}>
                        {props.selectedButton}
                      </Text>
                    </span>
                  </div>

                  <LearningMode {...props} />

                  <div class="d-flex justify-content-around mt-3">
                    <button
                      class="btn btn-success"
                      onClick={props.testSelectedButton}
                      disabled={!props.buttons[props.selectedButton]}
                    >
                      <Text id="integration.broadlink.setup.testLabel" />
                      <i class="fe fe-play ml-2" />
                    </button>

                    <button
                      class="btn btn-danger"
                      onClick={props.deleteButton}
                      disabled={!props.buttons[props.selectedButton]}
                    >
                      <Text id="integration.broadlink.setup.deleteLabel" />
                      <i class="fe fe-trash-2 ml-2" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default RemoteCreation;
