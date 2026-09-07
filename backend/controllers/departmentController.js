import Department from '../models/Department.js';

export async function listDepartments(req, res) {
  const departments = await Department.find().populate('manager', 'name employeeId').sort('name');
  res.json({ success: true, data: departments });
}
export async function getDepartment(req, res) {
  const department = await Department.findById(req.params.id).populate('manager', 'name employeeId');
  if (!department) return res.status(404).json({ success: false, message: 'Department not found' });
  res.json({ success: true, data: department });
}
export async function createDepartment(req, res) {
  const { name, description, manager } = req.body;
  if (!name?.trim()) return res.status(400).json({ success: false, message: 'Department name is required' });
  const department = await Department.create({ name, description, manager: manager || null });
  res.status(201).json({ success: true, message: 'Department created successfully', data: department });
}
export async function updateDepartment(req, res) {
  const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!department) return res.status(404).json({ success: false, message: 'Department not found' });
  res.json({ success: true, message: 'Department updated successfully', data: department });
}
export async function deleteDepartment(req, res) {
  const department = await Department.findByIdAndDelete(req.params.id);
  if (!department) return res.status(404).json({ success: false, message: 'Department not found' });
  res.json({ success: true, message: 'Department deleted successfully' });
}
