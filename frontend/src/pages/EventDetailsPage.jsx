import { useParams, Link } from "react-router-dom";
import dummyEvents from "../data/dummyEvents";

function EventDetailsPage() {
  const { id } = useParams();
  const event = dummyEvents.find((item) => item._id === id);

  if (!event) {
    return <h2 style={{ padding: "30px", color: "white" }}>Event not found</h2>;
  }

  const imageUrl = event.image
    ? event.image
    : "https://placehold.co/700x400?text=No+Image";

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
          <p><strong>Date:</strong> {event.date}</p>
          <p><strong>Registration Deadline:</strong> {event.registrationDeadline}</p>
          <p><strong>Status:</strong> {event.status}</p>
          <p><strong>Capacity:</strong> {event.capacity}</p>
          <p><strong>Registered Count:</strong> {event.registeredCount}</p>
          <p><strong>Description:</strong> {event.description}</p>

          <Link to={`/register/${event._id}`} style={styles.linkBtn}>
            Register Now
          </Link>
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
  }
};

export default EventDetailsPage;