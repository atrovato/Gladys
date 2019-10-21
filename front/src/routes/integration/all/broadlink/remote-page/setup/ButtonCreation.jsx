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

  componentWillReceiveProps(props) {
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
      <div>
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
          <div class="d-flex justify-content-between btn-group">
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
            <button
              onClick={e => props.testButton(this.props.buttonCreation)}
              disabled={!this.props.buttonCreation.code || this.props.buttonCreation.code.length === 0}
              class={`btn btn-primary d-flex align-items-center px-5 ${style.iconTrash}`}
            >
              <i class="fe fe-play" />
            </button>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">
            <Text id="integration.broadlink.setup.buttonIconLabel" />
          </label>
          <div class={cx('flex-fill d-flex border align-content-start flex-wrap', style.iconContainer)}>
            {iconList.map(icon => (
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
            ))}
          </div>

          <div class="mt-5">
            <div class="text-center">
              <button onClick={props.createPendingButton} disabled={!state.activeSave} class="btn btn-success">
                <Text id="integration.broadlink.setup.addButtonLabel" />
              </button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">
              <Text id="integration.broadlink.setup.existingButtons" />
            </label>
            <NotPlacedButtonBox {...props} />
          </div>
        </div>
      </div>
    );
  }
}

export default ButtonCreation;
