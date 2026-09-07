import { Bell, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onMenu }) {
  const { user, logout } = useAuth();
  return <header className="topbar"><button className="icon-button mobile-menu" onClick={onMenu} aria-label="Open navigation"><Menu size={20} /></button><div className="topbar-title"><span className="eyebrow">WORKSPACE</span><strong>People operations</strong></div><div className="topbar-actions"><button className="icon-button" aria-label="Notifications"><Bell size={19} /></button><div className="user-chip"><span className="avatar">{user?.name?.charAt(0).toUpperCase()}</span><span className="user-meta"><strong>{user?.name}</strong><small>{user?.role}</small></span></div><button className="icon-button" onClick={logout} aria-label="Log out"><LogOut size={18} /></button></div></header>;
}
