import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup'; // Import Signup
import Home from './pages/Home';
import Albums from './pages/Albums';
import Cart from './pages/Cart';
import Trending from './pages/Trending';
import Concerts from './pages/Concerts';
import Merch from './pages/Merch';
// ... rest of imports

// The Layout handles hiding the Navbar on Entry Pages
const Layout = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;
  
  // Hide the Navbar on Login and Signup pages
  const isEntryPage = path === '/login' || path === '/signup';

  return (
    <div className="bg-[#0B0B0F] min-h-screen font-sans">
      {!isEntryPage && <Navbar />}
      <main>
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} /> {/* Add this Route */}
          <Route path="/albums" element={<Albums />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/concerts" element={<Concerts />} />
          <Route path="/merch" element={<Merch />} />
          {/* ... other routes ... */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;