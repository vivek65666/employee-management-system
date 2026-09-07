import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true, trim: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  phone: { type: String, required: true, trim: true },
  address: { type: String, trim: true, maxlength: 300 },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  position: { type: String, required: true, trim: true, maxlength: 100 },
  salary: { type: Number, min: 0, default: 0 },
  joiningDate: { type: Date, required: true },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true }
}, { timestamps: true });

employeeSchema.index({ name: 'text', email: 'text', employeeId: 'text' });
export default mongoose.model('Employee', employeeSchema);
