import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FaChevronDown } from 'react-icons/fa';

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
        {
          question: "What payment methods do you accept?",
          answer: "We support various payment methods including bank transfers, mobile wallets (Khalti, ESewa), and other digital payment options available in Nepal. Contact details for payment inquiries are provided during the transaction."
        }
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
        {
          question: "तपाई कुन भुक्तानी विधि स्वीकार गर्नुहुन्छ?",
          answer: "हम विभिन्न भुक्तानी विधिहरु समर्थन गर्छु जिसमे बैंक स्थानान्तरण, मोबाइल वालेट (खलती, ESewa) र नेपालमा उपलब्ध अन्य डिजिटल भुक्तानी विकल्पहरु शामिल हैं। भुक्तानी पूछताछको लागि सम्पर्क विवरण लेनदेनको समय प्रदान गरिन्छ।"
        }
      ]
    }
  };

  const currentContent = content[language === 'np' ? 'np' : 'en'];

  const toggleFAQ = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="container py-5">
      <h1 className="mb-2">{currentContent.title}</h1>
      <p className="text-muted mb-5">{currentContent.subtitle}</p>

      <div className="row">
        <div className="col-lg-8 mx-auto">
          {currentContent.faqs.map((faq, idx) => (
            <div key={idx} className="card mb-3 border-0 shadow-sm">
              <div
                className="card-header bg-white border-0 p-0"
                style={{ cursor: 'pointer' }}
                onClick={() => toggleFAQ(idx)}
              >
                <button
                  className="btn btn-link text-dark text-decoration-none w-100 text-start p-3 d-flex justify-content-between align-items-center"
                  aria-expanded={expandedId === idx}
                >
                  <span className="fw-bold">{faq.question}</span>
                  <FaChevronDown
                    style={{
                      transform: expandedId === idx ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease',
                    }}
                  />
                </button>
              </div>

              {expandedId === idx && (
                <div className="card-body border-top">
                  <p className="mb-0">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-lg-8 mx-auto">
          <div className="alert alert-info">
            <h6 className="mb-2">
              {language === 'np' ? 'अझै प्रश्न छ?' : 'Still have questions?'}
            </h6>
            <p className="mb-0">
              {language === 'np'
                ? 'कृपया हामीसँग सम्पर्क गर्नुहोस् - himalayahomes@gmail.com वा 908821321'
                : 'Please contact us - himalayahomes@gmail.com or 908821321'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
