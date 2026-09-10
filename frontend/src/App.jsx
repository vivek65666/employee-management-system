import { useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import EmployeeDetails from './pages/EmployeeDetails';
import Departments from './pages/Departments';
import Attendance from './pages/Attendance';
import Profile from './pages/Profile';

function AppLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar
        open={open}
        onClose={() => setOpen(false)}
      />

      <div className="main-column">
        <Navbar onMenu={() => setOpen(true)} />

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Logged-in users */}
      {/* Logged-in users */}
<Route element={<ProtectedRoute />}>
  <Route element={<AppLayout />}>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/attendance" element={<Attendance />} />
    <Route path="/profile" element={<Profile />} />

    {/* ADMIN ONLY */}
    <Route element={<ProtectedRoute roles={['admin']} />}>
      <Route path="/employees" element={<Employees />} />
      <Route path="/employees/:id" element={<EmployeeDetails />} />
      <Route path="/departments" element={<Departments />} />
    </Route>
  </Route>
</Route>

      {/* Unknown route */}
      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />
    </Routes>
  );
}