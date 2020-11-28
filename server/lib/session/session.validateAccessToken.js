const jwt = require('jsonwebtoken');
const db = require('../../models');
const { Error401 } = require('../../utils/httpErrors');

/**
 * @description Validate an access token.
 * @param {string} accessToken - The access token to verify.
 * @param {string} scope - The scope required.
 * @example
 * gladys.session.validateAccessToken('test', 'dashboard:write');
 */
async function validateAccessToken(accessToken, scope) {
  /**
   * Get token data to load trust data
   * @type {Object} decoded
   */
  const { payload = {} } = jwt.decode(accessToken, { complete: true });
  const { aud: audience, iss: issuer } = payload;

  let { jwtSecret } = this;
  if (audience === 'external') {
    const client = await db.OAuthClient.findOne({
      attributes: ['secret'],
      where: {
        id: issuer,
      },
      raw: true,
    });
    jwtSecret = client.secret;
  }

  /**
   * @type {Object} decoded
   */
  const decoded = jwt.verify(accessToken, jwtSecret, {
    issuer,
    audience,
  });

  // we verify that the scope required to access this route is here
  if (scope && decoded.scope.includes(scope) === false) {
    throw new Error401(`AuthMiddleware: Scope "${scope}" is not in list of authorized scope ${decoded.scope}`);
  }

  // we verify that the session is not revoked
  if (this.cache.get(`revoked_session:${decoded.session_id}`) === true) {
    throw new Error401('AuthMiddleware: Session was revoked');
  }

  return decoded;
}

module.exports = {
  validateAccessToken,
};
