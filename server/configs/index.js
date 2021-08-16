require('dotenv').config();
const { MONGODB_URL, CLOUDINARY_CLOUD_NAME,  CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, API_BASE_URL, SECRET_KEY, ACCESS_TOKEN_EXPIRE_TIME , HTTP_PORT } = process.env;
const AppConfig = Object.freeze({
  apiBaseURL: API_BASE_URL || '/api',
  httpPort:  HTTP_PORT ? parseInt(HTTP_PORT , 10) : 5002,
  mongodb:{
    url: MONGODB_URL
  },
  cloudinary:{
    cloudName: CLOUDINARY_CLOUD_NAME,
    apiKey: CLOUDINARY_API_KEY,
    apiSecret: CLOUDINARY_API_SECRET,
  },
  accessToken: {
    secretKey: SECRET_KEY || 'lwtcG9i2sEhaR9zH1USSDaAAEGPYdMOC',
    expireTime: ACCESS_TOKEN_EXPIRE_TIME ? parseInt(ACCESS_TOKEN_EXPIRE_TIME , 10) : 86400
  }
});

export default AppConfig;