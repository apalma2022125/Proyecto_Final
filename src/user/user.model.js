import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "The name is required"],
  },
  email: {
    type: String,
    required: [true, "The email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "The password is required"],
  },
  role:{
    type :String,
    default: "CLIENT",
  },
  estado: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: true,
  },
});

UserSchema.methods.toJSON = function(){
  const { __v, password, _id, ...user} = this.toObject();
  user.uid = _id;
  return user;
}

export default mongoose.model('User', UserSchema);