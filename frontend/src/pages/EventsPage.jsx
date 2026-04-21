import { useState, useEffect } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await api.get("/events");
        // Only show published (non-draft), upcoming events to students
        const visible = data.filter(
          (e) => !e.isDraft && e.status === "Upcoming"
        );
        setEvents(visible);
      } catch (err) {
        setError(err.message || "Failed to load events");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div style={styles.center}>
        <div style={styles.spinner} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.center}>
        <p style={{ color: "#f87171" }}>⚠️ {error}</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div style={styles.center}>
        <h2 style={{ color: "white" }}>No events available right now.</h2>
        <p style={{ color: "#94a3b8" }}>Check back later!</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>All Events</h1>

      <div style={styles.grid}>
        {events.map((event) => {
          const imageUrl = event.image
            ? `${import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || "http://localhost:5000"}/uploads/${event.image}`
            : "https://placehold.co/600x400?text=No+Image";

          return (
            <div key={event._id} style={styles.card}>
              <img
                src={imageUrl}
                alt={event.title}
                style={styles.image}
                onError={(e) => {
                  e.target.src = "https://placehold.co/600x400?text=No+Image";
                }}
              />

              <div style={styles.body}>
                <span style={styles.badge}>{event.category}</span>
                <h2 style={styles.title}>{event.title}</h2>
                <p style={styles.info}>📍 {event.location}</p>
                <p style={styles.info}>
                  📅 {new Date(event.date).toLocaleDateString("en-IN", {
                    day: "numeric", month: "long", year: "numeric"
                  })}
                </p>
                <p style={styles.info}>
                  👥 {event.registeredCount} / {event.capacity} Registered
                </p>
                {event.isFeatured && (
                  <span style={styles.featured}>⭐ Featured</span>
                )}

                <Link to={`/events/${event._id}`} style={styles.button}>
                  View Details
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  page: { padding: "30px" },
  heading: { color: "white", fontSize: "3rem", marginBottom: "24px" },
  center: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    color: "white"
  },
  spinner: {
    width: "48px",
    height: "48px",
    border: "4px solid rgba(255,255,255,0.1)",
    borderTop: "4px solid #7c3aed",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px"
  },
  card: {
    borderRadius: "18px",
    overflow: "hidden",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
    color: "white",
    transition: "transform 0.3s ease"
  },
  image: { width: "100%", height: "220px", objectFit: "cover" },
  body: { padding: "18px" },
  badge: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: "20px",
    background: "rgba(124,58,237,0.25)",
    color: "#e9d5ff",
    marginBottom: "10px",
    fontSize: "0.8rem"
  },
  featured: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "20px",
    background: "rgba(251,191,36,0.2)",
    color: "#fbbf24",
    marginLeft: "8px",
    fontSize: "0.78rem"
  },
  title: { marginBottom: "10px" },
  info: { color: "#cbd5e1", marginBottom: "8px" },
  button: {
    display: "inline-block",
    marginTop: "12px",
    padding: "10px 18px",
    borderRadius: "10px",
    textDecoration: "none",
    background: "linear-gradient(135deg, #7c3aed, #ec4899)",
    color: "white",
    fontWeight: "bold"
  }
};

export default EventsPage;