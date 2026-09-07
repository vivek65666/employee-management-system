import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true, maxlength: 80 },
  description: { type: String, trim: true, maxlength: 500 },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null }
}, { timestamps: true });

export default mongoose.model('Department', departmentSchema);
