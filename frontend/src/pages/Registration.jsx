import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './Registration.css';

export default function Registration() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    studentName: '',
    email: '',
    department: '',
    year: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    localStorage.setItem('registrationData', JSON.stringify(formData));
    localStorage.setItem('selectedEventId', id);

    alert('Registration details saved successfully');
    navigate(`/payment/${id}`);
  };

  return (
    <div className="registration-page container animate-fade-in">
      <Link to={`/events/${id}`} className="back-link">
        <ArrowLeft size={18} /> Back to Event
      </Link>

      <div className="glass-panel registration-card">
        <h1>Event Registration</h1>
        <p>Fill your details to continue booking.</p>

        <form onSubmit={handleSubmit} className="registration-form">
          <input
            type="text"
            name="studentName"
            placeholder="Student Name"
            value={formData.studentName}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="year"
            placeholder="Year"
            value={formData.year}
            onChange={handleChange}
            required
          />

          <button type="submit" className="btn btn-primary">
            Proceed to Payment
          </button>
        </form>
      </div>
    </div>
  );
}