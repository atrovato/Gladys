const db = require('../../models');
const { NotFoundError } = require('../../utils/coreErrors');
/**
 * @description Invoked to update a client using client data.
 * @param {string} clientId - The client id of the client to update.
 * @param {boolean} active - The new status.
 * @returns {Promise} The updated status.
 * @example
 * oauth.updateClientStatus('my-client', true);
 */
async function updateClientStatus(clientId, active) {
  const where = {
    id: clientId,
  };
  const client = await db.OAuthClient.findOne({
    where,
  });

  if (!client) {
    throw new NotFoundError(`OAuth client with id ${clientId} not found.`);
  }

  await client.update({ active });
  return active;
}

module.exports = {
  updateClientStatus,
};
