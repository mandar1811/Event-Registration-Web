import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Notaccess from "./pages/Notaccess";
import EventDetailPage from "./components/EventDetailPage";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";
import AllEvent from "./pages/AllEvent";
import SearchResults from "./components/SearchResults";

const AppWrapper = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <>
      {!isDashboard && <Navbar />}
      <ScrollToTop>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={localStorage.getItem("is_admin") == 1 ? <Dashboard /> : <Notaccess />} />
          <Route path="/event/:id" element={<EventDetailPage />} />
          <Route path="/allEvents" element={<AllEvent />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
      </ScrollToTop>
      {!isDashboard && <Footer />}
    </>
  );
};

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
