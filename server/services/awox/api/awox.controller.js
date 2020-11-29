const logger = require('../../../utils/logger');

module.exports = function AwoxController(awoxManager) {
  /**
   * @api {get} /api/v1/service/awox/peripheral Get AwoX discovered peripherals
   * @apiName getDiscoveredDevices
   * @apiGroup AwoX
   */
  async function getDiscoveredDevices(req, res) {
    const peripherals = awoxManager.getDiscoveredDevices();
    res.json(peripherals);
  }

  /**
   * @api {get} /api/v1/service/awox/peripheral/bluetooth-:uuid Get AwoX discovered peripheral by uuid
   * @apiName getDiscoveredDevice
   * @apiGroup AwoX
   */
  async function getDiscoveredDevice(req, res) {
    const { uuid } = req.params;
    const peripheral = awoxManager.getDiscoveredDevice(uuid);
    if (!peripheral) {
      res.status(404);
    }
    res.json(peripheral);
  }

  /**
   * @api {get} /api/v1/service/awox/remotes Get AwoX linked remotes
   * @apiName getRemotes
   * @apiGroup AwoX
   */
  async function getRemotes(req, res) {
    const remotes = await awoxManager.getRemotes();
    res.json(remotes);
  }

  /**
   * @api {post} /api/v1/service/awox/peripheral/test Test AwoX peripheral
   * @apiName testDevice
   * @apiGroup AwoX
   */
  async function testDevice(req, res) {
    const { device, feature, value } = req.body;
    try {
      await awoxManager.setValue(device, feature, value);
      res.status(200);
    } catch (e) {
      logger.warn(`AwoX test failed`, e);
      res.status(500);
    }
    res.end();
  }

  /**
   * @api {post} /api/v1/service/awox/peripheral/pair Test AwoX peripheral
   * @apiName pairDevice
   * @apiGroup AwoX
   */
  async function pairDevice(req, res) {
    const { device } = req.body;
    try {
      await awoxManager.pair(device);
      res.status(200);
    } catch (e) {
      logger.warn(`AwoX pair failed`, e);
      res.status(500);
    }
    res.end();
  }

  return {
    'get /api/v1/service/awox/peripheral': {
      authenticated: true,
      controller: getDiscoveredDevices,
    },
    'get /api/v1/service/awox/remotes': {
      authenticated: true,
      controller: getRemotes,
    },
    'post /api/v1/service/awox/peripheral/test': {
      authenticated: true,
      controller: testDevice,
    },
    'post /api/v1/service/awox/peripheral/pair': {
      authenticated: true,
      controller: pairDevice,
    },
    'get /api/v1/service/awox/peripheral/bluetooth-:uuid': {
      authenticated: true,
      controller: getDiscoveredDevice,
    },
  };
};
