import { Component } from 'preact';
import { Text, Localizer } from 'preact-i18n';
import LearningMode from './LearningMode';
import cx from 'classnames';
import iconList from '../../../../../../../../server/config/icons.json';
import style from './style.css';
import NotPlacedButtonBox from './NotPlacedButtonBox';

class ButtonCreation extends Component {
  updateButtonName = e => {
    this.props.updateButtonCreationProperty('name', e.target.value);
  };

  updateButtonCode = e => {
    this.props.updateButtonCreationProperty('code', e.target.value);
  };

  updateButtonIcon = buttonIcon => {
    this.props.updateButtonCreationProperty('icon', buttonIcon);
  };

  constructor(props) {
    super(props);

    this.updateButtonName = this.updateButtonName.bind(this);
    this.updateButtonCode = this.updateButtonCode.bind(this);
    this.updateButtonIcon = this.updateButtonIcon.bind(this);
  }

  componentWillMount() {
    if (this.props.buttons.length > 0) {
      this.props.stepDone();
    }
  }

  componentWillReceiveProps(props) {
    const { buttons, readyToNext } = props;

    if (buttons.length && !readyToNext) {
      this.props.stepDone();
    }

    const { name, code, icon } = props.buttonCreation;
    const savable = name && name.length > 0 && code && code.length > 0 && icon && icon.length > 0;
    if (savable !== this.state.activeSave) {
      this.setState({
        activeSave: savable
      });
    }
  }

  render(props, state) {
    return (
      <fieldset class="form-group">
        <legend>
          <Text id="integration.broadlink.setup.buttonCreation" />
        </legend>

        <div class="form-group">
          <label class="form-label" for="buttonName">
            <Text id="integration.broadlink.setup.buttonNameLabel" />
          </label>
          <Localizer>
            <input
              type="text"
              id="buttonName"
              value={props.buttonCreation.name}
              onInput={this.updateButtonName}
              class="form-control"
              placeholder={<Text id="integration.broadlink.setup.buttonNamePlaceholder" />}
            />
          </Localizer>
        </div>

        {props.selectedModel && props.selectedModel.canLearn && <LearningMode {...props} />}

        <div class="form-group">
          <label class="form-label" for="buttonCode">
            <Text id="integration.broadlink.setup.buttonCodeLabel" />
          </label>
          <Localizer>
            <textarea
              type="text"
              id="buttonCode"
              value={props.buttonCreation.code}
              onInput={this.updateButtonCode}
              class="form-control"
              placeholder={<Text id="integration.broadlink.setup.buttonCodePlaceholder" />}
            />
          </Localizer>
        </div>

        <div class="form-group">
          <label class="form-label">
            <Text id="integration.broadlink.setup.buttonIconLabel" />
          </label>
          <div class={cx('row', style.iconContainer)}>
            {iconList.map(icon => (
              <div class="col-1">
                <div
                  onClick={() => this.updateButtonIcon(icon)}
                  class={cx('text-center', style.iconDiv, {
                    [style.iconDivChecked]: props.buttonCreation.icon === icon
                  })}
                >
                  <label class={style.iconLabel}>
                    <input
                      name="icon"
                      type="radio"
                      checked={props.buttonCreation.icon === icon}
                      value={icon}
                      class={style.iconInput}
                    />
                    <i class={`fe fe-${icon}`} />
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div class="mt-5">
            <div class="text-center">
              <button onClick={props.createPendingButton} disabled={!state.activeSave} class="btn btn-success">
                <Text id="integration.broadlink.setup.addButtonLabel" />
              </button>
            </div>
          </div>

          {!!props.notPlacedFeatures.length && (
            <div class="form-group">
              <hr />
              <NotPlacedButtonBox {...props} />
            </div>
          )}
        </div>
      </fieldset>
    );
  }
}

export default ButtonCreation;
