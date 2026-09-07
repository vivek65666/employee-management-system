import Employee from '../models/Employee.js';
import Department from '../models/Department.js';
import Attendance from '../models/Attendance.js';
import User from '../models/User.js';

const populate = [{ path: 'department', select: 'name description manager' }, { path: 'user', select: 'name email role' }];

export async function listEmployees(req, res) {
  const { search = '', department, status, page = 1, limit = 10 } = req.query;
  const query = {};
  if (search) query.$or = [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }, { employeeId: new RegExp(search, 'i') }];
  if (department) query.department = department;
  if (status) query.status = status;
  const size = Math.min(Number(limit) || 10, 100);
  const skip = (Math.max(Number(page) || 1, 1) - 1) * size;
  const [employees, total] = await Promise.all([Employee.find(query).populate(populate).sort('-createdAt').skip(skip).limit(size), Employee.countDocuments(query)]);
  res.json({ success: true, data: { employees, pagination: { page: Math.floor(skip / size) + 1, limit: size, total, pages: Math.ceil(total / size) } } });
}
export async function getEmployee(req, res) {
  const employee = await Employee.findById(req.params.id).populate(populate);
  if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });
  res.json({ success: true, data: employee });
}
export async function getMyProfile(req, res) {
  const employee = await Employee.findOne({ user: req.user._id }).populate(populate);
  if (!employee) return res.status(404).json({ success: false, message: 'Employee profile not found' });
  res.json({ success: true, data: employee });
}
export async function createEmployee(req, res) {
  const { employeeId, name, email, phone, address, department, position, salary, joiningDate, status, password } = req.body;
  if (!employeeId || !name || !email || !phone || !department || !position || !joiningDate) return res.status(400).json({ success: false, message: 'Employee ID, name, email, phone, department, position and joining date are required' });
  if (!await Department.exists({ _id: department })) return res.status(400).json({ success: false, message: 'Department not found' });
  if (await Employee.exists({ $or: [{ employeeId }, { email: email.toLowerCase() }] })) return res.status(409).json({ success: false, message: 'Employee ID or email already exists' });
  let user = null;
  if (password) user = await User.create({ name, email, password, role: 'employee' });
  const employee = await Employee.create({ employeeId, name, email, phone, address, department, position, salary, joiningDate, status, user: user?._id });
  res.status(201).json({ success: true, message: 'Employee created successfully', data: await Employee.findById(employee._id).populate(populate) });
}
export async function updateEmployee(req, res) {
  const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate(populate);
  if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });
  res.json({ success: true, message: 'Employee updated successfully', data: employee });
}
export async function deleteEmployee(req, res) {
  const employee = await Employee.findByIdAndDelete(req.params.id);
  if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });
  if (employee.user) await User.findByIdAndDelete(employee.user);
  await Attendance.deleteMany({ employee: employee._id });
  res.json({ success: true, message: 'Employee deleted successfully' });
}
export async function dashboard(req, res) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const [employees, departments, attendance] = await Promise.all([Employee.countDocuments({ status: 'Active' }), Department.countDocuments(), Attendance.aggregate([{ $match: { date: { $gte: today } } }, { $group: { _id: '$status', count: { $sum: 1 } } }])]);
  const counts = Object.fromEntries(attendance.map((item) => [item._id, item.count]));
  res.json({ success: true, data: { totalEmployees: employees, totalDepartments: departments, presentToday: counts.Present || 0, absentToday: counts.Absent || 0, onLeave: counts.Leave || 0 } });
}
