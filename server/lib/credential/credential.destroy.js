const db = require('../../models');

/**
 * @description Load credentials in memory.
 * @param {string} itemId - Credentials item ID.
 * @param {string} itemType - Credentials item type.
 * @param {*} transaction - Database transaction.
 * @example
 * gladys.credentialManager.destroy('90946a0d-5be2-4740-ac8b-26a2d78f12dd', 'device', transaction);
 */
async function destroy(itemId, itemType, transaction) {
  const credential = await db.Credential.findOne({
    where: {
      item_id: itemId,
      item_type: itemType,
    },
  });

  if (credential !== null) {
    await credential.destroy({ transaction });

    // removing from ram cache
    this.stateManager.deleteState(`${itemType}Credential`, itemId);
  }
}

module.exports = {
  destroy,
};
