const db = require('../../models');

/**
 * @description Creates or updates credentials for an item.
 *
 * @param {*} credential - Credentials information.
 * @param {*} itemId - Item database ID.
 * @param {*} itemType - Item type.
 * @param {*} transaction - Database transaction.
 * @returns {Promise} Resolve with the credential created.
 * @example
 * // Create or update
 * gladys.credentialManager.create(
 *  {
 *    username: 'user',
 *    password: 'password'
 *  },
 *  '90946a0d-5be2-4740-ac8b-26a2d78f12dd',
 *  'device',
 *  {});
 */
async function create(credential, itemId, itemType, transaction = undefined) {
  const existingCredential = await db.Credential.findOne({
    where: {
      item_id: itemId,
      item_type: itemType,
    },
  });

  const credentialsToSave = {
    item_id: itemId,
    item_type: itemType,
    data: credential,
  };

  let credentialInDb;
  if (existingCredential) {
    if (!credential || Object.keys(credential).length === 0) {
      await existingCredential.destroy(itemId, itemType, { transaction });
      credentialInDb = null;
    } else {
      credentialInDb = await existingCredential.update(credentialsToSave, { transaction });
    }
  } else {
    credentialInDb = await db.Credential.create(credentialsToSave, { transaction });
  }

  if (credentialInDb !== null) {
    const plainCredential = await credentialInDb.get({ plain: true });

    if (transaction) {
      transaction.afterCommit(() => {
        this.add(plainCredential);
      });
    } else {
      this.add(plainCredential);
    }

    return plainCredential;
  }

  return null;
}

module.exports = {
  create,
};
