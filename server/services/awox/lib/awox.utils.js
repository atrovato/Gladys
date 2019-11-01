const isRemote = (deviceModel) => {
  return deviceModel.startsWith('rcu');
};
const isMesh = (deviceModel) => {
  return deviceModel.endsWith('m');
};
const isColor = (deviceType) => {
  return deviceType.startsWith('c');
};
const isWhite = (deviceType) => {
  return deviceType.startsWith('w');
};

module.exports = {
  isRemote,
  isMesh,
  isColor,
  isWhite,
};
