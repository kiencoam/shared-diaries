import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "Email already exists"],
  },
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  image: {
    type: String,
  },
});

const User = models.User || model("User", UserSchema);

export default User;
