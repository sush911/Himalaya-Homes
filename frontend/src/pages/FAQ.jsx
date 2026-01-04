import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FaChevronDown, FaQuestionCircle, FaEnvelope, FaPhone } from 'react-icons/fa';

const FAQ = () => {
  const { language } = useLanguage();
  const [expandedId, setExpandedId] = useState(0);

  const content = {
    en: {
      title: "Frequently Asked Questions",
      subtitle: "Find answers to common questions about using Himalaya Homes",
      faqs: [
        {
          question: "How do I create an account on Himalaya Homes?",
          answer: "Click on the 'Sign Up' button in the top right corner of the website. Fill in your details including email, password, and name. Verify your email by clicking the link sent to your email address. Your account is now ready to use!"
        },
        {
          question: "How can I list a property for sale or rent?",
          answer: "After logging in, navigate to 'Sell' or 'Rent' section. Click 'List Property' and fill in all required details including property type, price, location, photos, and amenities. Submit the form and wait for admin verification. Once approved, your property will be listed."
        },
        {
          question: "How do I search for properties?",
          answer: "Use the search bar on the homepage or visit the Buy/Rent sections. You can filter properties by location, price range, property type, bedrooms, and other amenities. Advanced search options are available in the filters sidebar."
        },
        {
          question: "Can I save properties as favorites?",
          answer: "Yes! Click the heart icon on any property card or property detail page to save it to your favorites. You can view all saved properties in your profile under 'My Saved Properties'."
        },
        {
          question: "How do I contact a property owner?",
          answer: "Click the 'Contact Us' button on the property detail page. You'll need to be logged in. The owner's contact information will be displayed in a modal, and you can reach out directly."
        },
        {
          question: "How do I leave a review for a property?",
          answer: "On the property detail page, scroll to the 'Reviews' section. If you're logged in, you can rate the property (1-5 stars) and optionally add a comment. Click 'Submit Review' to post your feedback."
        },
        {
          question: "What does the 'Verified' badge mean?",
          answer: "The Verified badge indicates that the property has been authenticated and verified by our team. This gives you confidence that the listing is authentic and trustworthy."
        },
        {
          question: "How do I reset my password?",
          answer: "Click on 'Forgot Password' on the login page. Enter your email address and we'll send you a link to reset your password. Click the link and create a new password."
        },
        {
          question: "Can I report a fraudulent listing?",
          answer: "Yes! On the property detail page, click the 'Report' button. Select the reason (fraudulent, suspicious, or scam) and submit. Our team will review the report and take appropriate action."
        },
        {
          question: "How long does it take for my listing to be approved?",
          answer: "Property listings typically require 24-48 hours for admin review and verification. You'll receive an email notification once your property is approved or if any changes are requested."
        },
        {
          question: "Is my personal information secure?",
          answer: "Yes, we take security seriously. All data is encrypted and stored securely. Please refer to our Privacy Policy for detailed information about how we handle and protect your data."
        },

      ]
    },
    np: {
      title: "बारम्बार सोधिएका प्रश्नहरु",
      subtitle: "हिमालय होम्स उपयोग गरेर सामान्य प्रश्नहरुको उत्तर खोज्नुहोस्",
      faqs: [
        {
          question: "हिमालय होम्समा खाता कसरी बनाउने?",
          answer: "वेबसाइटको दायाँ कोनामा 'साइन अप' बटनमा क्लिक गर्नुहोस्। ईमेल, पासवर्ड र नाम सहित आपनो विवरण भरिदिनुहोस्। आपनो ईमेलमा पठाइएको लिङ्कमा क्लिक गरी ईमेल प्रमाणित गर्नुहोस्। अब आपनो खाता उपयोगको लागि तयार छ!"
        },
        {
          question: "सम्पत्ति बिक्रीको लागि वा भाडामा सूचीबद्ध कसरी गर्ने?",
          answer: "लगइन गरेपछि 'बेच्न' वा 'भाडामा' खण्डमा जानुहोस्। 'सम्पत्ति सूचीबद्ध गर्नुहोस्' मा क्लिक गर्नुहोस् र सम्पत्तीको प्रकार, मूल्य, अवस्थान, फोटो र सुविधाहरु सहित सबै आवश्यक विवरण भरिदिनुहोस्। फार्म जमा गर्नुहोस् र व्यवस्थापक प्रमाणीकरणको प्रतीक्षा गर्नुहोस्। अनुमोदन गरिसके पछी, आपनो सम्पत्ति सूचीबद्ध गरिनेछ।"
        },
        {
          question: "सम्पत्तीहरु कसरी खोज्ने?",
          answer: "होमपेजमा खोज पट्टी प्रयोग गर्नुहोस् वा खरिद/भाडा खण्डहरु भ्रमण गर्नुहोस्। तपाई अवस्थान, मूल्य दायरा, सम्पत्तीको प्रकार, शयनकक्ष र अन्य सुविधाहरु द्वारा सम्पत्तीहरु फिल्टर गर्न सक्नुहुन्छ। उन्नत खोज विकल्पहरु फिल्टर साइडबारमा उपलब्ध छन्।"
        },
        {
          question: "के मैले सम्पत्तीहरु पसंदको रुपमा बचाउन सक्छु?",
          answer: "हो! कुनै पनि सम्पत्ती कार्ड वा सम्पत्ती विस्तार पृष्ठमा हृदय आइकनमा क्लिक गर्नुहोस् यो आपनो पसंदमा बचाउन। आपनो प्रोफाइलमा 'मेरी बचाइएको सम्पत्तीहरु' अन्तर्गत सबै बचाइएका सम्पत्तीहरु हेर्न सक्नुहुन्छ।"
        },
        {
          question: "सम्पत्तीको मालिकलाई कसरी सम्पर्क गर्ने?",
          answer: "सम्पत्ती विस्तार पृष्ठमा 'हामीलाई सम्पर्क गर्नुहोस्' बटनमा क्लिक गर्नुहोस्। तपाई लगइन गरिएको हुनु पर्छ। मालिकको सम्पर्क जानकारी एक मोडेलमा प्रदर्शित हुनेछ र तपाई सीधै सम्पर्क गर्न सक्नुहुन्छ।"
        },
        {
          question: "सम्पत्तीको लागि समीक्षा कसरी छोड्ने?",
          answer: "सम्पत्ती विस्तार पृष्ठमा 'समीक्षा' खण्डमा स्क्रोल गर्नुहोस्। यदि तपाई लगइन गरिएको छ भने, तपाई सम्पत्तीलाई (१-५ तारे) मूल्यांकन गर्न सक्नुहुन्छ र वैकल्पिक रुपमा एक टिप्पणी जोड्न सक्नुहुन्छ। आपनो प्रतिक्रिया पोस्ट गर्न 'समीक्षा जमा गर्नुहोस्' मा क्लिक गर्नुहोस्।"
        },
        {
          question: "'सत्यापित' ब्याज का अर्थ के हो?",
          answer: "सत्यापित ब्याज संकेत गर्दछ कि सम्पत्ति हमारो टिमद्वारा प्रमाणित र सत्यापित गरिएको हो। यो तपाईलाई विश्वास दिन्छ कि सूचीकरण प्रामाणिक र विश्वस्त हो।"
        },
        {
          question: "मेरो पासवर्ड कसरी रिसेट गर्ने?",
          answer: "लगइन पृष्ठमा 'पासवर्ड भूल्नुभयो' मा क्लिक गर्नुहोस्। आपनो ईमेल पता प्रविष्ट गर्नुहोस् र हम तपाईलाई आपनो पासवर्ड रिसेट गर्न लिङ्क पठाउनेछु। लिङ्कमा क्लिक गर्नुहोस् र नयाँ पासवर्ड सिर्जना गर्नुहोस्।"
        },
        {
          question: "के मैले एक जालसाज सूचीकरण रिपोर्ट गर्न सक्छु?",
          answer: "हो! सम्पत्ती विस्तार पृष्ठमा 'रिपोर्ट' बटनमा क्लिक गर्नुहोस्। कारण (जालसाज, संदिग्ध, वा स्क्याम) चयन गर्नुहोस् र जमा गर्नुहोस्। हमारो टिमले रिपोर्ट समीक्षा गरेर उपयुक्त कार्रवाई गरनेछ।"
        },
        {
          question: "मेरो सूचीकरण अनुमोदन हुन कति समय लाग्छ?",
          answer: "सम्पत्ती सूचीकरणहरु सामान्यतया व्यवस्थापक समीक्षा र सत्यापनको लागि २४-४८ घण्टा आवश्यक हुन्छ। आपनो सम्पत्ति अनुमोदन भएपछी वा कुनै परिवर्तन अनुरोध गरिएपछी तपाईले ईमेल सूचना प्राप्त गरनुभेला।"
        },
        {
          question: "के मेरी व्यक्तिगत जानकारी सुरक्षित छ?",
          answer: "हो, हम सुरक्षालाई गम्भीरतापूर्वक लिन्छु। सबै डेटा एन्क्रिप्ट गरिएको र सुरक्षित रुपमा संग्रहीत हुन्छ। हम आपनो डेटा कसरी हेरफेर र संरक्षण गर्छु भन्ने बारे विस्तृत जानकारीको लागि कृपया हमारो गोपनीयता नीति को सन्दर्भ लिनुहोस्।"
        },

      ]
    }
  };

  const currentContent = content[language === 'np' ? 'np' : 'en'];

  const toggleFAQ = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 500px;
          }
        }
        
        .faq-container {
          padding: 60px 20px;
          background: linear-gradient(180deg, #FAFBFC 0%, #FFFFFF 100%);
          min-height: 100vh;
        }
        
        .faq-header {
          text-align: center;
          margin-bottom: 50px;
          animation: fadeInUp 0.8s ease-out;
        }
        
        .faq-icon-wrapper {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #2B5BBA 0%, #1E3A5F 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          box-shadow: 0 8px 24px rgba(43, 91, 186, 0.3);
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .faq-title {
          font-size: 42px;
          font-weight: 800;
          color: #1E3A5F;
          margin-bottom: 16px;
          letter-spacing: -1px;
        }
        
        .faq-subtitle {
          font-size: 18px;
          color: #666;
          font-weight: 500;
          max-width: 600px;
          margin: 0 auto;
        }
        
        .faq-card {
          background: #fff;
          border: 2px solid #E0E0E0;
          border-radius: 16px;
          margin-bottom: 16px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          animation: fadeInUp 0.6s ease-out backwards;
        }
        
        .faq-card:nth-child(1) { animation-delay: 0.1s; }
        .faq-card:nth-child(2) { animation-delay: 0.15s; }
        .faq-card:nth-child(3) { animation-delay: 0.2s; }
        .faq-card:nth-child(4) { animation-delay: 0.25s; }
        .faq-card:nth-child(5) { animation-delay: 0.3s; }
        .faq-card:nth-child(6) { animation-delay: 0.35s; }
        
        .faq-card:hover {
          border-color: #2B5BBA;
          box-shadow: 0 8px 24px rgba(43, 91, 186, 0.15);
          transform: translateY(-4px);
        }
        
        .faq-card.active {
          border-color: #2B5BBA;
          box-shadow: 0 8px 24px rgba(43, 91, 186, 0.2);
        }
        
        .faq-question-btn {
          width: 100%;
          text-align: left;
          padding: 24px 28px;
          background: #fff;
          border: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          transition: all 0.3s ease;
          gap: 16px;
        }
        
        .faq-question-btn:hover {
          background: #F5F5F5;
        }
        
        .faq-question-text {
          font-size: 17px;
          font-weight: 700;
          color: #1E3A5F;
          margin: 0;
          line-height: 1.5;
        }
        
        .faq-icon {
          flex-shrink: 0;
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #2B5BBA 0%, #1E3A5F 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          transition: all 0.3s ease;
        }
        
        .faq-card.active .faq-icon {
          transform: rotate(180deg);
        }
        
        .faq-answer {
          padding: 0 28px 28px 28px;
          border-top: 2px solid #F5F5F5;
          animation: slideDown 0.4s ease-out;
        }
        
        .faq-answer-text {
          font-size: 15px;
          color: #333;
          line-height: 1.8;
          margin: 20px 0 0 0;
        }
        
        .contact-card {
          background: linear-gradient(135deg, #2B5BBA 0%, #1E3A5F 100%);
          border-radius: 20px;
          padding: 40px;
          margin-top: 60px;
          box-shadow: 0 12px 40px rgba(43, 91, 186, 0.3);
          animation: fadeInUp 0.8s ease-out 0.4s backwards;
        }
        
        .contact-card-title {
          font-size: 24px;
          font-weight: 800;
          color: #fff;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .contact-card-text {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.95);
          margin: 0;
          line-height: 1.8;
        }
        
        .contact-info-row {
          display: flex;
          flex-wrap: wrap;
          gap: 24px;
          margin-top: 24px;
        }
        
        .contact-info-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 24px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        
        .contact-info-item:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-2px);
        }
        
        .contact-icon {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          flex-shrink: 0;
        }
        
        .contact-text {
          font-size: 15px;
          color: #fff;
          font-weight: 600;
          margin: 0;
        }
        
        @media (max-width: 768px) {
          .faq-container {
            padding: 40px 16px;
          }
          
          .faq-title {
            font-size: 32px;
          }
          
          .faq-subtitle {
            font-size: 16px;
          }
          
          .faq-question-btn {
            padding: 20px;
          }
          
          .faq-question-text {
            font-size: 15px;
          }
          
          .faq-answer {
            padding: 0 20px 20px 20px;
          }
          
          .contact-card {
            padding: 28px;
          }
          
          .contact-info-row {
            flex-direction: column;
          }
        }
      `}</style>
      
      <div className="faq-container container">
        <div className="faq-header">
          <div className="faq-icon-wrapper">
            <FaQuestionCircle size={40} color="#fff" />
          </div>
          <h1 className="faq-title">{currentContent.title}</h1>
          <p className="faq-subtitle">{currentContent.subtitle}</p>
        </div>

        <div className="row">
          <div className="col-lg-8 mx-auto">
            {currentContent.faqs.map((faq, idx) => (
              <div key={idx} className={`faq-card ${expandedId === idx ? 'active' : ''}`}>
                <button
                  className="faq-question-btn"
                  onClick={() => toggleFAQ(idx)}
                  aria-expanded={expandedId === idx}
                >
                  <span className="faq-question-text">{faq.question}</span>
                  <div className="faq-icon">
                    <FaChevronDown size={16} />
                  </div>
                </button>

                {expandedId === idx && (
                  <div className="faq-answer">
                    <p className="faq-answer-text">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8 mx-auto">
            <div className="contact-card">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '32px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1', minWidth: '250px' }}>
                  <h6 className="contact-card-title">
                    <FaQuestionCircle size={24} />
                    {language === 'np' ? 'अझै प्रश्न छ?' : 'Still have questions?'}
                  </h6>
                  <p className="contact-card-text">
                    {language === 'np'
                      ? 'कृपया हामीसँग सम्पर्क गर्नुहोस्। हामी तपाईंको सहायता गर्न यहाँ छौं!'
                      : 'Please contact us. We are here to help you!'}
                  </p>
                </div>
                <div className="contact-info-row" style={{ flex: '1', minWidth: '300px', margin: 0 }}>
                  <div className="contact-info-item" style={{ flex: 1 }}>
                    <div className="contact-icon">
                      <FaEnvelope size={18} />
                    </div>
                    <p className="contact-text">himalayahomes@gmail.com</p>
                  </div>
                  <div className="contact-info-item" style={{ flex: 1 }}>
                    <div className="contact-icon">
                      <FaPhone size={18} />
                    </div>
                    <p className="contact-text">908821321</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQ;