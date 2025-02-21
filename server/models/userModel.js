import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: {
      type: String,
      default: "http://localhost:5000/images/user.png",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
