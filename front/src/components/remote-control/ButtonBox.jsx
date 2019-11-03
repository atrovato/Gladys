import { Text, Localizer } from 'preact-i18n';
import cx from 'classnames';
import style from './style.css';

const buttonClick = (onClickFunc, featureName) => {
  if (onClickFunc) {
    onClickFunc(featureName);
  }
};

const ButtonBox = ({ category, featureName, buttonProps, onClick, editionMode, edited }) => {
  const { icon, text, customIconStyle, buttonClass } = buttonProps || { text: ' ' };

  if (!buttonProps || (!icon && (!text || text.length > 1))) {
    return null;
  }

  return (
    <Localizer>
      <button
        class={cx('btn', buttonClass, style.iconDiv, {
          [style.editionMode]: editionMode && !edited
        })}
        onClick={() => buttonClick(onClick, featureName)}
        title={<Text id={`deviceFeatureCategory.${category}.${featureName}`}>{featureName}</Text>}
      >
        <i
          class={cx('fe', {
            [`fe-${icon}`]: icon,
            [style['textued-fe']]: text
          })}
          style={customIconStyle}
        >
          {!icon && text}
        </i>
      </button>
    </Localizer>
  );
};

export default ButtonBox;
