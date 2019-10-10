import { Text } from 'preact-i18n';
import cx from 'classnames';
import style from './style.css';

const EmptyState = ({ children }) => (
  <div class="col-md-12">
    <div class={cx('text-center', style.emptyStateDivBox)}>
      <Text id="integration.broadlink.remote.noRemoteFound" />
    </div>
  </div>
);

export default EmptyState;
