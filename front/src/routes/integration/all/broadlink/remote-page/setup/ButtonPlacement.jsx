import { Text } from 'preact-i18n';
import { Component } from 'preact';
import cx from 'classnames';
import NotPlacedButtonBox from './NotPlacedButtonBox';
import style from './style.css';

class ButtonPlacement extends Component {
  render(props) {
    const remoteGrid = [];
    for (let i = 0; i < 5; i++) {
      const line = [];
      for (let j = 0; j < 3; j++) {
        line.push({
          line: i,
          column: j
        });
      }
      remoteGrid.push(line);
    }

    return (
      <fieldset class="form-group">
        <legend>
          <Text id="integration.broadlink.setup.buttonPlacementTitle" />
        </legend>

        <NotPlacedButtonBox {...props} selectButton={this.selectButton} />

        <div class="form-group">
          <label class="form-label">
            <Text id="integration.broadlink.setup.remoteGrid" />
          </label>

          {remoteGrid.map(line => (
            <div class="row">
              {line.map(column => (
                <div class={cx('col-1', style.gridCell)}>
                  <div class={cx('text-center', style.iconDiv)}>
                    <label class={style.iconLabel}>&nbsp;</label>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </fieldset>
    );
  }
}

export default ButtonPlacement;
