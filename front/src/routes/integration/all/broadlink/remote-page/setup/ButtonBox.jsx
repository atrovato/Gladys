import { Component } from 'preact';
import cx from 'classnames';
import style from './style.css';

class ButtonBox extends Component {
  render({ button }) {
    return (
      <div class="col-1">
        <div title={button.name} class={cx('text-center', style.iconDiv)}>
          <label class={style.iconLabel}>
            <i class={`fe fe-${button.icon}`} />
          </label>
        </div>
      </div>
    );
  }
}

export default ButtonBox;
