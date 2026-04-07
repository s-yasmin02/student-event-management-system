import { useState } from "react";
import { useNavigate } from "react-router-dom";

function PaymentPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    cardNumber: "",
    expMonth: "",
    expYear: "",
    cvv: ""
  });

  const [showPortal, setShowPortal] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "cardNumber") {
      value = value.replace(/\D/g, "").slice(0, 16);
      value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    }

    if (name === "expMonth" || name === "expYear" || name === "cvv") {
      value = value.replace(/\D/g, "");
    }

    setForm({
      ...form,
      [name]: value
    });
  };

  const handleOpenPortal = (e) => {
    e.preventDefault();
    setShowPortal(true);
  };

  const handleCompletePayment = () => {
    setProcessing(true);

    setTimeout(() => {
      setProcessing(false);
      alert("Payment Successful ✅");
      navigate("/");
    }, 2000);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Payment</h1>

        <form onSubmit={handleOpenPortal} style={styles.form}>
          <label style={styles.label}>Card Holder Name</label>
          <input
            type="text"
            name="name"
            placeholder="John Doe"
            value={form.name}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <label style={styles.label}>Card Number</label>
          <input
            type="text"
            name="cardNumber"
            placeholder="0000 0000 0000 0000"
            maxLength="19"
            value={form.cardNumber}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <div style={styles.row}>
            <div style={styles.smallField}>
              <label style={styles.label}>Expiry Month</label>
              <input
                type="text"
                name="expMonth"
                placeholder="MM"
                maxLength="2"
                value={form.expMonth}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.smallField}>
              <label style={styles.label}>Expiry Year</label>
              <input
                type="text"
                name="expYear"
                placeholder="YY"
                maxLength="2"
                value={form.expYear}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.smallField}>
              <label style={styles.label}>CVV</label>
              <input
                type="password"
                name="cvv"
                placeholder="***"
                maxLength="3"
                value={form.cvv}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
          </div>

          <button type="submit" style={styles.button}>
            Proceed to Payment
          </button>
        </form>
      </div>

      {showPortal && (
        <div style={styles.overlay}>
          <div style={styles.portalBox}>
            <h2 style={styles.portalTitle}>Secure Payment Portal</h2>
            <p style={styles.portalText}>
              Confirm your payment to complete the booking.
            </p>

            <div style={styles.portalCard}>
              <p style={styles.portalLine}>
                <strong>Card Holder:</strong> {form.name}
              </p>
              <p style={styles.portalLine}>
                <strong>Card Number:</strong> **** **** **** {form.cardNumber.replace(/\s/g, "").slice(-4)}
              </p>
            </div>

            <button
              onClick={handleCompletePayment}
              style={styles.portalButton}
              disabled={processing}
            >
              {processing ? "Processing..." : "Complete Payment"}
            </button>

            <button
              onClick={() => setShowPortal(false)}
              style={styles.cancelButton}
              disabled={processing}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
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
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "10px"
  },
  smallField: {
    width: "100%"
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
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.65)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999
  },
  portalBox: {
    width: "420px",
    maxWidth: "92%",
    background: "#111827",
    color: "white",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
    textAlign: "center"
  },
  portalTitle: {
    marginBottom: "10px"
  },
  portalText: {
    marginBottom: "20px",
    color: "#d1d5db"
  },
  portalCard: {
    background: "rgba(255,255,255,0.05)",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "20px",
    textAlign: "left"
  },
  portalLine: {
    margin: "8px 0"
  },
  portalButton: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #7c3aed, #ec4899)",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    marginBottom: "10px"
  },
  cancelButton: {
    width: "100%",
    padding: "12px",
    border: "1px solid #555",
    borderRadius: "8px",
    background: "transparent",
    color: "white",
    cursor: "pointer"
  }
};

export default PaymentPage;