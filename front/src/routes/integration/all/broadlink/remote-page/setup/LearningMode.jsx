import { Component } from 'preact';
import { Text } from 'preact-i18n';
import { WEBSOCKET_MESSAGE_TYPES } from '../../../../../../../../server/utils/constants';

class LearningMode extends Component {
  activateLearnMode = async e => {
    this.setState({
      active: true
    });

    try {
      await this.props.httpClient.post('/api/v1/service/broadlink/learn', {
        peripheral: this.props.selectedModel.mac
      });
    } catch (e) {
      this.setState({
        active: false,
        errorKey: 'integration.broadlink.setup.learnFailed'
      });
    }
  };

  cancelLearnMode = async e => {
    try {
      await this.props.httpClient.post('/api/v1/service/broadlink/learn/cancel', {
        peripheral: this.props.selectedModel.mac
      });
    } catch (e) {
      this.setState({
        errorKey: 'integration.broadlink.setup.cancelLearnFailed'
      });
    }
  };

  constructor(props) {
    super(props);

    this.state = {
      active: false
    };

    this.activateLearnMode = this.activateLearnMode.bind(this);
    this.cancelLearnMode = this.cancelLearnMode.bind(this);
  }

  componentWillMount() {
    const { session, storeButtonCode } = this.props;
    session.dispatcher.addListener(WEBSOCKET_MESSAGE_TYPES.BROADLINK.NO_PERIPHERAL, payload => {
      if (payload.action === 'learnMode') {
        this.setState({
          errorKey: 'integration.broadlink.setup.peripheralNotFound',
          active: false
        });
      }
    });

    // Entering learn mode
    session.dispatcher.addListener(WEBSOCKET_MESSAGE_TYPES.BROADLINK.LEARN_MODE_ERROR, () =>
      this.setState({
        errorKey: 'integration.broadlink.setup.peripheralNotLearn',
        active: false
      })
    );
    session.dispatcher.addListener(WEBSOCKET_MESSAGE_TYPES.BROADLINK.LEARN_MODE_SUCCESS, payload => {
      this.setState({
        errorKey: null,
        active: false
      });

      storeButtonCode(payload.code);
    });

    // Cancel learn mode
    session.dispatcher.addListener(WEBSOCKET_MESSAGE_TYPES.BROADLINK.CANCEL_LEARN_MODE_ERROR, () =>
      this.setState({
        errorKey: 'integration.broadlink.setup.cancelLearnFailed'
      })
    );
    session.dispatcher.addListener(WEBSOCKET_MESSAGE_TYPES.BROADLINK.CANCEL_LEARN_MODE_SUCCESS, () => {
      this.setState({
        errorKey: null,
        active: false
      });
    });
  }

  render({}, state) {
    return (
      <div class="mt-5">
        <div class="text-center">
          {state.active && (
            <button onClick={this.cancelLearnMode} class="btn btn-outline-secondary btn-sm">
              {<Text id="integration.broadlink.setup.learningModeInProgress" />}
            </button>
          )}
          {!state.active && (
            <button onClick={this.activateLearnMode} class="btn btn-outline-primary btn-sm">
              {<Text id="integration.broadlink.setup.learnModeTitle" />}
            </button>
          )}

          {state.errorKey && (
            <div class="alert alert-danger mt-3">
              <Text id={state.errorKey} />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default LearningMode;
