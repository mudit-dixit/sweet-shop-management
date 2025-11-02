import { Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { Navbar } from './components/Navbar';
import { AdminProtectedRoute } from './components/AdminProtectedRoute';
import { AdminPage } from './pages/AdminPage';
import { ProtectedRoute } from './components/ProtectedRoute'; // 1. Import
import { PublicOnlyRoute } from './components/PublicOnlyRoute'; // 2. Import

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main>
        <Routes>
          {/* --- Public-Only Routes --- */}
          {/* (Logged-in users get redirected to /) */}
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* --- Protected Routes --- */}
          {/* (Logged-out users get redirected to /login) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardPage />} />

            {/* --- Admin-Only Routes (Nested Protection) --- */}
            <Route element={<AdminProtectedRoute />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;