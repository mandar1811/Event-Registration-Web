import React, { useState, useEffect } from "react";
import axios from "axios";

function TicketFormModal({ show, setShow, event, isLoading, setIsLoading }) {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!show) {
      setFormSubmitted(false);
      setError("");
      setFormData({ name: "", email: "", phone: "" });
    }
  }, [show]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!formData.name || !formData.email || !formData.phone) {
      setError("Please fill all required fields.");
      setIsLoading(false);
      return;
    }

    const payload = {
      user_name: formData.name,
      user_email: formData.email,
      user_phone: formData.phone,
      event_name: event.title,
      event_date: formatDate(event.date),
      event_venue: event.venue,
      event_category: event.category,
      event_price: event.price === 0 ? "Free" : `Rs${event.price}`,
    };

    try {
      await axios.post("http://localhost:5000/send-confirmation", payload);
      setFormSubmitted(true);
    } catch (err) {
      console.error("Error sending confirmation:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={() => setShow(false)}
      ></div>

      <div className="bg-white rounded-lg p-8 max-w-md w-full relative z-10">
        <button
          onClick={() => setShow(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>

        {formSubmitted ? (
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Registration Successful!</h3>
            <p className="mb-4">
              Thank you for registering for {event.title}. A confirmation email has been sent.
            </p>
            <button
              onClick={() => setShow(false)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-bold mb-6">Register for {event.title}</h3>

            {error && (
              <div className="text-red-600 text-sm mb-4">{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              {["name", "email", "phone"].map((field) => (
                <div key={field} className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2 capitalize">
                    {field.replace("_", " ")} *
                  </label>
                  <input
                    type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleInputChange}
                    className="shadow border rounded w-full py-2 px-3 text-gray-700"
                    required
                  />
                </div>
              ))}

              <div className="text-sm text-gray-600 mb-4">
                <strong>Event:</strong> {event.title}<br />
                <strong>Date:</strong> {formatDate(event.date)}<br />
                <strong>Venue:</strong> {event.venue}<br />
                <strong>Category:</strong> {event.category}<br />
                <strong>Price:</strong> {event.price === 0 ? "Free" : `Rs${event.price}`}
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Register"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default TicketFormModal;
