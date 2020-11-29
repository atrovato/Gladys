const { PARAMS } = require('../../../bluetooth/lib/utils/bluetooth.constants');

const getModelData = (device) => {
  const { model = '', params = [], name = '' } = device || {};

  const awoxManufacturer = params.find(
    (p) => p.name === PARAMS.MANUFACTURER_DATA && p.value.toLowerCase().startsWith('6001'),
  );

  const deviceModel = model.toLowerCase() || name.toLowerCase();
  const awoxModel = deviceModel.startsWith('sml');
  const [deviceClass, deviceType = ''] = deviceModel.split(/[-_]/);

  const remote = deviceModel.startsWith('rcu');
  const mesh = deviceClass.endsWith('m');
  const color = deviceType.startsWith('c');
  const white = deviceType.startsWith('w');

  const awox = awoxManufacturer || awoxModel;
  return { awox, remote, mesh, color, white };
};

module.exports = {
  getModelData,
};
