const { colorSettingTrait } = require('./colorSetting.trait');
const { brightnessTrait } = require('./brightness.trait');
const { onOffTrait } = require('./on_off.trait');

const TRAITS = [brightnessTrait, colorSettingTrait, onOffTrait];

const TRAIT_BY_COMMAND = {};
TRAITS.forEach((trait) => {
  Object.keys(trait.commands).forEach((commandKey) => {
    TRAIT_BY_COMMAND[commandKey] = trait;
  });
});

module.exports = {
  TRAITS,
  TRAIT_BY_COMMAND,
};
