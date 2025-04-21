import React, { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";

// NOTE: You'll need to install EmailJS:
// npm install @emailjs/browser

function TicketFormModal({ show, setShow, event, isLoading, setIsLoading }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Reset form data when the modal is closed
  useEffect(() => {
    if (!show) {
      setFormSubmitted(false);
      setError("");
    }
  }, [show]);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Form validation
    if (!formData.name || !formData.email || !formData.phone) {
      setError("Please fill all required fields");
      setIsLoading(false);
      return;
    }

    try {
      // Prepare template parameters for EmailJS
      const templateParams = {
        to_email: formData.email,
        to_name: formData.name,
        from_name: "Event Portal Team",
        event_name: event.title,  
        event_date: formatDate(event.date),
        event_venue: event.venue,
        event_category: event.category,
        event_price: event.price == 0 ? "Free" : `Rs${event.price}`,
        user_name: formData.name,
        user_email: formData.email,
        user_phone: formData.phone,
        reply_to: "noreply@eventportal.com",
      };

      // Replace these with your actual EmailJS service ID, template ID, and public key
      // You'll need to sign up at emailjs.com and create a template
      await emailjs.send(
        "service_1hd21ss", // Replace with your EmailJS service ID
        "template_xq7ztij", // Replace with your EmailJS template ID
        templateParams,
        "oxkr26hQnmpE6eyUy" // Replace with your EmailJS public key
      );

      setFormSubmitted(true);
    } catch (error) {
      console.error("Email sending failed:", error);
      setError("Failed to send registration email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render anything if modal is not shown
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
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>

        {formSubmitted ? (
          <div className="text-center">
            <svg
              className="w-16 h-16 text-green-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            <h3 className="text-xl font-bold mb-2">Registration Successful!</h3>
            <p className="mb-4">
              Thank you for registering for {event.title}.
            </p>
            <p className="mb-4 text-sm text-gray-600">
              A confirmation email has been sent to your email address.
            </p>
            <button
              onClick={() => {
                setShow(false);
                setFormData({ name: "", email: "", phone: "" });
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-bold mb-6">
              Register for {event.title}
            </h3>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="phone"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>

              <p className="mb-4">
                Event Details:
                <ul className="list-disc ml-5 mt-2">
                  <li>Date: {formatDate(event.date)}</li>
                  <li>Venue: {event.venue}</li>
                  <li>Category: {event.category}</li>
                  <li>Price: {event.price == 0 ? "Free" : `Rs${event.price}`}</li>
                </ul>
              </p>

              <p className="text-sm text-gray-600 mb-4">
                By clicking "Register", you'll receive a confirmation email with your
                registration details.
              </p>

              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Register"
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default TicketFormModal;