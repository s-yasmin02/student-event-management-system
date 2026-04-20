import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div style={{ color: "white", padding: "40px", textAlign: "center" }}>
      <h1>Welcome to Campus Event Management System</h1>
      <p>Students can view events, register, and continue to payment.</p>

      <Link to="/events">
        <button
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer"
          }}
        >
          View Events
        </button>
      </Link>
    </div>
  );
}