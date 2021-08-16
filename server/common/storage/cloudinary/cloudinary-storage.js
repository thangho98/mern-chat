const cloudinary = require('cloudinary').v2;
import config from '../../../configs';

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

export function streamUpload(file) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream((error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    }).end(file.buffer);
  });
}
export { cloudinary as CloudinaryStorage };
