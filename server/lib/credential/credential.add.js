/**
 * @description Load credentials in memory.
 * @param {Object} credential - Credential object.
 * @example
 * gladys.credentialManager.add({
 *  {
 *    username: 'user',
 *    password: 'password'
 *  },
 *  '90946a0d-5be2-4740-ac8b-26a2d78f12dd',
 *  'device',
 * });
 */
function add(credential) {
  this.stateManager.setState(`${credential.item_type}Credential`, credential.item_id, credential);
}

module.exports = {
  add,
};
