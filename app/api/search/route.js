import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectionString } from "../../lib/mongodb";
import { Image } from "../../models/contact";

// Connect to the database
const connectDB = async () => {
  if (!mongoose.connection.readyState) {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
};

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get("employeeId");

    if (!employeeId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing employeeId parameter",
        },
        { status: 400 }
      );
    }

    const image = await Image.findOne({ employeeId }).select(
      "name data contentType employeeId employeeName joinDate dateOfReleave designation email mobile reason"
    );

    if (!image) {
      return NextResponse.json(
        {
          success: false,
          error: "No employee found with the given employeeId",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        image: {
          _id: image._id,
          name: image.name,
          data: image.data.toString("base64"),
          contentType: image.contentType,
          employeeId: image.employeeId,
          employeeName: image.employeeName,
          joinDate: image.joinDate,
          dateOfReleave: image.dateOfReleave,
          designation: image.designation,
          email: image.email,
          mobile: image.mobile,
          reason: image.reason,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during GET request:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
