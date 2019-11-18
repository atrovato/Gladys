import { DEVICE_FEATURE_TYPES } from '../../../../../../server/utils/constants';
import style from './style.css';

export default {
  [DEVICE_FEATURE_TYPES.LIGHT.POWER_ON_BUTTON]: {
    icon: 'power',
    buttonClass: 'btn-success flex-fill'
  },
  [DEVICE_FEATURE_TYPES.LIGHT.POWER_OFF_BUTTON]: {
    icon: 'power',
    buttonClass: 'btn-danger flex-fill'
  },
  [DEVICE_FEATURE_TYPES.LIGHT.BRIGHTER_BUTTON]: {
    icon: 'sun',
    buttonClass: 'btn-secondary flex-fill'
  },
  [DEVICE_FEATURE_TYPES.LIGHT.DIMMER_BUTTON]: {
    icon: 'moon',
    buttonClass: 'btn-secondary flex-fill'
  },
  [DEVICE_FEATURE_TYPES.LIGHT.RED_BUTTON]: {
    text: 'R',
    buttonClass: 'btn-red flex-fill'
  },
  [DEVICE_FEATURE_TYPES.LIGHT.RED_LIGHT_BUTTON]: {
    icon: 'minus',
    buttonClass: `${style['btn-red-light']} flex-fill`
  },
  [DEVICE_FEATURE_TYPES.LIGHT.ORANGE_DARK_BUTTON]: {
    icon: 'minus',
    buttonClass: `${style['btn-orange-dark']} flex-fill`
  },
  [DEVICE_FEATURE_TYPES.LIGHT.ORANGE_BUTTON]: {
    icon: 'minus',
    buttonClass: 'btn-orange flex-fill'
  },
  [DEVICE_FEATURE_TYPES.LIGHT.YELLOW_BUTTON]: {
    icon: 'minus',
    buttonClass: 'btn-yellow flex-fill'
  },
  [DEVICE_FEATURE_TYPES.LIGHT.GREEN_BUTTON]: {
    text: 'G',
    buttonClass: 'btn-green flex-fill'
  },
  [DEVICE_FEATURE_TYPES.LIGHT.LIME_BUTTON]: {
    icon: 'minus',
    buttonClass: 'btn-lime flex-fill'
  },
  [DEVICE_FEATURE_TYPES.LIGHT.TEAL_BUTTON]: {
    icon: 'minus',
    buttonClass: 'btn-teal flex-fill'
  },
  [DEVICE_FEATURE_TYPES.LIGHT.CYAN_BUTTON]: {
    icon: 'minus',
    buttonClass: 'btn-cyan flex-fill'
  },
  [DEVICE_FEATURE_TYPES.LIGHT.AZURE_BUTTON]: {
    icon: 'minus',
    buttonClass: 'btn-azure flex-fill'
  },
  [DEVICE_FEATURE_TYPES.LIGHT.BLUE_BUTTON]: {
    text: 'B',
    buttonClass: 'btn-primary flex-fill'
  },
  [DEVICE_FEATURE_TYPES.LIGHT.NIGHT_BUTTON]: {
    icon: 'minus',
    buttonClass: `${style['btn-night']} flex-fill`
  },
  [DEVICE_FEATURE_TYPES.LIGHT.INDIGO_BUTTON]: {
    icon: 'minus',
    buttonClass: 'btn-indigo flex-fill'
  },
  [DEVICE_FEATURE_TYPES.LIGHT.PURPLE_BUTTON]: {
    icon: 'minus',
    buttonClass: 'btn-purple flex-fill'
  },
  [DEVICE_FEATURE_TYPES.LIGHT.PINK_BUTTON]: {
    icon: 'minus',
    buttonClass: 'btn-pink flex-fill'
  },
  [DEVICE_FEATURE_TYPES.LIGHT.WHITE_BUTTON]: {
    text: 'W',
    buttonClass: 'btn-white flex-fill'
  },
  [DEVICE_FEATURE_TYPES.LIGHT.FLASH_BUTTON]: {
    icon: 'fast-forward',
    buttonClass: `${style['btn-rainbow']} flex-fill`
  },
  [DEVICE_FEATURE_TYPES.LIGHT.STROBE_BUTTON]: {
    icon: 'play',
    buttonClass: `${style['btn-gradient-night']} flex-fill`
  },
  [DEVICE_FEATURE_TYPES.LIGHT.FADE_BUTTON]: {
    icon: 'play',
    buttonClass: `${style['btn-rainbow']} flex-fill`
  },
  [DEVICE_FEATURE_TYPES.LIGHT.SMOOTH_BUTTON]: {
    icon: 'fast-forward',
    buttonClass: `${style['btn-rainbow-rgb']} flex-fill`
  }
};
