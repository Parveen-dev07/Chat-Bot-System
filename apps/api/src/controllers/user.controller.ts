import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken"
import { generateToken } from "../utils/generateToken.js";


export const UserRegister = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    console.log("show serber eror",error);
    
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const Userlogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    const token = generateToken(String(user._id))

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: user,
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getUsers = async(req:Request,res:Response)=>{
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const users = await User.find().skip(skip).limit(limit).sort({createdAt:-1});
    res.status(200).json({
      message:"Fetch users successfully",
      success:true,
      data:users
    })
  } catch (error) {
    return res.status(500).json({
      message:'Internal server error',
      success:false,
      
    })
  }
}



