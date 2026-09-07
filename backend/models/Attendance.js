import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true, index: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['Present', 'Absent', 'Leave'], required: true },
  checkIn: { type: String, trim: true },
  checkOut: { type: String, trim: true }
}, { timestamps: true });

attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });
export default mongoose.model('Attendance', attendanceSchema);
