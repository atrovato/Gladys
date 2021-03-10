import { Text } from 'preact-i18n';
import { Link } from 'preact-router/match';

const PeripheralNotFound = ({ uuid }) => (
  <div>
    <div class="alert alert-danger">
      <Text id={'integration.awox.setup.peripheral.notAvailable'} />
    </div>
    <Link href="/dashboard/integration/device/awox/bluetooth">
      <button type="button" class="btn btn-outline-secondary btn-sm">
        <Text id="global.backButton" />
      </button>
    </Link>
  </div>
);

export default PeripheralNotFound;
