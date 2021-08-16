import jwt from 'jsonwebtoken';
import config from '../../configs';

/**
 * @typedef PayloadToken
 * @type {object}
 * @property {string} sub - user id
 * @property {string} name - username
 */


/**
 *
 *
 * @param {PayloadToken} payload
 * @return {string} a string jwt token
 */
const generateAccessToken = (payload)  => {
  return jwt.sign(payload, config.accessToken.secretKey, { expiresIn: config.accessToken.expireTime + 's' });
}

export {
    generateAccessToken
};

