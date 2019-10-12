import { Text } from 'preact-i18n';
import { Component } from 'preact';
import ButtonBox from './ButtonBox';

class NotPlacedButtonBox extends Component {
  render(props) {
    return (
      <div class="form-group">
        <label class="form-label">
          <Text id="integration.broadlink.setup.buttonNotPlacedTitle" />
        </label>

        <div class="row">
          {props.buttons.map(button => (
            <ButtonBox {...props} button={button} />
          ))}
        </div>
      </div>
    );
  }
}

export default NotPlacedButtonBox;
