import React, { useState } from "react";
import { Link } from "react-router-dom";
import { submitContact } from "../api/contact";
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

const Contact = () => {
  const token = localStorage.getItem("token");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Please login to contact us");
      return;
    }

    if (!form.name || !form.email || !form.phone || !form.message) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      await submitContact(form, token);
      setMessage("Message sent successfully! We'll get back to you soon.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setMessage(err?.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning text-center">
          <h4>Please Login to Contact Us</h4>
          <p>You need to be logged in to send us a message.</p>
          <Link to="/login" className="btn btn-primary">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="position-relative" style={{ minHeight: "100vh" }}>
      {/* Background Image */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.3,
          zIndex: 0,
        }}
      />

      <div className="container py-5 position-relative" style={{ zIndex: 1 }}>
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card shadow-lg" style={{ borderRadius: "20px", overflow: "hidden" }}>
              <div className="row g-0">
                {/* Left Column - Contact Form */}
                <div className="col-lg-6 bg-primary text-white p-5">
                  <h2 className="mb-4">Get in touch</h2>
                  {message && (
                    <div className={`alert ${message.includes("success") ? "alert-success" : "alert-danger"}`}>
                      {message}
                    </div>
                  )}
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <input
                        type="text"
                        name="name"
                        className="form-control form-control-lg"
                        placeholder="Your name"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="email"
                        name="email"
                        className="form-control form-control-lg"
                        placeholder="Your mail"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="tel"
                        name="phone"
                        className="form-control form-control-lg"
                        placeholder="Your phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <textarea
                        name="message"
                        className="form-control form-control-lg"
                        rows="5"
                        placeholder="Your message"
                        value={form.message}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-light btn-lg w-100"
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Send message"}
                    </button>
                  </form>
                </div>

                {/* Right Column - Contact Info */}
                <div className="col-lg-6 p-5 bg-light">
                  <h2 className="mb-4">Feel free to contact us</h2>
                  <div className="mb-4">
                    <p className="mb-3">
                      <FaMapMarkerAlt className="me-2 text-primary" />
                      <strong>Ward no 2 Thamel, Kathmandu</strong>
                    </p>
                    <p className="mb-3">
                      <FaPhone className="me-2 text-primary" />
                      <strong>908821321323</strong>
                    </p>
                    <p className="mb-3">
                      <FaPhone className="me-2 text-primary" />
                      <strong>9821838123</strong>
                    </p>
                    <p className="mb-3">
                      <FaEnvelope className="me-2 text-primary" />
                      <strong>himalayahomes@gmail.com</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

