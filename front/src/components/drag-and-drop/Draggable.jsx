import { Component } from 'preact-compat';
import cx from 'classnames';
import interact from 'interactjs';

/**
 * This component supposes to be draggable.
 *
 * Required props:
 * - {Object} dragData - Current dragged object.
 * - {Function} onDragStart - Action to execute when starts dragging.
 * - {Function} onDragStop - Action to execute when stops dragging.
 *
 * Optional props:
 * - {boolean} allowLayer - Indicates if a clone show be visible at original place when dragging (default=false).
 * - {String} draggableClass - Class(es) to add to current component.
 * - {String} draggingClass - Class(es) to add when dragging.
 */
class Draggable extends Component {
  componentDidMount() {
    const domNode = this.getDOMNode();
    const interaction = interact(domNode);
    interaction.draggable({
      inertia: true,
      autoScroll: true,
      onstart: event => {
        this.setState({
          originX: event.pageX,
          originY: event.pageY
        });
      },
      onmove: event => {
        const deltaX = Math.round(event.pageX - this.state.originX);
        const deltaY = Math.round(event.pageY - this.state.originY);

        if (!this.state.dragging) {
          this.setState({
            dragging: true
          });

          this.props.onDragStart(this.props.dragData);
        }

        if (this.state.dragging) {
          this.setState({
            left: this.state.elementX + deltaX,
            top: this.state.elementY + deltaY
          });
        }
      },
      onend: () => {
        this.props.onDragStop();

        this.setState({
          dragging: false
        });
      }
    });

    this.setState({
      interaction,
      elementX: domNode.offsetLeft,
      elementY: domNode.offsetTop
    });
  }

  componentWillUnmount() {
    this.state.interaction.unset();
  }

  render(props, state) {
    const style = {};
    let clone;
    if (state.dragging) {
      style.left = state.left;
      style.top = state.top;

      if (props.allowLayer) {
        clone = <div class="draggableLayer">{props.children}</div>;
      }
    }

    return (
      <div>
        {clone}
        <div
          class={cx('draggableItem', {
            [props.draggableClass]: props.draggableClass,
            dragging: state.dragging,
            [props.draggingClass]: state.dragging && props.draggingClass
          })}
          style={style}
        >
          {props.children}
        </div>
      </div>
    );
  }
}

export default Draggable;
