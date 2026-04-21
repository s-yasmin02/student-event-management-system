import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

function EventDetailsPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/events/${id}`);
        setEvent(data);
      } catch (err) {
        setError(err.response?.data?.message || "Event not found");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div style={styles.center}>
        <div style={styles.spinner} />
      </div>
    );
  }

  if (error || !event) {
    return (
      <h2 style={{ padding: "30px", color: "white" }}>
        {error || "Event not found"}
      </h2>
    );
  }

  const imageUrl = event.image
    ? `${import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || "http://localhost:5000"}/uploads/${event.image}`
    : "https://placehold.co/700x400?text=No+Image";

  const isFull = event.registeredCount >= event.capacity;
  const deadlinePassed = new Date(event.registrationDeadline) < new Date();
  const canRegister = event.status === "Upcoming" && !isFull && !deadlinePassed;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <img
          src={imageUrl}
          alt={event.title}
          style={styles.image}
          onError={(e) => {
            e.target.src = "https://placehold.co/700x400?text=No+Image";
          }}
        />

        <div style={styles.content}>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "12px" }}>
            <span style={styles.badge}>{event.category}</span>
            <span
              style={{
                ...styles.badge,
                background:
                  event.status === "Upcoming"
                    ? "rgba(34,197,94,0.2)"
                    : event.status === "Cancelled"
                    ? "rgba(239,68,68,0.2)"
                    : "rgba(100,116,139,0.2)",
                color:
                  event.status === "Upcoming"
                    ? "#4ade80"
                    : event.status === "Cancelled"
                    ? "#f87171"
                    : "#94a3b8"
              }}
            >
              {event.status}
            </span>
            {event.isFeatured && (
              <span style={{ ...styles.badge, background: "rgba(251,191,36,0.2)", color: "#fbbf24" }}>
                ⭐ Featured
              </span>
            )}
          </div>

          <h1 style={styles.title}>{event.title}</h1>

          <div style={styles.infoGrid}>
            <p><strong>📍 Location:</strong> {event.location}</p>
            <p>
              <strong>📅 Date:</strong>{" "}
              {new Date(event.date).toLocaleDateString("en-IN", {
                weekday: "long", day: "numeric", month: "long", year: "numeric"
              })}
            </p>
            <p>
              <strong>⏰ Registration Deadline:</strong>{" "}
              {new Date(event.registrationDeadline).toLocaleDateString("en-IN", {
                day: "numeric", month: "long", year: "numeric"
              })}
            </p>
            <p>
              <strong>👥 Seats:</strong> {event.registeredCount} / {event.capacity} Registered
            </p>
            <p style={event.price > 0
              ? { color: "#fbbf24", fontWeight: "700", fontSize: "1.05rem" }
              : { color: "#34d399", fontWeight: "700", fontSize: "1.05rem" }
            }>
              <strong style={{ color: "#cbd5e1" }}>💰 Fee:</strong>{" "}
              {event.price > 0 ? `LKR ${event.price}` : 'Free'}
            </p>
          </div>

          {event.description && (
            <p style={{ color: "#cbd5e1", marginTop: "16px", lineHeight: "1.7" }}>
              {event.description}
            </p>
          )}

          {canRegister ? (
            <Link to={`/register/${event._id}`} style={styles.linkBtn}>
              Register Now{event.price > 0 ? ` — LKR ${event.price}` : ' — Free'}
            </Link>
          ) : (
            <div style={styles.disabledBtn}>
              {isFull
                ? "Event is Full"
                : deadlinePassed
                ? "Registration Closed"
                : event.status}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { display: "flex", justifyContent: "center", padding: "40px" },
  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh"
  },
  spinner: {
    width: "48px",
    height: "48px",
    border: "4px solid rgba(255,255,255,0.1)",
    borderTop: "4px solid #7c3aed",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite"
  },
  card: {
    width: "900px",
    maxWidth: "95%",
    borderRadius: "18px",
    overflow: "hidden",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
    color: "white"
  },
  image: { width: "100%", height: "320px", objectFit: "cover" },
  content: { padding: "28px" },
  badge: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: "20px",
    background: "rgba(124,58,237,0.25)",
    color: "#e9d5ff",
    fontSize: "0.85rem"
  },
  title: { fontSize: "2.4rem", marginBottom: "20px" },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    color: "#cbd5e1"
  },
  linkBtn: {
    display: "inline-block",
    marginTop: "24px",
    padding: "14px 28px",
    borderRadius: "10px",
    textDecoration: "none",
    background: "linear-gradient(135deg, #7c3aed, #ec4899)",
    color: "white",
    fontWeight: "bold",
    fontSize: "1rem"
  },
  disabledBtn: {
    display: "inline-block",
    marginTop: "24px",
    padding: "14px 28px",
    borderRadius: "10px",
    background: "rgba(100,116,139,0.3)",
    color: "#94a3b8",
    fontWeight: "bold",
    fontSize: "1rem"
  }
};

export default EventDetailsPage;