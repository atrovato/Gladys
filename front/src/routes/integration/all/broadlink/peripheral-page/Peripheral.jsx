import { Text } from 'preact-i18n';
import { Component } from 'preact';
import cx from 'classnames';

class BroadlinkPeripheralBox extends Component {
  constructor(props) {
    super(props);

    this.collapsePeripheral = this.collapsePeripheral.bind(this);
  }

  collapsePeripheral(e) {
    e.preventDefault();
    this.props.updatePeripheralProperty(this.props.peripheralIndex, 'collapsed', !this.props.peripheral.collapsed);
  }

  render(props) {
    return (
      <div class="col-md-6">
        <div
          class={cx('card', {
            'card-collapsed': !props.peripheral.collapsed
          })}
        >
          <div class="card-header">
            <div class="card-title">
              {props.peripheral.name || <Text id="integration.broadlink.peripheral.noNameLabel" />}
            </div>
            <div class="card-options">
              <a href="" onClick={this.collapsePeripheral} class="card-options-collapse" data-toggle="card-collapse">
                <i class="fe fe-chevron-up" />
              </a>
            </div>
          </div>
          <div class="card-body">
            <div class="form-group">
              <label class="form-label" for="ipAddress">
                <Text id="integration.broadlink.peripheral.ipAddressLabel" />
              </label>
              <input id="ipAddress" type="text" class="form-control" disabled={true} value={props.peripheral.address} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default BroadlinkPeripheralBox;
