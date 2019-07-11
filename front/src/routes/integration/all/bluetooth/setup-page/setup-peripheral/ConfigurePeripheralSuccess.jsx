import { Component } from 'preact';
import { Text } from 'preact-i18n';
import { Link } from 'preact-router/match';

class ConfigurePeripheralSuccess extends Component {
  render({}, {}) {
    return (
      <div>
        <div class="alert alert-success">
          <Text id="integration.bluetooth.setup.saveSuccess" />
        </div>

        <div class="text-center">
          <Link href="/dashboard/integration/device/bluetooth/setup">
            <button type="button" class="btn btn-success">
              <Text id="integration.bluetooth.setup.peripheral.successLabel" />
            </button>
          </Link>
        </div>
      </div>
    );
  }
}

export default ConfigurePeripheralSuccess;
