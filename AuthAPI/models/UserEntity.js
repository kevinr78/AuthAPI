import mongoose, { mongo } from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    min: 4,
  },
  password: {
    type: String,
    required: true,
    min: 5,
  },
});

export default mongoose.model("User", UserSchema);
