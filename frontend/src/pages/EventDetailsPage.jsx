import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function EventDetailsPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/events/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load event");
      }

      setEvent(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2 style={styles.message}>Loading event details...</h2>;
  }

  if (error) {
    return <h2 style={styles.error}>{error}</h2>;
  }

  if (!event) {
    return <h2 style={styles.error}>Event not found</h2>;
  }

  const imageUrl = event.image
    ? `http://localhost:5000/uploads/${event.image}`
    : "https://placehold.co/700x400?text=No+Image";

  const isFull = event.registeredCount >= event.capacity;
  const isInactive = event.status !== "Upcoming";

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
          <span style={styles.badge}>{event.category}</span>
          <h1 style={styles.title}>{event.title}</h1>

          <p><strong>Location:</strong> {event.location}</p>
          <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
          <p>
            <strong>Registration Deadline:</strong>{" "}
            {new Date(event.registrationDeadline).toLocaleDateString()}
          </p>
          <p><strong>Status:</strong> {event.status}</p>
          <p><strong>Capacity:</strong> {event.capacity}</p>
          <p><strong>Registered Count:</strong> {event.registeredCount}</p>
          <p><strong>Description:</strong> {event.description || "No description available"}</p>

          {!isFull && !isInactive ? (
            <Link to={`/register/${event._id}`} style={styles.linkBtn}>
              Register Now
            </Link>
          ) : (
            <button style={styles.disabledBtn} disabled>
              {isFull ? "Event Full" : "Registration Closed"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    padding: "40px"
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
  image: {
    width: "100%",
    height: "320px",
    objectFit: "cover"
  },
  content: {
    padding: "24px"
  },
  badge: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: "20px",
    background: "rgba(124,58,237,0.25)",
    color: "#e9d5ff",
    marginBottom: "12px"
  },
  title: {
    fontSize: "2.4rem",
    marginBottom: "16px"
  },
  linkBtn: {
    display: "inline-block",
    marginTop: "18px",
    padding: "12px 24px",
    borderRadius: "10px",
    textDecoration: "none",
    background: "linear-gradient(135deg, #7c3aed, #ec4899)",
    color: "white",
    fontWeight: "bold"
  },
  disabledBtn: {
    display: "inline-block",
    marginTop: "18px",
    padding: "12px 24px",
    borderRadius: "10px",
    border: "none",
    background: "#475569",
    color: "white",
    fontWeight: "bold",
    cursor: "not-allowed"
  },
  message: {
    color: "white",
    padding: "30px"
  },
  error: {
    color: "#f87171",
    padding: "30px"
  }
};

export default EventDetailsPage;