import Attendance from '../models/Attendance.js';
import Employee from '../models/Employee.js';

function dayStart(date = new Date()) { const value = new Date(date); value.setHours(0, 0, 0, 0); return value; }
export async function listAttendance(req, res) {
  const query = {};
  if (req.user.role === 'employee') {
    const employee = await Employee.findOne({ $or: [{ user: req.user._id }, { email: req.user.email }] });
    if (!employee) return res.status(404).json({ success: false, message: 'Employee profile not found' });
    query.employee = employee._id;
  } else if (req.query.employee) query.employee = req.query.employee;
  if (req.query.date) { const date = dayStart(req.query.date); query.date = { $gte: date, $lt: new Date(date.getTime() + 86400000) }; }
  const records = await Attendance.find(query).populate('employee', 'employeeId name department').sort('-date');
  res.json({ success: true, data: records });
}
export async function getAttendance(req, res) {
  const record = await Attendance.findById(req.params.id).populate('employee', 'employeeId name department');
  if (!record) return res.status(404).json({ success: false, message: 'Attendance record not found' });
  if (req.user.role === 'employee' && String(record.employee.user) !== String(req.user._id)) return res.status(403).json({ success: false, message: 'You cannot view this record' });
  res.json({ success: true, data: record });
}
export async function createAttendance(req, res) {
  let employeeId = req.body.employee;
  if (req.user.role === 'employee') {
    const employee = await Employee.findOne({ $or: [{ user: req.user._id }, { email: req.user.email }] });
    if (!employee) return res.status(404).json({ success: false, message: 'Employee profile not found' });
    employeeId = employee._id;
  }
  if (!employeeId || !req.body.status) return res.status(400).json({ success: false, message: 'Employee and status are required' });
  try { const record = await Attendance.create({ ...req.body, employee: employeeId, date: dayStart(req.body.date || new Date()) }); res.status(201).json({ success: true, message: 'Attendance marked successfully', data: await record.populate('employee', 'employeeId name') }); }
  catch (error) { if (error.code === 11000) return res.status(409).json({ success: false, message: 'Attendance already exists for this date' }); throw error; }
}
export async function updateAttendance(req, res) {
  let query = { _id: req.params.id };
  let updates = req.body;
  if (req.user.role === 'employee') {
    const employee = await Employee.findOne({ $or: [{ user: req.user._id }, { email: req.user.email }] });
    if (!employee) return res.status(404).json({ success: false, message: 'Employee profile not found' });
    query.employee = employee._id;
    updates = { checkOut: req.body.checkOut };
  }
  const record = await Attendance.findOneAndUpdate(query, updates, { new: true, runValidators: true }).populate('employee', 'employeeId name');
  if (!record) return res.status(404).json({ success: false, message: 'Attendance record not found' });
  res.json({ success: true, message: 'Attendance updated successfully', data: record });
}
