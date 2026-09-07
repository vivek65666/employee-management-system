import { BarChart3, CalendarDays, ChevronRight, LayoutDashboard, Users, X, Building2, UserRound } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth();
  const links = [{ to: '/dashboard', label: 'Overview', icon: LayoutDashboard }, { to: '/employees', label: 'Employees', icon: Users, admin: true }, { to: '/departments', label: 'Departments', icon: Building2, admin: true }, { to: '/attendance', label: 'Attendance', icon: CalendarDays }, { to: '/profile', label: 'My profile', icon: UserRound }];
  return <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}><div className="brand"><span className="brand-mark">S</span><span>staffline</span><button className="icon-button close-sidebar" onClick={onClose}><X size={19} /></button></div><div className="workspace-label">Main menu</div><nav>{links.filter((link) => !link.admin || user?.role === 'admin').map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} onClick={onClose} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><Icon size={18} /><span>{label}</span><ChevronRight size={15} className="nav-arrow" /></NavLink>)}</nav><div className="sidebar-footer"><div className="help-card"><BarChart3 size={20} /><div><strong>People pulse</strong><span>Keep your team in sync.</span></div></div><small>Staffline v1.0</small></div></aside>;
}
