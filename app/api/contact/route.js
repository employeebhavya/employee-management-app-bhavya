import { connectionString } from "../../lib/mongodb";
import { Image } from "../../models/contact";
import mongoose from "mongoose";
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

// POST method for creating new images
export const POST = async (request) => {
  try {
    await connectDB();

    const data = await request.formData();
    const file = data.get("file");

    if (!file) {
      return NextResponse.json({
        success: false,
        response: "No file provided",
      });
    }

    const bufferData = await file.arrayBuffer();
    const buffer = Buffer.from(bufferData);

    const newImage = new Image({
      name: file.name,
      data: buffer,
      contentType: file.type,
      employeeId: data.get("employeeId"),
      employeeName: data.get("employeeName"),
      joinDate: new Date(data.get("joinDate")),
      dateOfReleave: new Date(data.get("dateOfReleave")),
      designation: data.get("designation"),
      email: data.get("email"),
      mobile: data.get("mobile"),
      reason: data.get("reason"),
    });
    await newImage.save();

    return NextResponse.json({
      response: "Successfully Uploaded",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ response: "Failed", success: false });
  }
};

// GET method for fetching images
export const GET = async () => {
  try {
    await connectDB();

    const images = await Image.find().select(
      "name data contentType employeeId employeeName joinDate dateOfReleave designation email mobile reason"
    );

    return NextResponse.json({
      success: true,
      images: images.map((image) => ({
        _id: image._id, // Ensure _id is included
        name: image.name,
        data: image.data.toString("base64"), // Convert buffer to base64 string
        contentType: image.contentType,
        employeeId: image.employeeId,
        employeeName: image.employeeName,
        joinDate: image.joinDate,
        dateOfReleave: image.dateOfReleave,
        designation: image.designation,
        email: image.email,
        mobile: image.mobile,
        reason: image.reason,
      })),
    });
  } catch (error) {
    console.error("Error during GET request:", error);
    return NextResponse.json({ success: false, error: "Failed" });
  }
};

// PUT method for editing existing images
export const PUT = async (request) => {
  try {
    await connectDB();

    const data = await request.formData();
    const id = data.get("id"); // get the ID of the image to update
    const file = data.get("file");
    const updateData = {
      employeeId: data.get("employeeId"),
      employeeName: data.get("employeeName"),
      joinDate: new Date(data.get("joinDate")),
      dateOfReleave: new Date(data.get("dateOfReleave")),
      designation: data.get("designation"),
      email: data.get("email"),
      mobile: data.get("mobile"),
      reason: data.get("reason"),
    };

    if (file instanceof Blob) {
      const bufferData = await new Response(file).arrayBuffer();
      const buffer = Buffer.from(bufferData);
      updateData.name = file.name;
      updateData.data = buffer;
      updateData.contentType = file.type;
    } else {
      // If no file is uploaded, retain existing image data
      const existingImage = await Image.findById(id);
      if (existingImage) {
        updateData.name = existingImage.name;
        updateData.data = existingImage.data;
        updateData.contentType = existingImage.contentType;
      }
    }

    const updatedImage = await Image.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedImage) {
      return NextResponse.json({
        success: false,
        error: "Image not found or could not be updated",
      });
    }

    return NextResponse.json({
      success: true,
      response: "Successfully Updated",
      updatedImage,
    });
  } catch (error) {
    console.error("Error during PUT request:", error);
    return NextResponse.json({ success: false, error: "Failed to update" });
  }
};

// DELETE method for deleting images
export const DELETE = async (request) => {
  try {
    await connectDB(); // Ensure database connection

    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json({
        success: false,
        error: "Missing id parameter",
      });
    }

    // Perform deletion operation using id
    const deletedImage = await Image.findByIdAndDelete(id);

    console.log("Deleted Image:", deletedImage); // Log to check deleted image object

    if (!deletedImage) {
      return NextResponse.json({
        success: false,
        error: "Image not found or already deleted",
      });
    }

    return NextResponse.json({
      success: true,
      response: "Successfully deleted",
    });
  } catch (error) {
    console.error("Error during DELETE request:", error);
    return NextResponse.json({ success: false, error: "Failed to delete" });
  }
};
