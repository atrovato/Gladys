module.exports = function BroadlinkController(broadlinkManager) {
  /**
   * @api {get} /api/v1/service/broadlink/peripheral Get discovered Broadlink peripherals.
   * @apiName getPeripheral
   * @apiGroup Broadlink
   */
  async function getPeripherals(req, res) {
    const peripherals = await broadlinkManager.getPeripherals();
    res.json(peripherals);
  }

  return {
    'get /api/v1/service/broadlink/peripheral': {
      authenticated: true,
      controller: getPeripherals,
    },
  };
};
