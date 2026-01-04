import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FaShieldAlt, FaLock, FaUserShield, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const PrivacyPolicy = () => {
  const { language } = useLanguage();

  const content = {
    en: {
      title: "Privacy Policy",
      lastUpdated: "Last Updated: December 2024",
      sections: [
        {
          heading: "1. Introduction",
          icon: <FaShieldAlt />,
          content: "Himalaya Homes is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services."
        },
        {
          heading: "2. Information We Collect",
          icon: <FaUserShield />,
          content: "We may collect information about you in a variety of ways. The information we may collect on the site includes:\n• Personal Data: Name, email address, phone number, address\n• Payment Information: Credit card details and billing information\n• Usage Data: IP address, browser type, pages visited, time spent on pages\n• Cookies and Tracking Data: Information stored through cookies and similar technologies"
        },
        {
          heading: "3. How We Use Your Information",
          icon: <FaLock />,
          content: "Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:\n• Create and manage your account\n• Process your transactions\n• Email you regarding your account or order\n• Fulfill and ship your orders\n• Generate a personal profile about you\n• Increase the efficiency and operation of the Site\n• Monitor and analyze usage and trends to improve your experience"
        },
        {
          heading: "4. Disclosure of Your Information",
          icon: <FaUserShield />,
          content: "We may share information we have collected about you in certain situations:\n• By Law or to Protect Rights: If we believe the release of information is necessary to comply with the law\n• Third-Party Service Providers: We may share your information with parties who assist us in operating our website and conducting our business\n• With Your Consent: We may disclose your personal information with your prior consent to do so"
        },
        {
          heading: "5. Security of Your Information",
          icon: <FaShieldAlt />,
          content: "We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable."
        },
        {
          heading: "6. Contact Us",
          icon: <FaEnvelope />,
          content: "If you have questions or comments about this Privacy Policy, please contact us at:\nEmail: himalayahomes@gmail.com\nPhone: 908821321\nAddress: Ward no 2 Thamel, Kathmandu, Nepal"
        }
      ]
    },
    np: {
      title: "गोपनीयता नीति",
      lastUpdated: "अन्तिम अपडेट: डिसेम्बर २०२४",
      sections: [
        {
          heading: "१. परिचय",
          icon: <FaShieldAlt />,
          content: "हिमालय होम्स तपाईंको गोपनीयताको सुरक्षा गर्न प्रतिबद्ध छ। यो गोपनीयता नीतिले तपाईंले हाम्रो वेबसाइट भ्रमण गर्दा र हाम्रा सेवाहरू प्रयोग गर्दा हामीले तपाईंको जानकारी कसरी सङ्कलन, प्रयोग, खुलासा र सुरक्षित गर्छौं भनेर व्याख्या गर्दछ।"
        },
        {
          heading: "२. हामीले कुन जानकारी सङ्कलन गर्छौं",
          icon: <FaUserShield />,
          content: "हामी विभिन्न तरिकाले तपाईंको बारेमा जानकारी सङ्कलन गर्न सक्छौं। साइटमा हामीले सङ्कलन गर्न सक्ने जानकारीमा समावेश छ:\n• व्यक्तिगत डेटा: नाम, इमेल ठेगाना, फोन नम्बर, ठेगाना\n• भुक्तानी जानकारी: क्रेडिट कार्ड विवरण र बिलिङ जानकारी\n• उपयोग डेटा: आईपी ठेगाना, ब्राउजर प्रकार, हेरिएका पृष्ठहरू, पृष्ठहरूमा बिताएको समय\n• कुकीज र ट्र्याकिङ डेटा: कुकीज र समान प्रविधिहरू मार्फत भण्डारण गरिएको जानकारी"
        },
        {
          heading: "३. हामीले तपाईंको जानकारी कसरी प्रयोग गर्छौं",
          icon: <FaLock />,
          content: "तपाईंको बारेमा सही जानकारी हुनुले हामीलाई तपाईंलाई सहज, कुशल र अनुकूलित अनुभव प्रदान गर्न सक्षम बनाउँछ। विशेष गरी, हामीले साइट मार्फत तपाईंको बारेमा सङ्कलन गरिएको जानकारी प्रयोग गर्न सक्छौं:\n• तपाईंको खाता सिर्जना र व्यवस्थापन गर्न\n• तपाईंको लेनदेन प्रशोधन गर्न\n• तपाईंको खाता वा अर्डरको बारेमा इमेल गर्न\n• तपाईंको अर्डर पूरा गर्न र पठाउन\n• तपाईंको बारेमा व्यक्तिगत प्रोफाइल उत्पन्न गर्न"
        },
        {
          heading: "४. तपाईंको जानकारीको खुलासा",
          icon: <FaUserShield />,
          content: "हामी केही अवस्थामा तपाईंको बारेमा सङ्कलन गरिएको जानकारी साझा गर्न सक्छौं:\n• कानूनद्वारा वा अधिकारको सुरक्षा गर्न: यदि हामीलाई विश्वास छ कि जानकारीको विमोचन कानूनको पालना गर्न आवश्यक छ\n• तेस्रो-पक्ष सेवा प्रदायकहरू: हामी हाम्रो वेबसाइट सञ्चालन गर्न र हाम्रो व्यवसाय सञ्चालन गर्न सहायता गर्ने पक्षहरूसँग तपाईंको जानकारी साझा गर्न सक्छौं\n• तपाईंको सहमतिसँग: हामी त्यसो गर्नको लागि तपाईंको पूर्व सहमतिसँग तपाईंको व्यक्तिगत जानकारी खुलासा गर्न सक्छौं"
        },
        {
          heading: "५. तपाईंको जानकारीको सुरक्षा",
          icon: <FaShieldAlt />,
          content: "हामी तपाईंको व्यक्तिगत जानकारीको सुरक्षा गर्न मद्दत गर्न प्रशासनिक, प्राविधिक र भौतिक सुरक्षा उपायहरू प्रयोग गर्छौं। जबकि हामीले तपाईंले हामीलाई प्रदान गर्नुभएको व्यक्तिगत जानकारी सुरक्षित गर्न उचित कदमहरू चालेका छौं, कृपया ध्यान दिनुहोस् कि हाम्रा प्रयासहरूको बावजुद, कुनै पनि सुरक्षा उपायहरू पूर्ण वा अभेद्य छैनन्।"
        },
        {
          heading: "६. हामीलाई सम्पर्क गर्नुहोस्",
          icon: <FaEnvelope />,
          content: "यदि तपाईंसँग यस गोपनीयता नीतिको बारेमा प्रश्न वा टिप्पणीहरू छन् भने, कृपया हामीलाई सम्पर्क गर्नुहोस्:\nइमेल: himalayahomes@gmail.com\nफोन: 908821321\nठेगाना: वार्ड नं २ थमेल, काठमाडौं, नेपाल"
        }
      ]
    }
  };

  const currentContent = content[language === 'np' ? 'np' : 'en'];

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
        
        .privacy-container {
          padding: 60px 20px;
          background: linear-gradient(180deg, #FAFBFC 0%, #FFFFFF 100%);
          min-height: 100vh;
        }
        
        .privacy-header {
          text-align: center;
          margin-bottom: 50px;
          animation: fadeInUp 0.8s ease-out;
        }
        
        .privacy-icon-wrapper {
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
        
        .privacy-title {
          font-size: 42px;
          font-weight: 800;
          color: #1E3A5F;
          margin-bottom: 16px;
          letter-spacing: -1px;
        }
        
        .privacy-updated {
          font-size: 15px;
          color: #666;
          font-weight: 500;
          padding: 10px 24px;
          background: #F5F5F5;
          border-radius: 20px;
          display: inline-block;
        }
        
        .privacy-section {
          background: #fff;
          border: 2px solid #E0E0E0;
          border-radius: 16px;
          padding: 32px;
          margin-bottom: 24px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          animation: fadeInUp 0.6s ease-out backwards;
        }
        
        .privacy-section:nth-child(1) { animation-delay: 0.1s; }
        .privacy-section:nth-child(2) { animation-delay: 0.15s; }
        .privacy-section:nth-child(3) { animation-delay: 0.2s; }
        .privacy-section:nth-child(4) { animation-delay: 0.25s; }
        .privacy-section:nth-child(5) { animation-delay: 0.3s; }
        .privacy-section:nth-child(6) { animation-delay: 0.35s; }
        
        .privacy-section:hover {
          border-color: #2B5BBA;
          box-shadow: 0 8px 24px rgba(43, 91, 186, 0.15);
          transform: translateY(-4px);
        }
        
        .section-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }
        
        .section-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #2B5BBA 0%, #1E3A5F 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 20px;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(43, 91, 186, 0.3);
        }
        
        .section-heading {
          font-size: 22px;
          font-weight: 800;
          color: #1E3A5F;
          margin: 0;
          letter-spacing: -0.5px;
        }
        
        .section-content {
          font-size: 15px;
          color: #333;
          line-height: 1.8;
          white-space: pre-wrap;
          margin: 0;
        }
        
        .contact-highlight {
          background: linear-gradient(135deg, #2B5BBA 0%, #1E3A5F 100%);
          border-radius: 16px;
          padding: 32px;
          margin-top: 32px;
          color: #fff;
          animation: fadeInUp 0.8s ease-out 0.4s backwards;
        }
        
        .contact-highlight .section-heading {
          color: #fff;
          margin-bottom: 20px;
        }
        
        .contact-highlight .section-content {
          color: rgba(255, 255, 255, 0.95);
        }
        
        .contact-items {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 24px;
        }
        
        .contact-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        
        .contact-item:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateX(8px);
        }
        
        .contact-item-icon {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .contact-item-text {
          font-size: 15px;
          font-weight: 600;
          margin: 0;
        }
        
        @media (max-width: 768px) {
          .privacy-container {
            padding: 40px 16px;
          }
          
          .privacy-title {
            font-size: 32px;
          }
          
          .privacy-section {
            padding: 24px;
          }
          
          .section-heading {
            font-size: 18px;
          }
          
          .section-content {
            font-size: 14px;
          }
          
          .contact-highlight {
            padding: 24px;
          }
        }
      `}</style>
      
      <div className="privacy-container container">
        <div className="privacy-header">
          <div className="privacy-icon-wrapper">
            <FaShieldAlt size={40} color="#fff" />
          </div>
          <h1 className="privacy-title">{currentContent.title}</h1>
          <p className="privacy-updated">{currentContent.lastUpdated}</p>
        </div>

        <div className="row">
          <div className="col-lg-10 mx-auto">
            {currentContent.sections.slice(0, -1).map((section, idx) => (
              <div key={idx} className="privacy-section">
                <div className="section-header">
                  <div className="section-icon">
                    {section.icon}
                  </div>
                  <h5 className="section-heading">{section.heading}</h5>
                </div>
                <p className="section-content">{section.content}</p>
              </div>
            ))}
            
            <div className="contact-highlight">
              <div className="section-header">
                <div className="section-icon" style={{ background: 'rgba(255, 255, 255, 0.2)' }}>
                  {currentContent.sections[currentContent.sections.length - 1].icon}
                </div>
                <h5 className="section-heading">{currentContent.sections[currentContent.sections.length - 1].heading}</h5>
              </div>
              <div className="contact-items">
                <div className="contact-item">
                  <div className="contact-item-icon">
                    <FaEnvelope size={18} />
                  </div>
                  <p className="contact-item-text">himalayahomes@gmail.com</p>
                </div>
                <div className="contact-item">
                  <div className="contact-item-icon">
                    <FaPhone size={18} />
                  </div>
                  <p className="contact-item-text">908821321</p>
                </div>
                <div className="contact-item">
                  <div className="contact-item-icon">
                    <FaMapMarkerAlt size={18} />
                  </div>
                  <p className="contact-item-text">Ward no 2 Thamel, Kathmandu, Nepal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;