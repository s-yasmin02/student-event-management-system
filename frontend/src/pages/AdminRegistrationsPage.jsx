import { useState, useEffect } from "react";
import { Trash2, Search, Users, Filter } from "lucide-react";
import api from "../services/api";
import "./AdminRegistrations.css";

export default function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [filterPayment, setFilterPayment] = useState("");
  const [filterEvent, setFilterEvent] = useState("");

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/registrations/admin");
      setRegistrations(data);
      setFiltered(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load registrations");
    } finally {
      setLoading(false);
    }
  };

  // Apply filters whenever they change
  useEffect(() => {
    let result = registrations;

    if (search.trim()) {
      const s = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.studentName?.toLowerCase().includes(s) ||
          r.email?.toLowerCase().includes(s) ||
          r.event?.title?.toLowerCase().includes(s) ||
          r.department?.toLowerCase().includes(s)
      );
    }
    if (filterPayment) {
      result = result.filter((r) => r.paymentStatus === filterPayment);
    }
    if (filterEvent) {
      result = result.filter((r) => r.event?._id === filterEvent);
    }

    setFiltered(result);
  }, [search, filterPayment, filterEvent, registrations]);

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this registration? The event seat count will be updated.")) return;
    try {
      await api.delete(`/registrations/admin/${id}`);
      setRegistrations((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove registration");
    }
  };

  // Unique events for filter dropdown
  const uniqueEvents = [
    ...new Map(
      registrations
        .filter((r) => r.event)
        .map((r) => [r.event._id, r.event])
    ).values(),
  ];

  const paymentBadge = (status) => {
    const map = {
      completed: { bg: "rgba(16,185,129,0.15)", color: "#34d399", label: "Paid" },
      pending:   { bg: "rgba(251,191,36,0.15)", color: "#fbbf24", label: "Pending" },
      failed:    { bg: "rgba(239,68,68,0.15)",  color: "#f87171", label: "Failed" },
    };
    const s = map[status] || map.pending;
    return (
      <span style={{ background: s.bg, color: s.color, padding: "4px 10px", borderRadius: "20px", fontSize: "0.78rem", fontWeight: 600 }}>
        {s.label}
      </span>
    );
  };

  if (loading) return <div className="ar-center"><div className="ar-spinner" /></div>;
  if (error)   return <div className="ar-center" style={{ color: "#f87171" }}>⚠️ {error}</div>;

  return (
    <div className="ar-page container animate-fade-in">
      {/* Header */}
      <div className="ar-header">
        <div>
          <h2>Registered Users</h2>
          <p className="text-muted">Manage all event registrations</p>
        </div>
        <div className="ar-stat">
          <Users size={20} />
          <span>{registrations.length} Total Registrations</span>
        </div>
      </div>

      {/* Filters */}
      <div className="ar-filters glass-panel">
        <div className="ar-search">
          <Search size={18} className="ar-search-icon" />
          <input
            type="text"
            placeholder="Search by name, email, event..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ar-input"
          />
        </div>

        <div className="ar-filter-row">
          <div className="ar-filter-item">
            <Filter size={16} />
            <select
              value={filterEvent}
              onChange={(e) => setFilterEvent(e.target.value)}
              className="ar-select"
            >
              <option value="">All Events</option>
              {uniqueEvents.map((ev) => (
                <option key={ev._id} value={ev._id}>{ev.title}</option>
              ))}
            </select>
          </div>

          <div className="ar-filter-item">
            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className="ar-select"
            >
              <option value="">All Payment Status</option>
              <option value="completed">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="ar-stats-row">
        {[
          { label: "Paid", value: registrations.filter(r => r.paymentStatus === "completed").length, color: "#34d399" },
          { label: "Pending", value: registrations.filter(r => r.paymentStatus === "pending").length, color: "#fbbf24" },
          { label: "Failed", value: registrations.filter(r => r.paymentStatus === "failed").length, color: "#f87171" },
        ].map((s) => (
          <div key={s.label} className="ar-stat-card glass-panel">
            <span style={{ fontSize: "1.8rem", fontWeight: 700, color: s.color }}>{s.value}</span>
            <span className="text-muted" style={{ fontSize: "0.85rem" }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="ar-center" style={{ minHeight: "30vh" }}>
          <h3>No registrations found</h3>
        </div>
      ) : (
        <div className="ar-table-wrapper glass-panel">
          <table className="ar-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Student</th>
                <th>Email</th>
                <th>Department</th>
                <th>Year</th>
                <th>Event</th>
                <th>Registered On</th>
                <th>Payment</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r._id}>
                  <td className="text-muted">{i + 1}</td>
                  <td style={{ fontWeight: 600 }}>{r.studentName}</td>
                  <td className="text-muted">{r.email}</td>
                  <td>{r.department}</td>
                  <td>{r.year}</td>
                  <td>
                    <span className="ar-event-pill">
                      {r.event?.title || "—"}
                    </span>
                  </td>
                  <td className="text-muted" style={{ fontSize: "0.82rem" }}>
                    {new Date(r.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric"
                    })}
                  </td>
                  <td>{paymentBadge(r.paymentStatus)}</td>
                  <td>
                    <button
                      className="ar-delete-btn"
                      onClick={() => handleDelete(r._id)}
                      title="Remove registration"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
