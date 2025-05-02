import React, { useState, useEffect } from "react";
import axios from "axios";

function TicketFormModal({ show, setShow, event, isLoading, setIsLoading, userRegistered, setUserRegistered }) {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // Reset form state when modal is opened
    if (show && !userRegistered) {
      setFormSubmitted(false);
      setError("");
      setFormData({ name: "", email: "", phone: "" });
    }
  }, [show, userRegistered]);

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
    setProcessing(true);
    setError("");

    if (!formData.name || !formData.email || !formData.phone) {
      setError("Please fill all required fields.");
      setProcessing(false);
      return;
    }

    try {
      const token = localStorage.getItem("access_token");

      // Register user
      await axios.post(`http://localhost:5000/events/${event.id}/register`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      // Send confirmation email
      const emailPayload = {
        user_name: formData.name,
        user_email: formData.email,
        user_phone: formData.phone,
        event_name: event.title,
        event_date: formatDate(event.date),
        event_venue: event.venue,
        event_category: event.category,
        event_price: event.price === 0 ? "Free" : `Rs${event.price}`,
      };
      
      await axios.post("http://localhost:5000/send-confirmation", emailPayload);
      
      // Set the form as submitted and user as registered
      setFormSubmitted(true);
      setUserRegistered(true);
      
      // Store registration status in sessionStorage
      sessionStorage.setItem(`registration-success-${event.id}`, 'true');
      
      // Show success notification
      const successNotificationElement = document.createElement('div');
      successNotificationElement.className = "fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg z-50 flex items-center animate-fade-in-up";
      successNotificationElement.innerHTML = `
        <div class="mr-2 text-2xl">✓</div>
        <div>
          <p class="font-bold">Registration Successful!</p>
          <p class="text-sm">You've successfully registered for ${event.title}</p>
        </div>
      `;
      document.body.appendChild(successNotificationElement);
      
      // Remove notification after 3 seconds
      setTimeout(() => {
        if (document.body.contains(successNotificationElement)) {
          document.body.removeChild(successNotificationElement);
        }
      }, 5000);
      
      // Close the modal after a delay
      setTimeout(() => {
        setShow(false);
      },10000);
      
    } catch (err) {
      console.error("Error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const handleCloseModal = (e) => {
    if (e) e.preventDefault();
    setShow(false);
  };

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [show]);

  return (
    <>
      {show && (
        <div className="fixed inset-0 flex items-center justify-center z-50" onClick={(e) => e.target === e.currentTarget && handleCloseModal(e)}>
          <div className="fixed inset-0 bg-black bg-opacity-50"></div>

          <div className="bg-white rounded-lg p-8 max-w-md w-full relative z-10" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              type="button"
            >
              ×
            </button>

            {formSubmitted || userRegistered ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-500 text-3xl">✓</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Registration Successful!</h3>
                <p className="mb-4">
                  Thank you for registering for {event.title}. A confirmation email has been sent.
                </p>
                <button
                  onClick={handleCloseModal}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                  type="button"
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
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
                    disabled={processing || userRegistered}
                  >
                    {processing ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        <span>Processing...</span>
                      </div>
                    ) : userRegistered ? (
                      "Already Registered"
                    ) : (
                      "Register"
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default TicketFormModal;
