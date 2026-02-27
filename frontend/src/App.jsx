import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Learn';
import ScamAlerts from './pages/ScamAlerts';
import Schemes from './pages/Schemes';
import Profile from './pages/Profile';
import Startups from './pages/Startups';
import Loans from './pages/Loans';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="learn" element={<Learn />} />
          <Route path="alerts" element={<ScamAlerts />} />
          <Route path="schemes" element={<Schemes />} />
          <Route path="profile" element={<Profile />} />
          <Route path="startups" element={<Startups />} />
          <Route path="loans" element={<Loans />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
