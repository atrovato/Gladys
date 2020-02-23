import { Text } from 'preact-i18n';
import cx from 'classnames';

import Peripheral from './Peripheral';
import { RequestStatus } from '../../../../../utils/consts';
import EmptyState from '../EmptyState';
import style from '../style.css';

const PeripheralTab = ({ children, ...props }) => {
  const bluetoothReady = props.bluetoothGetDriverStatus === RequestStatus.Success && props.bluetoothPowered;
  const hasBluetoothPeripherals = props.bluetoothPeripherals && props.bluetoothPeripherals.length > 0;

  return (
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">
          <Text id="integration.bluetooth.setup.title" />
        </h3>
        <div class="page-options d-flex">
          <button
            class={cx('btn', {
              'btn-outline-danger': props.bluetoothScanning,
              'btn-outline-primary': !props.bluetoothScanning
            })}
            onClick={props.scan}
            disabled={!bluetoothReady}
          >
            <Text id="integration.bluetooth.setup.scanButton" /> <i class="fe fe-radio" />
          </button>
        </div>
      </div>
      <div class="card-body">
        <div
          class={cx('dimmer', {
            active: props.bluetoothScanning || props.bluetoothGetPeripheralsStatus === RequestStatus.Getting
          })}
        >
          <div class="loader" />
          <div class="dimmer-content">
            {!bluetoothReady && (
              <div class="alert alert-warning">
                <Text id="integration.bluetooth.setup.bluetoothNotReadyError" />
              </div>
            )}
            {bluetoothReady && (
              <div class={cx('row', style.bluetoothListBody)}>
                {hasBluetoothPeripherals &&
                  props.bluetoothPeripherals.map((device, index) => (
                    <Peripheral {...props} device={device} peripheralIndex={index} createDevice={props.createDevice} />
                  ))}
                {!hasBluetoothPeripherals && <EmptyState messageId="integration.bluetooth.setup.noDeviceDiscovered" />}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeripheralTab;
