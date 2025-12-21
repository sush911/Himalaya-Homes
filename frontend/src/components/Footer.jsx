import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { Modal } from 'react-bootstrap';
import { useLanguage } from '../context/LanguageContext';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import TermsOfService from '../pages/TermsOfService';
import FAQ from '../pages/FAQ';

const Footer = () => {
  const { t, language } = useLanguage();
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  return (
    <footer className="footer" style={{ backgroundColor: "#1a1a2e", color: "#fff", padding: "3rem 0 1rem", marginTop: "auto" }}>
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
            <h6 className="mb-3">{t('quickLinks')}</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/" style={{ color: "#fff", textDecoration: "none" }}>{t('home')}</Link></li>
              <li className="mb-2"><Link to="/buy" style={{ color: "#fff", textDecoration: "none" }}>{t('buy')}</Link></li>
              <li className="mb-2"><Link to="/rent" style={{ color: "#fff", textDecoration: "none" }}>{t('rent')}</Link></li>
              <li className="mb-2"><Link to="/sell" style={{ color: "#fff", textDecoration: "none" }}>{t('sell')}</Link></li>
              <li className="mb-2"><Link to="/agents" style={{ color: "#fff", textDecoration: "none" }}>{t('agents')}</Link></li>
            </ul>
          </div>
          
          <div className="col-md-3 mb-4">
            <h6 className="mb-3">{t('company')}</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/contact" style={{ color: "#fff", textDecoration: "none" }}>{t('contact')}</Link></li>
              <li className="mb-2">
                <button
                  onClick={() => setShowPrivacy(true)}
                  style={{ background: "none", border: "none", color: "#fff", textDecoration: "none", cursor: "pointer", padding: 0 }}
                  className="text-start"
                >
                  {language === 'np' ? 'गोपनीयता नीति' : 'Privacy Policy'}
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => setShowTerms(true)}
                  style={{ background: "none", border: "none", color: "#fff", textDecoration: "none", cursor: "pointer", padding: 0 }}
                  className="text-start"
                >
                  {language === 'np' ? 'सेवा की शर्तें' : 'Terms of Service'}
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => setShowFAQ(true)}
                  style={{ background: "none", border: "none", color: "#fff", textDecoration: "none", cursor: "pointer", padding: 0 }}
                  className="text-start"
                >
                  {language === 'np' ? 'बारम्बार सोधिएका प्रश्न' : 'FAQ'}
                </button>
              </li>
            </ul>
          </div>
          
          <div className="col-md-3 mb-4">
            <h6 className="mb-3">{t('contactInfo')}</h6>
            <ul className="list-unstyled">
              <li className="mb-2" style={{ color: "#fff" }}>
                <FaMapMarkerAlt className="me-2" />
                Ward no 2 Thamel, Kathmandu
              </li>
              <li className="mb-2" style={{ color: "#fff" }}>
                <FaPhone className="me-2" />
                908821321
              </li>
              <li className="mb-2" style={{ color: "#fff" }}>
                <FaPhone className="me-2" />
                9821838123
              </li>
              <li className="mb-2" style={{ color: "#fff" }}>
                <FaEnvelope className="me-2" />
                himalayahomes@gmail.com
              </li>
            </ul>
          </div>
        </div>
        
        <hr className="my-4" style={{borderColor: 'rgba(255,255,255,0.2)'}} />
        
        <div className="text-center">
          <p className="mb-0">&copy; 2024 Himalaya Homes. All rights reserved.</p>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      <Modal show={showPrivacy} onHide={() => setShowPrivacy(false)} size="lg" scrollable>
        <Modal.Header closeButton>
          <Modal.Title>{language === 'np' ? 'गोपनीयता नीति' : 'Privacy Policy'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PrivacyPolicy />
        </Modal.Body>
      </Modal>

      {/* Terms of Service Modal */}
      <Modal show={showTerms} onHide={() => setShowTerms(false)} size="lg" scrollable>
        <Modal.Header closeButton>
          <Modal.Title>{language === 'np' ? 'सेवा की शर्तें' : 'Terms of Service'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TermsOfService />
        </Modal.Body>
      </Modal>

      {/* FAQ Modal */}
      <Modal show={showFAQ} onHide={() => setShowFAQ(false)} size="lg" scrollable>
        <Modal.Header closeButton>
          <Modal.Title>{language === 'np' ? 'बारम्बार सोधिएका प्रश्न' : 'FAQ'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FAQ />
        </Modal.Body>
      </Modal>
    </footer>
  );
};

export default Footer;

