import Attendance from "../models/Attendance.js";

// Save or update attendance
export const saveAttendance = async (req, res) => {
    const { subject, date, status } = req.body;
  
    try {
      const existing = await Attendance.findOne({
        user: req.user._id,
        subject,
        date,
      });
  
      if (existing) {
        existing.status = status;
        await existing.save();
        return res.status(200).json({ message: "Attendance updated" });
      }
  
      const newAttendance = new Attendance({
        user: req.user._id,
        subject,
        date,
        status,
      });
  
      await newAttendance.save();
      res.status(201).json({ message: "Attendance saved" });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  };
  
  // Fetch attendance data
  export const getAttendance = async (req, res) => {
    try {
      const records = await Attendance.find({ user: req.user._id });
      res.status(200).json(records);
    } catch (err) {
      res.status(500).json({ message: "Error fetching attendance" });
    }
  };