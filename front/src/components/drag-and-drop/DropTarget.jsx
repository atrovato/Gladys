import { Component } from 'preact-compat';
import cx from 'classnames';
import interact from 'interactjs';

/**
 * This component supposes to accept Draggable components.
 *
 * Required props:
 * - {Function} onDropData - Action to execute on drop element on this.
 * - {Object} currentItem - Current dragged object.
 * - {Array} accepts - List of accepted object (reads 'type' attribute of the currentItem).
 *
 * Optional props:
 * - {String} dropTargetClass - Class(es) to use for this component.
 * - {String} dropTargetDisabledClass - Class(es) to use when drop is not active, not dragging.
 * - {String} dropTargetActiveClass - Class(es) to use when draggable can be dropped.
 * - {String} dropTargetInactiveClass - Class(es) to use when draggable can't be dropped.
 */
class DropTarget extends Component {
  active(props) {
    return props.currentDragItem && props.accepts.includes(props.currentDragItem.type);
  }

  inactive(props) {
    return props.currentDragItem && !props.accepts.includes(props.currentDragItem.type);
  }

  componentWillReceiveProps(nextProps) {
    const newActivatedState = this.active(nextProps);
    const newInactivatedState = this.inactive(nextProps);

    if (newActivatedState !== this.state.activated || newInactivatedState !== this.state.inactive) {
      this.setState({
        activated: newActivatedState,
        inactive: newInactivatedState,
        currentDragItem: nextProps.currentDragItem
      });
    }
  }

  componentDidMount() {
    const domNode = this.getDOMNode();
    const interaction = interact(domNode);
    interaction.dropzone({
      ondrop: () => {
        if (this.state.currentDragItem) {
          this.props.onDropData(this.state.currentDragItem);
        }
      }
    });

    this.setState({
      interaction
    });
  }

  componentWillUnmount() {
    this.state.interaction.unset();
  }

  render(props, state) {
    const active = state.activated;
    const inactive = state.inactive;

    return (
      <div
        class={cx('dropTarget', {
          [props.dropTargetClass]: props.dropTargetClass,
          [props.dropTargetDisabledClass]: props.dropTargetDisabledClass && !active,
          dropTargetActive: active,
          [props.dropTargetActiveClass]: active && props.dropTargetActiveClass,
          dropTargetInactive: inactive,
          [props.dropTargetInactiveClass]: inactive && props.dropTargetInactiveClass
        })}
      >
        {props.children}
      </div>
    );
  }
}

export default DropTarget;
