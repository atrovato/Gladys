const logger = require('../../../../utils/logger');
const db = require('../../../../models');
const { VARIABLES } = require('../../utils/constants');

/**
 * @description Check if OAuth client exists, if not, creates it.
 * @example
 * googleActions.checkClient();
 */
async function checkClient() {
  const projectKey = await this.gladys.variable.getValue(VARIABLES.GOOGLEACTIONS_PROJECT_KEY, this.serviceId);
  const client = await this.gladys.oauth.getClient(VARIABLES.GOOGLEACTIONS_OAUTH_CLIENT_ID);
  const expectedUrl = `https://oauth-redirect.googleusercontent.com/r/${projectKey}`;

  // Delete and recreate client
  if (!client || !client.redirect_uris.includes(expectedUrl)) {
    db.Session.destroy({
      where: {
        client_id: VARIABLES.GOOGLEACTIONS_OAUTH_CLIENT_ID,
      },
    });
    db.OAuthClient.destroy({
      where: {
        id: VARIABLES.GOOGLEACTIONS_OAUTH_CLIENT_ID,
      },
    });

    await this.gladys.oauth.createClient({
      id: VARIABLES.GOOGLEACTIONS_OAUTH_CLIENT_ID,
      name: 'Google Actions',
      redirect_uris: [expectedUrl],
      grants: ['authorization_code'],
    });

    logger.info(`GoogleActions OAuth client correctly created / updated.`);
  }
}

module.exports = {
  checkClient,
};
