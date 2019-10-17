import { Text, Localizer } from 'preact-i18n';
import { Component } from 'preact';
import NotPlacedButtonBox from './NotPlacedButtonBox';
import cx from 'classnames';
import style from './style.css';
import DropTarget from '../../../../../../components/drag-and-drop/DropTarget';
import ButtonBox from './ButtonBox';
import Draggable from '../../../../../../components/drag-and-drop/Draggable';

class ButtonPlacement extends Component {
  placeButton(button, x, y) {
    const position = {
      x,
      y
    };

    this.props.updateButton({ ...button, position });
  }

  onDragStop() {
    this.setState({
      dragData: undefined
    });
  }

  onDragStart(data) {
    this.setState({
      dragData: data
    });
  }

  updateGridSize(props, resize = false) {
    const { buttons } = props;
    let nbColumn = !resize ? this.state.nbColumn || 1 : 1;
    let nbRow = !resize ? this.state.nbRow || 1 : 1;

    buttons.forEach(button => {
      const { position } = button;
      if (position) {
        nbColumn = Math.max(nbColumn, position.x + 1);
        nbRow = Math.max(nbRow, position.y + 1);
      }
    });

    return {
      nbColumn,
      nbRow
    };
  }

  addRow() {
    this.setState({
      nbColumn: this.state.nbColumn + 1
    });
  }

  addColumn() {
    this.setState({
      nbRow: this.state.nbRow + 1
    });
  }

  resize() {
    const { nbColumn, nbRow } = this.updateGridSize(this.props, true);
    this.setState({
      nbColumn,
      nbRow
    });
  }

  constructor(props) {
    super(props);

    this.state = this.updateGridSize(props);

    this.onDragStop = this.onDragStop.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.updateGridSize = this.updateGridSize.bind(this);
    this.addColumn = this.addColumn.bind(this);
    this.addRow = this.addRow.bind(this);
    this.resize = this.resize.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { nbColumn, nbRow } = this.updateGridSize(nextProps);

    if (nbColumn !== this.state.nbColumn || nbRow !== this.state.nbRow) {
      this.setState({
        nbColumn,
        nbRow
      });
    }
  }

  render(props, state) {
    const remoteGrid = [];
    for (let i = 0; i < state.nbRow; i++) {
      const line = [];
      for (let j = 0; j < state.nbColumn; j++) {
        line.push({
          line: i,
          column: j
        });
      }
      remoteGrid.push(line);
    }

    const notPlacedButtons = [];
    props.buttons.forEach(button => {
      const { position } = button;
      if (position) {
        remoteGrid[position.y][position.x].button = button;
      } else {
        notPlacedButtons.push(button);
      }
    });

    return (
      <div>
        <div class="form-group">
          <label class="form-label">
            <Text id="integration.broadlink.setup.buttonNotPlacedTitle" />
          </label>

          <NotPlacedButtonBox
            {...props}
            buttons={notPlacedButtons}
            selectButton={this.selectButton}
            onDragStop={this.onDragStop}
            onDragStart={this.onDragStart}
            dragData={state.dragData}
          />
        </div>

        <div class="form-group">
          <label class="form-label">
            <Text id="integration.broadlink.setup.remoteGrid" />
          </label>

          <div class="d-inline-flex flex-column mw-100">
            <div class={cx('d-flex align-content-start', style.remoteGrid)}>
              {remoteGrid.map((line, y) => (
                <div>
                  {line.map((column, x) => (
                    <div class={style.gridCell}>
                      {!column.button && (
                        <DropTarget
                          onDropData={button => this.placeButton(button, x, y)}
                          dropTargetActiveClass={style.dropTargetActive}
                          currentDragItem={state.dragData}
                          accepts={['REMOTE_BUTTON']}
                        >
                          <ButtonBox {...props} />
                        </DropTarget>
                      )}
                      {column.button && (
                        <Draggable
                          allowLayer={true}
                          onDragStop={this.onDragStop}
                          onDragStart={this.onDragStart}
                          dragData={column.button}
                        >
                          <ButtonBox {...props} button={column.button} />
                        </Draggable>
                      )}
                    </div>
                  ))}
                </div>
              ))}
              <Localizer>
                <button
                  title={<Text id="integration.broadlink.setup.addColumn" />}
                  onClick={this.addColumn}
                  class="btn btn-outline-secondary btn-sm mt-1 mb-1 p-1 ml-2"
                >
                  <i class="fe fe-chevron-right" />
                </button>
              </Localizer>
            </div>
            <div class="d-inline-flex flex-column">
              <div class="d-flex">
                <Localizer>
                  <button
                    title={<Text id="integration.broadlink.setup.addRow" />}
                    onClick={this.addRow}
                    class="btn btn-outline-secondary btn-sm btn-block mt-1 mb-1 p-1 ml-1 mr-1"
                  >
                    <i class="fe fe-chevron-down" />
                  </button>
                </Localizer>
                <Localizer>
                  <button
                    title={<Text id="integration.broadlink.setup.resize" />}
                    onClick={this.resize}
                    class="btn btn-outline-secondary btn-sm mt-1 mb-1 p-1 ml-2"
                  >
                    <i class="fe fe-minimize" />
                  </button>
                </Localizer>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ButtonPlacement;
