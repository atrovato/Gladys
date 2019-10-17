import { Component } from 'preact';
import cx from 'classnames';
import style from './style.css';

class ButtonBox extends Component {
  render({ button }) {
    let name;
    let icon;
    if (button) {
      name = button.name;
      icon = button.icon;
    }

    return (
      <div
        title={name}
        class={cx('text-center', style.iconDiv, {
          [style.emptyIconDiv]: !icon
        })}
      >
        <label class={style.iconLabel}>
          <i
            class={cx('fe', {
              [`fe-${icon}`]: icon,
              [style.emptyIcon]: !icon
            })}
          />
        </label>
      </div>
    );
  }
}

export default ButtonBox;
