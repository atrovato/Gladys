import { Text } from 'preact-i18n';
import { RemoteCategories } from '../../utils/remote-control';

const updateType = updateRemoteTypeFunc => e => {
  const { value } = e.target;
  updateRemoteTypeFunc(value, { ...RemoteCategories[value] });
};

const RemoteControlSelector = ({ updateRemoteTypeAndButtons, remoteType }) => (
  <div class="form-group">
    <label class="form-label" for="remoteType">
      <Text id="remoteControl.creation.selectTypeLabel" />
    </label>
    <select id="remoteType" onChange={updateType(updateRemoteTypeAndButtons)} class="form-control">
      <option value="">
        <Text id="global.emptySelectOption" />
      </option>
      {Object.keys(RemoteCategories).map(category => (
        <option selected={category === remoteType} value={category}>
          <Text id={`deviceCategory.${category}`}>{category}</Text>
        </option>
      ))}
    </select>
  </div>
);

export default RemoteControlSelector;
