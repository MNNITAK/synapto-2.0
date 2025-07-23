import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  date: {
    type: String, // we'll use 'YYYY-MM-DD' format
    required: true,
  },
  status: {
    type: String,
    enum: ["present", "absent"],
    required: true,
  }
}, { timestamps: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;