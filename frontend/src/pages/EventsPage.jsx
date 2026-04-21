import dummyEvents from "../data/dummyEvents";
import { Link } from "react-router-dom";

function EventsPage() {
  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>All Events</h1>

      <div style={styles.grid}>
        {dummyEvents.map((event) => {
          const imageUrl = event.image
            ? event.image
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
                <p style={styles.info}>📅 {event.date}</p>
                <p style={styles.info}>
                  👥 {event.registeredCount} / {event.capacity} Registered
                </p>

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
  page: {
    padding: "30px"
  },
  heading: {
    color: "white",
    fontSize: "3rem",
    marginBottom: "24px"
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
  image: {
    width: "100%",
    height: "220px",
    objectFit: "cover"
  },
  body: {
    padding: "18px"
  },
  badge: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: "20px",
    background: "rgba(124,58,237,0.25)",
    color: "#e9d5ff",
    marginBottom: "10px"
  },
  title: {
    marginBottom: "10px"
  },
  info: {
    color: "#cbd5e1",
    marginBottom: "8px"
  },
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