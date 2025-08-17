import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Tasks from './pages/Tasks';
import AuctionForm from './pages/Auctionform';

import Auctions from './pages/Auctions';
import AuctionView from './pages/Auctionview';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/tasks" element={<Tasks />} />

        <Route path="/auctions" element={<Auctions />} />
        <Route path="/auctions/new" element={<AuctionForm />} />
        <Route path="/auctions/:id/edit" element={<AuctionForm />} />
        <Route path="/auctions/:id" element={<AuctionView />} />

      </Routes>
    </Router>
  );
}

export default App;
