import { Text } from 'preact-i18n';
import { Component } from 'preact';
import ButtonBox from './ButtonBox';
import Draggable from '../../../../../../components/drag-and-drop/Draggable';
import DropTarget from '../../../../../../components/drag-and-drop/DropTarget';
import style from './style.css';

class NotPlacedButtonBox extends Component {
  unplaceButton(button) {
    const updatedButton = { ...button };
    delete updatedButton.position;

    this.props.updateButton(updatedButton);
  }

  removeButton(button) {
    this.props.deleteButton(button);
  }

  onDragStop() {
    if (this.props.onDragStop) {
      this.props.onDragStop();
    } else {
      this.setState({
        dragData: undefined
      });
    }
  }

  onDragStart(data) {
    if (this.props.onDragStart) {
      this.props.onDragStart(data);
    } else {
      this.setState({
        dragData: data
      });
    }
  }

  constructor(props) {
    super(props);

    this.onDragStart = this.onDragStart.bind(this);
    this.onDragStop = this.onDragStop.bind(this);
    this.removeButton = this.removeButton.bind(this);
    this.unplaceButton = this.unplaceButton.bind(this);
  }

  render(props, state) {
    const dragData = props.dragData || state.dragData;

    return (
      <div class="d-flex justify-content-between btn-group">
        <DropTarget
          onDropData={this.unplaceButton}
          dropTargetClass={`flex-fill d-flex border align-content-start flex-wrap ${style.iconContainer} ${
            style.iconContainerSmall
          }`}
          dropTargetActiveClass="bg-light"
          currentDragItem={dragData}
          accepts={['REMOTE_BUTTON']}
        >
          {props.buttons.map(button => (
            <Draggable allowLayer={true} onDragStop={this.onDragStop} onDragStart={this.onDragStart} dragData={button}>
              <ButtonBox {...props} button={button} />
            </Draggable>
          ))}
        </DropTarget>
        <DropTarget
          onDropData={this.removeButton}
          dropTargetClass={`btn btn-danger d-flex align-items-center px-5 ${style.iconTrash}`}
          dropTargetDisabledClass="disabled"
          currentDragItem={dragData}
          accepts={['REMOTE_BUTTON']}
        >
          <i class="fe fe-trash-2" />
        </DropTarget>
      </div>
    );
  }
}

export default NotPlacedButtonBox;
