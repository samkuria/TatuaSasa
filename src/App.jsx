import{ BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import StaffDashboard from './pages/StaffDashboard';

export default function App() {
    return (
        <BrowserRouter>
        <Routes>
           <Route path="/" element={<StaffDashboard />} />

        </Routes>
        </BrowserRouter>
    )
}
