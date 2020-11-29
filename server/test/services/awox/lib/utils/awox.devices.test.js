const { expect } = require('chai');

const { PARAMS } = require('../../../../../services/bluetooth/lib/utils/bluetooth.constants');
const { getModelData } = require('../../../../../services/awox/lib/utils/awox.devices');

describe('awox.devices.getModelData', () => {
  it('no device', async () => {
    const device = undefined;

    const { remote, mesh, color, white } = getModelData(device);
    expect(remote).eq(false);
    expect(mesh).eq(false);
    expect(color).eq(false);
    expect(white).eq(false);
  });

  it('no param', async () => {
    const device = {};

    const { remote, mesh, color, white } = getModelData(device);
    expect(remote).eq(false);
    expect(mesh).eq(false);
    expect(color).eq(false);
    expect(white).eq(false);
  });

  it('not awox manufacturer', async () => {
    const device = {
      params: [
        {
          name: PARAMS.MANUFACTURER,
          value: 'nut',
        },
      ],
    };

    const { remote, mesh, color, white } = getModelData(device);
    expect(remote).eq(false);
    expect(mesh).eq(false);
    expect(color).eq(false);
    expect(white).eq(false);
  });

  it('no param', async () => {
    const device = {
      params: [
        {
          name: PARAMS.MANUFACTURER,
          value: 'AwoX',
        },
      ],
    };

    const { remote, mesh, color, white } = getModelData(device);
    expect(remote).eq(false);
    expect(mesh).eq(false);
    expect(color).eq(false);
    expect(white).eq(false);
  });

  it('remote model', async () => {
    const device = {
      model: 'rcu____',
      params: [
        {
          name: PARAMS.MANUFACTURER,
          value: 'AwoX',
        },
      ],
    };

    const { remote, mesh, color, white } = getModelData(device);
    expect(remote).eq(true);
    expect(mesh).eq(false);
    expect(color).eq(false);
    expect(white).eq(false);
  });

  it('mesh model', async () => {
    const device = {
      model: 'anym____',
      params: [
        {
          name: PARAMS.MANUFACTURER,
          value: 'AwoX',
        },
      ],
    };

    const { remote, mesh, color, white } = getModelData(device);
    expect(remote).eq(false);
    expect(mesh).eq(true);
    expect(color).eq(false);
    expect(white).eq(false);
  });

  it('color model', async () => {
    const device = {
      model: 'any_c',
      params: [
        {
          name: PARAMS.MANUFACTURER,
          value: 'AwoX',
        },
      ],
    };

    const { remote, mesh, color, white } = getModelData(device);
    expect(remote).eq(false);
    expect(mesh).eq(false);
    expect(color).eq(true);
    expect(white).eq(false);
  });

  it('white model', async () => {
    const device = {
      model: 'any_w',
      params: [
        {
          name: PARAMS.MANUFACTURER,
          value: 'AwoX',
        },
      ],
    };

    const { remote, mesh, color, white } = getModelData(device);
    expect(remote).eq(false);
    expect(mesh).eq(false);
    expect(color).eq(false);
    expect(white).eq(true);
  });
});
