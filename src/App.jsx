import{ BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import {supabase} from './config/supabaseClient';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import AdminSupervisors from './pages/AdminSupervisors';
import StaffDashboard from './pages/StaffDashboard';
import TechnicianDashboard from './pages/TechnicianDashboard';
export default function App() {
    const [session, setSession] = useState(null);

    useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
 
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    )
 
    return () => listener.subscription.unsubscribe()
    }, [])

 
    return (
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<StaffDashboard />} />
        </Routes>
        </BrowserRouter>
    )
}
