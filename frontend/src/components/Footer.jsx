import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4">
            <h5 className="mb-3">🏔️ Himalaya Homes</h5>
            <p>Your trusted partner in finding the perfect property in the Himalayan region.</p>
            <div className="social-links mt-3">
              <a href="#" className="me-3"><FaFacebook size={24} /></a>
              <a href="#" className="me-3"><FaTwitter size={24} /></a>
              <a href="#" className="me-3"><FaInstagram size={24} /></a>
              <a href="#"><FaLinkedin size={24} /></a>
            </div>
          </div>
          
          <div className="col-md-2 mb-4">
            <h6 className="mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/">Home</Link></li>
              <li className="mb-2"><Link to="/properties?type=sale">Buy</Link></li>
              <li className="mb-2"><Link to="/properties?type=rent">Rent</Link></li>
              <li className="mb-2"><Link to="/sell">Sell</Link></li>
              <li className="mb-2"><Link to="/agents">Agents</Link></li>
            </ul>
          </div>
          
          <div className="col-md-3 mb-4">
            <h6 className="mb-3">Company</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/about">About Us</Link></li>
              <li className="mb-2"><Link to="/contact">Contact</Link></li>
              <li className="mb-2"><Link to="/privacy">Privacy Policy</Link></li>
              <li className="mb-2"><Link to="/terms">Terms of Service</Link></li>
            </ul>
          </div>
          
          <div className="col-md-3 mb-4">
            <h6 className="mb-3">Contact Info</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <FaMapMarkerAlt className="me-2" />
                Kathmandu, Nepal
              </li>
              <li className="mb-2">
                <FaPhone className="me-2" />
                +977 123 456 7890
              </li>
              <li className="mb-2">
                <FaEnvelope className="me-2" />
                info@himalayahomes.com
              </li>
            </ul>
          </div>
        </div>
        
        <hr className="my-4" style={{borderColor: 'rgba(255,255,255,0.2)'}} />
        
        <div className="text-center">
          <p className="mb-0">&copy; 2024 Himalaya Homes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;