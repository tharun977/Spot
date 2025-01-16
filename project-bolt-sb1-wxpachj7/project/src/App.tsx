import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Car, MapPin, Users, Shield, ClipboardList } from 'lucide-react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import ParkingSpaces from './pages/ParkingSpaces';
import Staff from './pages/Staff';
import Logs from './pages/Logs';
import Login from './pages/Login';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Shield },
  { name: 'Vehicles', href: '/vehicles', icon: Car },
  { name: 'Parking Spaces', href: '/spaces', icon: MapPin },
  { name: 'Staff', href: '/staff', icon: Users },
  { name: 'Logs', href: '/logs', icon: ClipboardList },
];

function App() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Router>
      {!session ? (
        <Login />
      ) : (
        <div className="min-h-screen bg-gray-100">
          <Navbar navigation={navigation} />
          <main className="p-4 sm:ml-64">
            <div className="p-4 mt-14">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/vehicles" element={<Vehicles />} />
                <Route path="/spaces" element={<ParkingSpaces />} />
                <Route path="/staff" element={<Staff />} />
                <Route path="/logs" element={<Logs />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </main>
        </div>
      )}
    </Router>
  );
}

export default App;