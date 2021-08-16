import bcrypt from "bcrypt";
import { generateAccessToken } from "../../common/utils";
import { User } from "../models/user.model";
export const AuthController = {
  register: async (req, res) => {
    try {
      const { username, fullName, password } = req.body;
      let user = await User.findOne({ username });
      if (user) {
        return res.status(400).json({
          message: "username exist",
        });
      }
      //generate new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(
        password,
        salt
      );

      //create new user
      user = new User({
        username,
        password: hashedPassword,
        fullName
      });

      //save user and respond
      user = await user.save();
      res.status(200).json({
        user
      });
    } catch (err) {
      throw err;
    }
  },
  login: async (req, res) => {
    try {
      const user = await User.findOne({
        username: req.body.username,
      });
      !user && res.status(404).json({
        message: "user not found"
      });

      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      !validPassword &&
        res.status(400).json({
          message: "wrong password"
        });

      res.status(200).json({
        accessToken: generateAccessToken({
          sub: user._id,
          name: user.username
        })
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
