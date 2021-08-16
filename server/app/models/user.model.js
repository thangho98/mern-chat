import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const avatarSchema = new Schema({
  fileName: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: false
  },
  type: {
    type: String,
    required: false
  },
});

const userSchema = new Schema({
  username:{
    type: String,
    required: true
  },
  fullName:{
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: avatarSchema,
    required: false,
    default: null
  }
},{
  //when a new version of row is added to database
  //automatically add timestamp to that row
  //we save created time, but don't need for the scope of this project
  //an update time
  timestamps: {
    createdAt: true,
    updatedAt: true,
  }
})

userSchema.methods.toJSON = function() {
  var obj = this.toObject(); //or var obj = this;
  delete obj.password;
  return obj;
 }

export const User = mongoose.model('User',userSchema);