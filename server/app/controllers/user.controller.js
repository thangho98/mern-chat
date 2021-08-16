import StatusCodes from 'http-status-codes';
import { streamUpload } from '../../common/storage/cloudinary/cloudinary-storage';
import { User } from '../models/user.model';

/** @typedef {Object} CloudinaryUploadResult
 * @property {String} format
 * @property {Number} height
 * @property {String} public_id
 * @property {String} resource_type
 * @property {String} secure_url
 * @property {String} signature
 * @property {String} url
 * @property {Number} version
 * @property {Number} width
 */

export const UserController = {
  getCurrentUser: async (req, res) => {
    const auth = req.user;
    try {
      const user = await User.findById(auth.sub);
      if (!user) res.status(StatusCodes.NOT_FOUND).json('user not found');
      return res.status(StatusCodes.OK).json(user);
    } catch (error) {
      console.log(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
  },
  updateProfile: async (req, res) => {
    const auth = req.user;
    const user = User.findById(auth.sub);
    !user &&
      res.status(StatusCodes.NOT_FOUND).json({
        message: 'user not found',
      });
    const { fullName } = req.body;
    user.fullName = fullName;
    try {
      await user.save();
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
    return res.status(StatusCodes.NO_CONTENT);
  },
  updateAvatar: async (req, res) => {
    console.log('Images ', req.file);
    const auth = req.user;
    try {
      const user = await User.findById(auth.sub);
      !user &&
        res.status(StatusCodes.NOT_FOUND).json({
          message: 'user not found',
        });
      const dataUpload = await streamUpload(req.file);
      console.log(dataUpload);
      user.avatar = {
        fileName: dataUpload.public_id + '.' + dataUpload.format,
        type: dataUpload.resource_type,
        url: dataUpload.secure_url,
      };
      await user.save();
      return res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error).send();
    }
  },
};
