import { DEVICE_FEATURE_CATEGORIES, DEVICE_FEATURE_TYPES } from '../../../../../../server/utils/constants';
import ButtonBox from '../../ButtonBox';
import ButtonOptions from './television';

const renderButton = (featureName, onClick) => (
  <ButtonBox
    category={DEVICE_FEATURE_CATEGORIES.TELEVISION}
    featureName={featureName}
    buttonProps={ButtonOptions[featureName]}
    onClick={onClick}
  />
);

const TelevisionRemoteBox = ({ onClick }) => (
  <div>
    <div class="d-flex">
      {renderButton(DEVICE_FEATURE_TYPES.TELEVISION.POWER_BUTTON, onClick)}
      <div class="flex-fill" />
      {renderButton(DEVICE_FEATURE_TYPES.TELEVISION.SOURCE_BUTTON, onClick)}
    </div>

    <div class="d-flex btn-group mt-3">
      {renderButton(DEVICE_FEATURE_TYPES.TELEVISION.CHANNEL_1_BUTTON, onClick)}
      {renderButton(DEVICE_FEATURE_TYPES.TELEVISION.CHANNEL_2_BUTTON, onClick)}
      {renderButton(DEVICE_FEATURE_TYPES.TELEVISION.CHANNEL_3_BUTTON, onClick)}
    </div>
    <div class="d-flex btn-group mt-2">
      {renderButton(DEVICE_FEATURE_TYPES.TELEVISION.CHANNEL_4_BUTTON, onClick)}
      {renderButton(DEVICE_FEATURE_TYPES.TELEVISION.CHANNEL_5_BUTTON, onClick)}
      {renderButton(DEVICE_FEATURE_TYPES.TELEVISION.CHANNEL_6_BUTTON, onClick)}
    </div>
    <div class="d-flex btn-group mt-2">
      {renderButton(DEVICE_FEATURE_TYPES.TELEVISION.CHANNEL_7_BUTTON, onClick)}
      {renderButton(DEVICE_FEATURE_TYPES.TELEVISION.CHANNEL_8_BUTTON, onClick)}
      {renderButton(DEVICE_FEATURE_TYPES.TELEVISION.CHANNEL_9_BUTTON, onClick)}
    </div>
    <div class="d-flex btn-group mt-2">
      {renderButton(DEVICE_FEATURE_TYPES.TELEVISION.GUIDE_BUTTON, onClick)}
      {renderButton(DEVICE_FEATURE_TYPES.TELEVISION.CHANNEL_0_BUTTON, onClick)}
      {renderButton(DEVICE_FEATURE_TYPES.TELEVISION.MENU_BUTTON, onClick)}
    </div>

    <div class="d-flex mt-3">
      <div class="flex-fill" />
      <div class="btn-group-vertical flex-fill">
        {renderButton(DEVICE_FEATURE_TYPES.TELEVISION.VOLUME_UP_BUTTON, onClick)}
        {renderButton(DEVICE_FEATURE_TYPES.TELEVISION.VOLUME_MUTE_BUTTON, onClick)}
        {renderButton(DEVICE_FEATURE_TYPES.TELEVISION.VOLUME_DOWN_BUTTON, onClick)}
      </div>
      <div class="flex-fill" />
      <div class="btn-group-vertical flex-fill">
        {renderButton(DEVICE_FEATURE_TYPES.TELEVISION.CHANNEL_UP_BUTTON, onClick)}
        {renderButton(DEVICE_FEATURE_TYPES.TELEVISION.CHANNEL_PREVIOUS_BUTTON, onClick)}
        {renderButton(DEVICE_FEATURE_TYPES.TELEVISION.CHANNEL_DOWN_BUTTON, onClick)}
      </div>
      <div class="flex-fill" />
    </div>

    <div class="d-flex justify-content-between mt-3">
      <div class="d-flex flex-column align-items-start">
        <div class="mb-auto">{renderButton(DEVICE_FEATURE_TYPES.TELEVISION.TOOLS_BUTTON, onClick)}</div>
        <div>{renderButton(DEVICE_FEATURE_TYPES.TELEVISION.RETURN_BUTTON, onClick)}</div>
      </div>

      <div class="rounded-circle bg-secondary">
        <div class="d-flex justify-content-center">
          {renderButton(DEVICE_FEATURE_TYPES.TELEVISION.UP_BUTTON, onClick)}
        </div>
        <div class="d-flex justify-content-between">
          {renderButton(DEVICE_FEATURE_TYPES.TELEVISION.LEFT_BUTTON, onClick)}
          {renderButton(DEVICE_FEATURE_TYPES.TELEVISION.ENTER_BUTTON, onClick)}
          {renderButton(DEVICE_FEATURE_TYPES.TELEVISION.RIGHT_BUTTON, onClick)}
        </div>
        <div class="d-flex justify-content-center">
          {renderButton(DEVICE_FEATURE_TYPES.TELEVISION.DOWN_BUTTON, onClick)}
        </div>
      </div>

      <div class="d-flex flex-column align-items-start">
        <div class="mb-auto">{renderButton(DEVICE_FEATURE_TYPES.TELEVISION.INFO_BUTTON, onClick)}</div>
        <div>{renderButton(DEVICE_FEATURE_TYPES.TELEVISION.EXIT_BUTTON, onClick)}</div>
      </div>
    </div>

    <div class="d-flex btn-group mt-3">
      {renderButton(DEVICE_FEATURE_TYPES.TELEVISION.RED_BUTTON, onClick)}
      {renderButton(DEVICE_FEATURE_TYPES.TELEVISION.GREEN_BUTTON, onClick)}
      {renderButton(DEVICE_FEATURE_TYPES.TELEVISION.YELLOW_BUTTON, onClick)}
      {renderButton(DEVICE_FEATURE_TYPES.TELEVISION.BLUE_BUTTON, onClick)}
    </div>

    <div class="d-flex btn-group mt-3">
      {renderButton(DEVICE_FEATURE_TYPES.TELEVISION.REWIND_BUTTON, onClick)}
      {renderButton(DEVICE_FEATURE_TYPES.TELEVISION.PAUSE_BUTTON, onClick)}
      {renderButton(DEVICE_FEATURE_TYPES.TELEVISION.FORWARD_BUTTON, onClick)}
    </div>
    <div class="d-flex btn-group mt-2">
      {renderButton(DEVICE_FEATURE_TYPES.TELEVISION.RECORD_BUTTON, onClick)}
      {renderButton(DEVICE_FEATURE_TYPES.TELEVISION.PLAY_BUTTON, onClick)}
      {renderButton(DEVICE_FEATURE_TYPES.TELEVISION.STOP_BUTTON, onClick)}
    </div>
  </div>
);

export default TelevisionRemoteBox;
