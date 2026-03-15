import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import EmployeeDirectory from './pages/EmployeeDirectory';
import AttendanceTracker from './pages/AttendanceTracker';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="employees" element={<EmployeeDirectory />} />
          <Route path="attendance" element={<AttendanceTracker />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
