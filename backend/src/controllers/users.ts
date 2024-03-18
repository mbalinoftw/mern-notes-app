import { RequestHandler } from "express";
import UserModel from "../models/user";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";

interface SignUpBody {
  username?: string;
  email?: string;
  password?: string;
}

export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (req, res, next) => {
  const username = req.body.username?.trim();
  const email = req.body.email;
  const passwordRaw = req.body.password;

  try {
    if (!username || !email || !passwordRaw) {
      throw createHttpError(400, "Missing required fields (username, email or password)");
    }

    const existingUser = await UserModel.findOne({ username: username }).exec();

    if (existingUser) {
      throw createHttpError(409, "Username already in use. Please register another one.");
    }

    const existingEmail = await UserModel.findOne({ email: email }).exec();

    if (existingEmail) {
      throw createHttpError(409, "Email already in use. Please register another one.");
    }

    const passwordHashed = await bcrypt.hash(passwordRaw, 10);

    const newUser = await UserModel.create({
      username: username,
      email: email,
      password: passwordHashed,
    });

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};
