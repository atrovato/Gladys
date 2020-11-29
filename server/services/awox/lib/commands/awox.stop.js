/**
 * @description Stops AwoX service.
 * @example
 * awox.stop();
 */
function stop() {
  this.managers = [];
  delete this.bluetooth;
}

module.exports = {
  stop,
};
