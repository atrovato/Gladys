const { PARAMS } = require('../../../bluetooth/lib/utils/bluetooth.constants');

const getModelData = (device) => {
  const { model = '', params = [] } = device || {};

  const awoxDevice = params.find((p) => p.name === PARAMS.MANUFACTURER && p.value.toLowerCase() === 'awox');

  const deviceModel = awoxDevice ? model.toLowerCase() : '';
  const [deviceClass, deviceType = ''] = deviceModel.split(/[-_]/);

  const remote = deviceModel.startsWith('rcu');
  const mesh = deviceClass.endsWith('m');
  const color = deviceType.startsWith('c');
  const white = deviceType.startsWith('w');

  return { remote, mesh, color, white };
};

module.exports = {
  getModelData,
};
