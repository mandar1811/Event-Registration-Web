import React, { useState, useEffect } from 'react';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import { fill } from '@cloudinary/url-gen/actions/resize';
import axios from 'axios';

const EventCreationForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    image: null,
    capacity: '',
    venue: '',
    price: '',
    date: ''
  });

  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [cloudinaryImage, setCloudinaryImage] = useState(null);
  const [imageLink, setImageLink] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Initialize Cloudinary
  const cld = new Cloudinary({
    cloud: {
      cloudName: 'drjb6htqa'
    }
  });

  const categories = [
    'Conference', 'Workshops', 'Seminar', 'Concert', 
    'Festival', 'Networking', 'Sports', 'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file
      });
      
      // Create local preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Upload to Cloudinary
      uploadToCloudinary(file);
    }
  };

  const uploadToCloudinary = async (file) => {
    setIsUploading(true);
    
    try {
      // Create a FormData object
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'upload_preset'); // Use your upload preset

      // Make the upload request
      const response = await fetch(`https://api.cloudinary.com/v1_1/drjb6htqa/image/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      console.log('Upload successful:', data);

      // Create a Cloudinary image instance
      const cldImage = cld.image(data.public_id);
      setCloudinaryImage(cldImage);
      setImageLink(data.secure_url);
      setIsUploading(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      setIsUploading(false);
      setErrors({...errors, image: 'Failed to upload image. Please try again.'});
    }
  };

  const validate = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!imageLink) newErrors.image = "Event image is required";
    if (!formData.capacity) newErrors.capacity = "Capacity is required";
    if (!formData.venue.trim()) newErrors.venue = "Venue is required";
    if (!formData.date) newErrors.date = "Date is required";
    
    // Number validation
    if (isNaN(formData.capacity) || parseInt(formData.capacity) <= 0) {
      newErrors.capacity = "Capacity must be a positive number";
    }
    
    // Price validation - ensure it's a valid float
    if (formData.price && (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0)) {
      newErrors.price = "Price must be a valid number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
 

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (validate()) {
    const formattedData = {
      title: formData.title,
      description: formData.description,
      image_url: imageLink,
      capacity: parseInt(formData.capacity),
      venue: formData.venue,
      price: formData.price ? parseFloat(formData.price) : 0,
      date: formData.date,
      categoty: formData.category // Make sure this matches your backend field name
    };

    const token = localStorage.getItem('access_token');
    console.log(formattedData)
    console.log(token)

    try {
      const response = await axios.post(
        'http://localhost:5000/events',{

            "title":formattedData.title,
            "description": formattedData.description,
            "image_url": formattedData.image_url,
            "capacity": formattedData.capacity,
            "venue": formattedData.venue,
            "price": formattedData.price,
            "date":formattedData.date,
            "categoty":formattedData.categoty
        }
       ,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Event created:', response.data);
      alert('Event created successfully!');

   
      setFormData({
        title: '',
        description: '',
        category: '',
        image: null,
        capacity: '',
        venue: '',
        price: '',
        date: ''
      });
      setPreviewImage(null);
      setCloudinaryImage(null);
      setImageLink('');
    } catch (error) {
      console.error('Error submitting event:', error);
      alert('Failed to create event. Please try again.');
    }
  }
};
  

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-8 text-center text-indigo-700">Create New Event</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
     
        <div>
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="title">
            Event Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition ${
              errors.title ? 'border-red-400' : 'border-gray-200 focus:border-indigo-400'
            }`}
            placeholder="Enter captivating event title"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="category">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition ${
                errors.category ? 'border-red-400' : 'border-gray-200 focus:border-indigo-400'
              }`}
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>
          
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="date">
              Event Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition ${
                errors.date ? 'border-red-400' : 'border-gray-200 focus:border-indigo-400'
              }`}
            />
            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
          </div>
        </div>
        
        {/* Two-column layout for venue and capacity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Venue */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="venue">
              Venue <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="venue"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition ${
                errors.venue ? 'border-red-400' : 'border-gray-200 focus:border-indigo-400'
              }`}
              placeholder="Enter event location"
            />
            {errors.venue && <p className="text-red-500 text-sm mt-1">{errors.venue}</p>}
          </div>
          
          {/* Two-column layout for capacity and price */}
          <div className="grid grid-cols-2 gap-4">
            {/* Capacity */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="capacity">
                Capacity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                min="1"
                className={`w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition ${
                  errors.capacity ? 'border-red-400' : 'border-gray-200 focus:border-indigo-400'
                }`}
                placeholder="Max attendees"
              />
              {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>}
            </div>
            
            {/* Price */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="price">
                Price
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className={`w-full pl-7 px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition ${
                    errors.price ? 'border-red-400' : 'border-gray-200 focus:border-indigo-400'
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>
          </div>
        </div>
        
        {/* Description */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="description">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className={`w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition ${
              errors.description ? 'border-red-400' : 'border-gray-200 focus:border-indigo-400'
            }`}
            placeholder="Describe your amazing event..."
          ></textarea>
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>
        
        {/* Image Upload with Cloudinary */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="image">
            Event Image <span className="text-red-500">*</span>
          </label>
          
          <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
            errors.image ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
          } transition-all duration-200`}>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            
            {!previewImage ? (
              <label htmlFor="image" className="cursor-pointer">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <p className="text-gray-500">Click to upload event image</p>
                  <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                </div>
              </label>
            ) : (
              <div className="relative">
                {cloudinaryImage ? (
                  <div className="max-h-64 overflow-hidden rounded-lg shadow-md mx-auto">
                    <AdvancedImage 
                      cldImg={cloudinaryImage.resize(fill().width(500).height(300))} 
                      alt="Event Preview"
                    />
                  </div>
                ) : (
                  <img 
                    src={previewImage} 
                    alt="Event Preview" 
                    className="max-h-64 mx-auto rounded-lg shadow-md"
                  />
                )}
                
                <button
                  type="button"
                  onClick={() => {
                    setPreviewImage(null);
                    setFormData({...formData, image: null});
                    setImageLink('');
                    setCloudinaryImage(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
                
                {isUploading ? (
                  <div className="mt-2 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600 mr-2"></div>
                    <span className="text-sm text-indigo-600">Uploading to Cloudinary...</span>
                  </div>
                ) : imageLink && (
                  <div className="mt-2 text-center">
                    <p className="text-sm text-green-600">✓ Uploaded to Cloudinary</p>
                    <p className="text-xs text-gray-500 mt-1 truncate">{imageLink}</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isUploading}
            className={`px-8 py-3 rounded-lg font-semibold text-white shadow-md transition-all 
              ${isUploading 
                ? 'bg-indigo-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg transform hover:-translate-y-0.5'}`}
          >
            {isUploading ? 'Processing...' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventCreationForm;