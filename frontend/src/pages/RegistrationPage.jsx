import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function RegistrationPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    studentName: "",
    email: "",
    department: "",
    year: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:5000/api/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          eventId: id,
          studentName: formData.studentName,
          email: formData.email,
          department: formData.department,
          year: formData.year
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      localStorage.setItem("registrationData", JSON.stringify(formData));
      localStorage.setItem("registrationId", data.registration._id);
      localStorage.setItem("eventId", id);

      alert("Registration successful");
      navigate(`/payment/${id}`);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Registration</h1>

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
            placeholder="Enter your department"
            value={formData.department}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <label style={styles.label}>Year</label>
          <input
            type="text"
            name="year"
            placeholder="Enter your year"
            value={formData.year}
            onChange={handleChange}
            required
            style={styles.input}
          />

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Submitting..." : "Proceed to Payment"}
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
    padding: "30px",
    borderRadius: "15px",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
    color: "white"
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "2.2rem"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  label: {
    fontSize: "1rem",
    fontWeight: "500"
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #555",
    background: "transparent",
    color: "white",
    outline: "none",
    fontSize: "1rem"
  },
  error: {
    color: "#f87171",
    marginTop: "4px"
  },
  button: {
    marginTop: "15px",
    padding: "14px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(135deg, #7c3aed, #ec4899)",
    color: "white",
    fontWeight: "bold",
    fontSize: "1rem",
    cursor: "pointer"
  }
};

export default RegistrationPage;