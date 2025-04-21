import React from 'react'
import { Calendar, MapPin, Users, Clock, ChevronRight, Search } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400">
    <div className="w-[90%] mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="h-6 w-6 text-purple-400" />
            <span className="font-bold text-xl text-white">EventHub</span>
          </div>
          <p className="mb-4">
            Connecting people through memorable events since 2023
          </p>
          <div className="flex space-x-4">
            {/* Social Media Icons would go here */}
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold text-white text-lg mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-purple-400">Browse Events</a></li>
            <li><a href="#" className="hover:text-purple-400">Create Event</a></li>
            <li><a href="#" className="hover:text-purple-400">Pricing</a></li>
            <li><a href="#" className="hover:text-purple-400">FAQs</a></li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold text-white text-lg mb-4">Company</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-purple-400">About Us</a></li>
            <li><a href="#" className="hover:text-purple-400">Our Team</a></li>
            <li><a href="#" className="hover:text-purple-400">Careers</a></li>
            <li><a href="#" className="hover:text-purple-400">Contact</a></li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold text-white text-lg mb-4">Legal</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-purple-400">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-purple-400">Terms of Service</a></li>
            <li><a href="#" className="hover:text-purple-400">Cookie Policy</a></li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-gray-800 mt-12 pt-8 text-center">
        <p>&copy; {new Date().getFullYear()} EventHub. All rights reserved.</p>
      </div>
    </div>
  </footer>
  )
}

export default Footer
