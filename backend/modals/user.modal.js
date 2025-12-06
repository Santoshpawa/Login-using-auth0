import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = mongoose.Schema({
  email: { type: String, required: true },
  picture: { type: String },
  refreshToken: { type: String },
});

async function generateHashedPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

userSchema.methods.checkPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  const secret = "mummy";
  const expiryTime = "1d";
  return jwt.sign({ _id: this._id }, secret, { expiresIn: expiryTime });
};

userSchema.methods.generateRefreshToken = function () {
  const secret = "papa";
  const expiryTime = "7d";
  return jwt.sign({ _id: this._id }, secret, { expiresIn: expiryTime });
};

const userModal = mongoose.model("users", userSchema);

export { generateHashedPassword, userModal };
