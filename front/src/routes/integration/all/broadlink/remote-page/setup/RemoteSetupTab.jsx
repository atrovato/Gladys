import { Component } from 'preact';
import { Text } from 'preact-i18n';
import { Link } from 'preact-router/match';
import cx from 'classnames';
import RemoteCreation from './RemoteCreation';
import ButtonCreation from './ButtonCreation';
import ButtonPlacement from './ButtonPlacement';

class RemoteSetupTab extends Component {
  stepDone = () => {
    this.setState({
      readyToNext: true
    });
  };

  nextStep = () => {
    let currentStep, nextStep;

    switch (this.state.currentStep) {
      case 'addButton': {
        currentStep = 'placeButton';
        nextStep = 'addButton';
        break;
      }
      case 'device': {
        const hasButtons = this.props.buttons.length > 0;
        currentStep = hasButtons ? 'placeButton' : 'addButton';
        nextStep = hasButtons ? 'addButton' : 'placeButton';
        break;
      }
      case 'placeButton':
      default: {
        currentStep = 'addButton';
        nextStep = 'placeButton';
      }
    }

    this.setState({
      currentStep,
      nextStep,
      readyToNext: false
    });
  };

  constructor(props) {
    super(props);

    this.state = {
      currentStep: 'device',
      nextStep: 'addButton'
    };

    this.nextStep = this.nextStep.bind(this);
    this.stepDone = this.stepDone.bind(this);
  }

  render(props, state) {
    return (
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">
            {(props.device && props.device.name) || <Text id="integration.broadlink.setup.noNameLabel" />}
          </h3>
        </div>
        <div
          class={cx('dimmer', {
            active: props.loading
          })}
        >
          <div class="loader" />
          <div class="dimmer-content">
            <div class="card-body">
              {props.saveStatus && (
                <div class="alert alert-danger">
                  <Text id="integration.broadlink.setup.saveError" />
                </div>
              )}
              {!props.loading && !props.device && (
                <div>
                  <p class="alert alert-danger">
                    <Text id="integration.broadlink.setup.notFound" />
                  </p>
                  <Link href="/dashboard/integration/device/broadlink">
                    <button type="button" class="btn btn-outline-secondary btn-sm">
                      <Text id="integration.broadlink.setup.backToList" />
                    </button>
                  </Link>
                </div>
              )}

              {props.device && state.currentStep === 'device' && (
                <RemoteCreation {...props} {...state} stepDone={this.stepDone} />
              )}

              {props.device && state.currentStep === 'addButton' && (
                <ButtonCreation {...props} {...state} stepDone={this.stepDone} />
              )}

              {props.device && state.currentStep === 'placeButton' && (
                <ButtonPlacement {...props} {...state} stepDone={this.stepDone} />
              )}

              {props.device && (
                <div class="form-group">
                  <Link href="/dashboard/integration/device/broadlink" class="mr-2">
                    <button class="btn btn-danger">
                      <Text id="integration.broadlink.setup.cancel" />
                    </button>
                  </Link>
                  <button onClick={props.saveDevice} disabled={props.buttons.length === 0} class="btn btn-success mr-2">
                    <Text id="integration.broadlink.setup.saveButton" />
                  </button>
                  {state.nextStep && (
                    <button
                      onClick={this.nextStep}
                      disabled={!state.readyToNext}
                      class="btn btn-primary mr-2 float-right"
                    >
                      <Text id={`integration.broadlink.setup.step.${state.nextStep}`} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RemoteSetupTab;
