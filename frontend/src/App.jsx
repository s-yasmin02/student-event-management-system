import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import RegistrationPage from "./pages/RegistrationPage";
import PaymentPage from "./pages/PaymentPage";

import Dashboard from "./pages/Dashboard";
import EventForm from "./pages/EventForm";

function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          {/* Student side */}
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailsPage />} />
          <Route path="/register/:id" element={<RegistrationPage />} />
          <Route path="/payment/:id" element={<PaymentPage />} />

          {/* Admin side */}
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/create" element={<EventForm />} />
          <Route path="/edit/:id" element={<EventForm />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;