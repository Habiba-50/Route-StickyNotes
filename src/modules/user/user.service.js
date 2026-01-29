import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import { userModel } from "../../DB/model/index.js";
import { ErrorExeption } from "../../common/utils/response/index.js";
import { successResponse } from "../../common/utils/response/index.js";
import { ENCRYPTION_KEY, JWT_SECRET } from "../../../config/config.service.js";

// Signup
// - make sure that the email does not exist before
// - hash the password and encrypt the phone

export const signup = async (inputs) => {
  const { name, email, password, phone, age } = inputs;

  const findUser = await userModel.findOne({ email });

  if (findUser) {
    ErrorExeption({ message: "User already exists" });
  }

  const hashedPassword = bcrypt.hashSync(password, 8);

  const encryptedPhone = CryptoJS.AES.encrypt(
    phone,
    ENCRYPTION_KEY,
  ).toString();

  const user = await userModel.create([
    {
      email,
      password: hashedPassword,
      name,
      phone: encryptedPhone,
      age,
    },
  ]);

  return user;
};

// -----------------------------------------------------------------------

// Login

// Return a JSON Web Token (JWT) that contains the userId and will expire after “1 hour”

export const login = async (inputs) => {
  const { email, password } = inputs;
  const user = await userModel.findOne({ email });
  if (!user) {
    ErrorExeption({ message: "Invalid email or password" });
  }

  const match = bcrypt.compareSync(password, user.password);
  if (!match) {
    ErrorExeption({ message: "Invalid email or password" });
  }

  // user.phone = CryptoJS.AES.decrypt(user.phone, "HabibaMohamed").toString(CryptoJS.enc.Utf8);

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

  return token;
};

// -----------------------------------------------------------------------

//Update logged-in user information (Except Password).
// If user want to update the email, check the new email doesn’t exist before.
// Get the id for the logged-in user (userId) from the token not the body)
// send the token in the headers

export const updateLoginInfo = async (userId, inputs) => {
  const { email, password } = inputs;

  const user = await userModel.findOne({ email });

  if (user) {
    ErrorExeption({ message: "Email already exists" });
  }

  const updatedUser = await userModel
    .findByIdAndUpdate(userId, { email })
    .select("name email age -_id");

  if (!updatedUser) {
    ErrorExeption({ message: "User not found" });
  }

  return updatedUser;
};

// -----------------------------------------------------------------------

// Delete logged-in user account.
// Get the id for the logged-in user (userId) from the token not the body
// send the token in the headers

export const deleteLoginUser = async (userId) => {
  const deletedUser = await userModel.findByIdAndDelete(userId);
  if (!deletedUser) {
    ErrorExeption({ message: "User not found" });
  }
  // return deletedUser;
};

// -----------------------------------------------------------------------

// Get logged-in user data by his ID.
// Get the id for the logged-in user (userId) from the token not the body
// send the token in the headers

export const getUserData = async (userId) => {
  const user = await userModel.findById(userId);

  if (!user) {
    ErrorExeption({ message: "User not found" });
  }

  user.phone = CryptoJS.AES.decrypt(user.phone, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);

  return user;
};
