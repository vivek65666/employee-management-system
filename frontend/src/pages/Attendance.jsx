import { useEffect, useState } from 'react';
import { CalendarCheck2, Plus } from 'lucide-react';
import api from '../services/api';
import AttendanceTable from '../components/AttendanceTable';
import { useAuth } from '../context/AuthContext';

const emptyForm = { employee: '', date: new Date().toISOString().slice(0, 10), status: 'Present', checkIn: '09:00', checkOut: '' };

export default function Attendance() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const load = () => api.get('/attendance').then(({ data }) => setRecords(data.data));

  useEffect(() => {
    load();
    if (user?.role === 'admin') api.get('/employees', { params: { limit: 100 } }).then(({ data }) => setEmployees(data.data.employees));
  }, [user]);

  const handleEdit = (record) => {
    setEditing(record);
    setForm({
      employee: record.employee?._id || record.employee || '',
      date: new Date(record.date).toISOString().slice(0, 10),
      status: record.status,
      checkIn: record.checkIn || '',
      checkOut: record.checkOut || ''
    });
    setModal(true);
  };

  const handleCheckOut = async (record) => {
    const now = new Date();
    const checkOut = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    await api.put(`/attendance/${record._id}`, { checkOut });
    load();
  };

  const submit = async (e) => {
    e.preventDefault();
    if (editing) await api.put(`/attendance/${editing._id}`, form);
    else await api.post('/attendance', form);
    setEditing(null);
    setModal(false);
    load();
  };

  return <>
    <div className="page-heading"><div><span className="eyebrow">DAILY RHYTHM</span><h1>Attendance</h1><p className="muted">Keep a simple pulse on when your team is here.</p></div><button className="button primary" onClick={() => { setEditing(null); setForm(emptyForm); setModal(true); }}><Plus size={17} /> Mark attendance</button></div>
    <div className="attendance-banner"><div className="banner-icon"><CalendarCheck2 size={21} /></div><div><strong>{user?.role === 'admin' ? 'Team attendance' : 'Your attendance'}</strong><span>{user?.role === 'admin' ? 'Review and update attendance across the organization.' : 'Mark your attendance once each day.'}</span></div></div>
    <section className="panel"><AttendanceTable records={records} admin={user?.role === 'admin'} onEdit={handleEdit} onCheckOut={handleCheckOut} /></section>
    {modal && <div className="modal-backdrop"><div className="modal small-modal"><div className="modal-heading"><div><span className="eyebrow">TODAY'S RECORD</span><h2>{editing ? 'Edit attendance' : 'Mark attendance'}</h2></div><button className="icon-button" onClick={() => setModal(false)}>×</button></div><form className="stack-form" onSubmit={submit}>{user?.role === 'admin' && <label>Employee<select value={form.employee} onChange={(e) => setForm({ ...form, employee: e.target.value })} required><option value="">Select employee</option>{employees.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}</select></label>}<label>Date<input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required /></label><label>Status<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="Present">Present</option><option value="Absent">Absent</option><option value="Leave">Leave</option></select></label><div className="form-actions"><button type="button" className="button secondary" onClick={() => setModal(false)}>Cancel</button><button className="button primary">{editing ? 'Save changes' : 'Save attendance'}</button></div></form></div></div>}
  </>;
}
