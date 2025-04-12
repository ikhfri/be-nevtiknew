import { Request, Response, NextFunction } from "express";
import prisma from "../libs/prisma";
import bcrypt from "bcrypt";
import { loginSchema, registerSchema } from "../validation/userSchema";
import { generateToken } from "../libs/jwt";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { nis, name, password,categorie, role, kelas } = registerSchema.parse(req.body);

    const exists = await prisma.user.findUnique({
      where: {
        nis,
      },
    });
    if (exists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        nis: nis,
        kelas,
        name,
        categorie,
        password: hash,
        role,
      },
    });
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    }
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedUser = await prisma.user.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    }
  }
};

export const loginUser = async (req: Request, res: Response, next : NextFunction) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "NIS and password are required",
      errors: parsed.error.format()
    });
  }

  const { nis, password } = parsed.data;

  try {
    const user = await prisma.user.findUnique({
      where: { nis },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid NIS or Password" });
    }

    const token = generateToken({
      id: user.id,
      nis: user.nis,
      name: user.name,
      kelas: user.kelas,
      role: user.role,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        nis: user.nis,
        name: user.name,
        kelas: user.kelas,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    next()
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

export const getUserById = async (req: Request, res: Response, next:NextFunction) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    res.status(200).json({ message: "User fetched successfully", user });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    }
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json({ message: "Users fetched successfully", users });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    }
  }
};