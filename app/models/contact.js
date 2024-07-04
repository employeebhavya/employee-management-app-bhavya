import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  data: {
    type: Buffer,
    required: true,
  },
  contentType: {
    type: String,
    required: true,
  },
  employeeId: {
    type: String,
    required: true,
  },
  employeeName: {
    type: String,
    required: true,
  },
  joinDate: {
    type: Date,
    required: true,
  },
  dateOfReleave: {
    type: Date,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
});

export const Image =
  mongoose.models.Image || mongoose.model("Image", ImageSchema);
