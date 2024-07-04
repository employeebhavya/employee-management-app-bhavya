import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectionString } from "../../../lib/mongodb";
import User from "../../../models/user";
import jwt from "jsonwebtoken";

// Connect to the database
const connectDB = async () => {
  if (!mongoose.connection.readyState) {
    try {
      await mongoose.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Database connected successfully");
    } catch (error) {
      console.error("Database connection failed:", error);
      throw new Error("Database connection failed");
    }
  }
};

export async function POST(request) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Please fill in all fields" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    return NextResponse.json(
      {
        success: true,
        token,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during POST request:", error);
    return NextResponse.json(
      { success: false, error: "Failed to login user" },
      { status: 500 }
    );
  }
}
