const db = require('../../models');

/**
 * @description Load credentials in memory.
 * @param {*} itemId - Item database ID.
 * @param {*} itemType - Item type.
 * @returns {Promise<Object>} The stored credentials.
 * @example
 * gladys.credentialManager.get(
 *  '90946a0d-5be2-4740-ac8b-26a2d78f12dd',
 *  'device'
 * );
 */
async function get(itemId, itemType) {
  const existingCredential = await db.Credential.findOne({
    where: {
      item_id: itemId,
      item_type: itemType,
    },
  });

  if (existingCredential) {
    const credential = existingCredential.get({ plain: true });
    return JSON.parse(Buffer.from(credential.data, 'base64').toString());
  }

  return null;
}

module.exports = {
  get,
};
