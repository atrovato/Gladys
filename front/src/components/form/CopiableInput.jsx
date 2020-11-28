import { Component } from 'preact';
import { RequestStatus } from '../../utils/consts';

class CopiableInput extends Component {
  copy = async () => {
    try {
      this.setState({ copyStatus: RequestStatus.Getting });
      await navigator.clipboard.writeText(this.props.value);
      this.setState({ copyStatus: RequestStatus.Success });
      setTimeout(() => this.setState({ copyStatus: null }), 2000);
    } catch (e) {
      this.setState({ copyStatus: RequestStatus.Error });
    }
  };

  render(props, { copyStatus }) {
    return (
      <div class="input-icon mb-3">
        <input {...props} />
        {!copyStatus && (
          <span class="input-icon-addon cursor-pointer" onClick={this.copy}>
            <i class="fe fe-copy" />
          </span>
        )}
        {copyStatus === RequestStatus.Success && (
          <span class="input-icon-addon cursor-pointer text-green" onClick={this.copy}>
            <i class="fe fe-check" />
          </span>
        )}
        {copyStatus === RequestStatus.Error && (
          <span class="input-icon-addon cursor-pointer text-red" onClick={this.copy}>
            <i class="fe fe-x" />
          </span>
        )}
        {copyStatus === RequestStatus.Getting && (
          <span class="input-icon-addon">
            <button
              type="button"
              class="btn btn-secondary btn-transparent btn-loading btn-block border-0 mr-1"
              disabled
            >
              {' '}
            </button>
          </span>
        )}
      </div>
    );
  }
}

export default CopiableInput;
