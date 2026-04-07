import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/events");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load events");
      }

      setEvents(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2 style={styles.message}>Loading events...</h2>;
  }

  if (error) {
    return <h2 style={styles.error}>{error}</h2>;
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>All Events</h1>

      <div style={styles.grid}>
        {events.length > 0 ? (
          events.map((event) => <EventCard key={event._id} event={event} />)
        ) : (
          <p style={styles.message}>No events found</p>
        )}
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
  message: {
    color: "white",
    padding: "30px"
  },
  error: {
    color: "#f87171",
    padding: "30px"
  }
};

export default EventsPage;