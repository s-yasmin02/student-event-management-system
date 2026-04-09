import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function RegistrationPage() {
  const { id } = useParams(); // event ID
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    studentName: user?.name || "",
    email: user?.email || "",
    department: "",
    year: ""
  });

  // Fetch event to display name
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/events/${id}`);
        setEvent(data);
      } catch {
        setError("Event not found");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const { data } = await api.post("/registrations", {
        eventId: id,
        ...formData
      });
      // Store registration ID for payment page to update payment status
      localStorage.setItem("registrationId", data._id);
      localStorage.setItem("registrationData", JSON.stringify(formData));
      navigate(`/payment/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{ color: "white" }}>Loading event...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Register for Event</h1>
        {event && <p style={styles.eventName}>📅 {event.title}</p>}

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Student Name</label>
          <input
            type="text"
            name="studentName"
            placeholder="Enter your name"
            value={formData.studentName}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <label style={styles.label}>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <label style={styles.label}>Department</label>
          <input
            type="text"
            name="department"
            placeholder="e.g. Computer Science"
            value={formData.department}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <label style={styles.label}>Year</label>
          <select
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
            style={styles.input}
          >
            <option value="">Select Year</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>

          <button type="submit" style={styles.button} disabled={submitting}>
            {submitting ? "Registering..." : "Proceed to Payment"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "80vh",
    padding: "30px"
  },
  card: {
    width: "500px",
    maxWidth: "95%",
    padding: "32px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
    color: "white"
  },
  title: { textAlign: "center", marginBottom: "6px", fontSize: "2rem" },
  eventName: { textAlign: "center", color: "#a78bfa", marginBottom: "20px", fontSize: "0.95rem" },
  errorBox: {
    background: "rgba(239,68,68,0.15)",
    border: "1px solid rgba(239,68,68,0.4)",
    color: "#f87171",
    padding: "12px 16px",
    borderRadius: "10px",
    marginBottom: "16px",
    fontSize: "0.9rem"
  },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  label: { fontSize: "0.9rem", fontWeight: "600", color: "#e2e8f0" },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 15px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.07)",
    color: "white",
    outline: "none",
    fontSize: "1rem"
  },
  button: {
    marginTop: "15px",
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, #7c3aed, #ec4899)",
    color: "white",
    fontWeight: "bold",
    fontSize: "1rem",
    cursor: "pointer"
  }
};

export default RegistrationPage;