import { Component } from 'preact';
import { Text } from 'preact-i18n';
import { Link } from 'preact-router/match';
import cx from 'classnames';
import RemoteCreation from './RemoteCreation';
import ButtonCreation from './ButtonCreation';
import ButtonPlacement from './ButtonPlacement';
import { route } from 'preact-router';

class RemoteSetupTab extends Component {
  nextStep = (currentStep, props) => {
    let nextStep, readyToNext;

    switch (currentStep) {
      case 'placeButton': {
        nextStep = 'addButton';
        readyToNext = props.buttons.length > 0;
        break;
      }
      case 'addButton': {
        nextStep = 'placeButton';
        readyToNext = props.buttons.length > 0;
        break;
      }
      case 'device':
      default: {
        const hasButtons = props.buttons.length > 0;
        currentStep = 'device';
        nextStep = hasButtons ? 'placeButton' : 'addButton';
        readyToNext =
          props.device &&
          props.device.name &&
          props.device.name.length > 0 &&
          props.device.model &&
          props.device.model.length > 0;
      }
    }

    this.setState({
      currentStep,
      nextStep,
      readyToNext
    });
  };

  goToNext = () => {
    this.goTo(this.state.nextStep);
  };

  goTo = elem => {
    let { url } = this.props;
    const hashIndex = url.indexOf('#');
    if (hashIndex > 0) {
      url = url.substring(0, hashIndex);
    }
    route(url + '#' + elem, true);
  };

  componentWillReceiveProps(props) {
    const currentStep = this.getCurrentTab();
    this.nextStep(currentStep, props);
  }

  componentWillMount() {
    const currentTab = this.getCurrentTab();

    if (currentTab != 'device') {
      this.goTo('device');
    } else {
      this.nextStep(currentTab, this.props);
    }
  }

  getCurrentTab() {
    let urlHash = window.location.hash;
    if (urlHash.length > 0 && urlHash.startsWith('#')) {
      urlHash = urlHash.split('#')[1];
    } else {
      urlHash = 'device';
    }

    return urlHash;
  }

  constructor(props) {
    super(props);

    this.nextStep = this.nextStep.bind(this);
    this.goTo = this.goTo.bind(this);
    this.goToNext = this.goToNext.bind(this);
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

              {props.device && (
                <ul class="nav nav-tabs nav-justified mb-5" role="tablist">
                  <li class="nav-item" id="device">
                    <a
                      class={cx('nav-link mx-auto', {
                        active: state.currentStep === 'device',
                        disabled: !state.readyToNext && state.currentStep !== 'device'
                      })}
                      onClick={() => this.goTo('device')}
                    >
                      <Text id="integration.broadlink.setup.remoteCreation" />
                    </a>
                  </li>
                  <li class="nav-item" id="addButton">
                    <a
                      class={cx('nav-link mx-auto', {
                        active: state.currentStep === 'addButton',
                        disabled: !state.readyToNext && state.currentStep !== 'addButton'
                      })}
                      onClick={() => this.goTo('addButton')}
                    >
                      <Text id="integration.broadlink.setup.buttonCreation" />
                    </a>
                  </li>
                  <li class="nav-item" id="placeButton">
                    <a
                      class={cx('nav-link mx-auto', {
                        active: state.currentStep === 'placeButton',
                        disabled: !state.readyToNext && state.currentStep !== 'placeButton'
                      })}
                      onClick={() => this.goTo('placeButton')}
                    >
                      <Text id="integration.broadlink.setup.buttonPlacementTitle" />
                    </a>
                  </li>
                </ul>
              )}

              {props.device && state.currentStep === 'device' && <RemoteCreation {...props} {...state} />}

              {props.device && state.currentStep === 'addButton' && <ButtonCreation {...props} {...state} />}

              {props.device && state.currentStep === 'placeButton' && <ButtonPlacement {...props} {...state} />}

              {props.device && (
                <div class="form-group">
                  <Link href="/dashboard/integration/device/broadlink" class="mr-2">
                    <button class="btn btn-danger">
                      <Text id="integration.broadlink.setup.cancel" />
                    </button>
                  </Link>
                  <button
                    onClick={props.saveDevice}
                    disabled={props.buttons.filter(button => button.position).length === 0}
                    class="btn btn-success mr-2"
                  >
                    <Text id="integration.broadlink.setup.saveButton" />
                  </button>
                  {state.nextStep && (
                    <button
                      onClick={this.goToNext}
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
