import mongoose from "mongoose";
import { connectionString } from "../../lib/mongodb";
import { Image } from "../../models/contact";
import { NextResponse } from "next/server";

// Connect to the database
const connectDB = async () => {
  if (!mongoose.connection.readyState) {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
};

export const GET = async () => {
  try {
    await connectDB();

    const totalEmployees = await Image.countDocuments();
    const employeesByMonth = await Image.aggregate([
      {
        $group: {
          _id: { $month: "$joinDate" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const data = employeesByMonth.map((item) => ({
      month: item._id,
      count: item.count,
    }));

    return NextResponse.json({
      success: true,
      totalEmployees,
      data,
    });
  } catch (error) {
    console.error("Error during GET request:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch data" });
  }
};
