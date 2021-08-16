import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import AppConfig from "../../configs";


export const AuthorizationMiddleware = async (req, res, next) =>{
  const bearer = req.headers.authorization;
  if(!bearer)
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: 'JWT not present in req authorization header!'
    });
  const token = extractToken(bearer);
  if(!token)
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: 'Invalid JWT Token!'
    });
  try {
    var decoded = jwt.verify(token, AppConfig.accessToken.secretKey);
    req.user = decoded;
    next();
  } catch(err) {
    console.log(err);
    return res.status(StatusCodes.UNAUTHORIZED).json(err);
  }
}

/**
 * Returns the jwt from bearer token header
 *
 * @param {string} bearerToken
 * @return {string | null} The jwt from bearer token header
 */
const extractToken = (bearerToken) =>{
  const tmp = bearerToken.split(" ");
  return (tmp && tmp.length > 1) ? tmp[1] : null;
}