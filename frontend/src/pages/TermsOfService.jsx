import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FaFileContract, FaKey, FaExclamationTriangle, FaShieldAlt, FaCheckCircle, FaLink, FaEdit, FaGavel } from 'react-icons/fa';

const TermsOfService = () => {
  const { language } = useLanguage();

  const content = {
    en: {
      title: "Terms of Service",
      lastUpdated: "Last Updated: December 2024",
      sections: [
        {
          heading: "1. Agreement to Terms",
          icon: <FaFileContract />,
          content: "By accessing and using the Himalaya Homes website and services, you accept and agree to be bound by and comply with the terms and provision of this agreement."
        },
        {
          heading: "2. Use License",
          icon: <FaKey />,
          content: "Permission is granted to temporarily download one copy of the materials (information or software) on Himalaya Homes for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:\n• Modify or copy the materials\n• Use the materials for any commercial purpose or for any public display\n• Attempt to decompile or reverse engineer any software contained on Himalaya Homes\n• Remove any copyright or other proprietary notations from the materials\n• Transfer the materials to another person or \"mirror\" the materials on any other server"
        },
        {
          heading: "3. Disclaimer",
          icon: <FaExclamationTriangle />,
          content: "The materials on Himalaya Homes are provided on an 'as is' basis. Himalaya Homes makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights."
        },
        {
          heading: "4. Limitations",
          icon: <FaShieldAlt />,
          content: "In no event shall Himalaya Homes or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Himalaya Homes, even if Himalaya Homes or an authorized representative has been notified orally or in writing of the possibility of such damage."
        },
        {
          heading: "5. Accuracy of Materials",
          icon: <FaCheckCircle />,
          content: "The materials appearing on Himalaya Homes could include technical, typographical, or photographic errors. Himalaya Homes does not warrant that any of the materials on its website are accurate, complete, or current. Himalaya Homes may make changes to the materials contained on its website at any time without notice."
        },
        {
          heading: "6. Links",
          icon: <FaLink />,
          content: "Himalaya Homes has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Himalaya Homes of the site. Use of any such linked website is at the user's own risk."
        },
        {
          heading: "7. Modifications",
          icon: <FaEdit />,
          content: "Himalaya Homes may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service."
        },
        {
          heading: "8. Governing Law",
          icon: <FaGavel />,
          content: "These terms and conditions are governed by and construed in accordance with the laws of Nepal, and you irrevocably submit to the exclusive jurisdiction of the courts in that location."
        }
      ]
    },
    np: {
      title: "सेवा सर्तहरू",
      lastUpdated: "अन्तिम अपडेट: डिसेम्बर २०२४",
      sections: [
        {
          heading: "१. सर्तहरूमा सम्झौता",
          icon: <FaFileContract />,
          content: "हिमालय होम्स वेबसाइट र सेवाहरू पहुँच र प्रयोग गरेर, तपाईं यस सम्झौताका सर्तहरू र प्रावधानहरूद्वारा बाध्य हुन र पालना गर्न स्वीकार गर्नुहुन्छ र सहमत हुनुहुन्छ।"
        },
        {
          heading: "२. प्रयोग इजाजतपत्र",
          icon: <FaKey />,
          content: "हिमालय होम्समा सामग्रीहरू (जानकारी वा सफ्टवेयर) को एउटा प्रतिलिपि व्यक्तिगत, गैर-व्यावसायिक अस्थायी हेर्नको लागि अस्थायी रूपमा डाउनलोड गर्न अनुमति दिइएको छ। यो एक इजाजतपत्रको अनुदान हो, शीर्षकको स्थानान्तरण होइन, र यो इजाजतपत्र अन्तर्गत तपाईं:\n• सामग्रीहरू परिमार्जन वा प्रतिलिपि गर्न सक्नुहुन्न\n• कुनै पनि व्यावसायिक उद्देश्य वा कुनै सार्वजनिक प्रदर्शनको लागि सामग्रीहरू प्रयोग गर्न सक्नुहुन्न\n• हिमालय होम्समा समावेश कुनै पनि सफ्टवेयरलाई डिकम्पाइल वा रिभर्स इन्जिनियर गर्ने प्रयास गर्न सक्नुहुन्न\n• सामग्रीहरूबाट कुनै पनि प्रतिलिपि अधिकार वा अन्य स्वामित्व नोटेसनहरू हटाउन सक्नुहुन्न\n• सामग्रीहरू अर्को व्यक्तिलाई स्थानान्तरण गर्न वा कुनै अन्य सर्भरमा सामग्रीहरू \"मिरर\" गर्न सक्नुहुन्न"
        },
        {
          heading: "३. अस्वीकरण",
          icon: <FaExclamationTriangle />,
          content: "हिमालय होम्समा सामग्रीहरू 'जस्तै छ' आधारमा प्रदान गरिएको छ। हिमालय होम्सले कुनै वारेन्टी, व्यक्त वा निहित गर्दैन, र यसद्वारा सबै अन्य वारेन्टीहरू अस्वीकार र अस्वीकार गर्दछ जसमा सीमा बिना, व्यापारिकताको निहित वारेन्टी वा अवस्थाहरू, विशेष उद्देश्यको लागि उपयुक्तता, वा बौद्धिक सम्पत्तिको गैर-उल्लंघन वा अधिकारको अन्य उल्लंघन समावेश छ।"
        },
        {
          heading: "४. सीमाहरू",
          icon: <FaShieldAlt />,
          content: "कुनै पनि घटनामा हिमालय होम्स वा यसका आपूर्तिकर्ताहरू कुनै पनि क्षतिको लागि उत्तरदायी हुनेछैनन् (सीमा बिना, डेटा वा नाफाको हानिको लागि क्षति, वा व्यापार अवरोधको कारणले) हिमालय होम्समा सामग्रीहरूको प्रयोग वा प्रयोग गर्न असक्षमताबाट उत्पन्न हुने, यदि हिमालय होम्स वा एक अधिकृत प्रतिनिधिलाई मौखिक वा लिखित रूपमा यस्तो क्षतिको सम्भावनाको बारेमा सूचित गरिएको भए पनि।"
        },
        {
          heading: "५. सामग्रीहरूको शुद्धता",
          icon: <FaCheckCircle />,
          content: "हिमालय होम्समा देखा पर्ने सामग्रीहरूमा प्राविधिक, टाइपोग्राफिकल, वा फोटोग्राफिक त्रुटिहरू समावेश हुन सक्छन्। हिमालय होम्सले वारेन्टी गर्दैन कि यसको वेबसाइटमा कुनै पनि सामग्रीहरू सही, पूर्ण वा वर्तमान छन्। हिमालय होम्सले सूचना बिना कुनै पनि समयमा आफ्नो वेबसाइटमा समावेश सामग्रीहरूमा परिवर्तन गर्न सक्छ।"
        },
        {
          heading: "६. लिङ्कहरू",
          icon: <FaLink />,
          content: "हिमालय होम्सले आफ्नो वेबसाइटमा लिङ्क गरिएका सबै साइटहरूको समीक्षा गरेको छैन र त्यस्तो कुनै पनि लिङ्क गरिएको साइटको सामग्रीको लागि जिम्मेवार छैन। कुनै पनि लिङ्कको समावेशले हिमालय होम्सद्वारा साइटको समर्थनको अर्थ राख्दैन। त्यस्तो कुनै पनि लिङ्क गरिएको वेबसाइटको प्रयोग प्रयोगकर्ताको आफ्नै जोखिममा हुन्छ।"
        },
        {
          heading: "७. परिमार्जनहरू",
          icon: <FaEdit />,
          content: "हिमालय होम्सले आफ्नो वेबसाइटको लागि यी सेवा सर्तहरू कुनै पनि समय सूचना बिना परिमार्जन गर्न सक्छ। यो वेबसाइट प्रयोग गरेर तपाईं यी सेवा सर्तहरूको तत्कालीन वर्तमान संस्करणद्वारा बाध्य हुन सहमत हुनुहुन्छ।"
        },
        {
          heading: "८. शासित कानून",
          icon: <FaGavel />,
          content: "यी सर्तहरू र अवस्थाहरू नेपालको कानूनहरू अनुसार शासित र व्याख्या गरिन्छ, र तपाईं अपरिवर्तनीय रूपमा त्यस स्थानमा अदालतहरूको विशेष क्षेत्राधिकारमा पेश गर्नुहुन्छ।"
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
        
        .tos-container {
          padding: 60px 20px;
          background: linear-gradient(180deg, #FAFBFC 0%, #FFFFFF 100%);
          min-height: 100vh;
        }
        
        .tos-header {
          text-align: center;
          margin-bottom: 50px;
          animation: fadeInUp 0.8s ease-out;
        }
        
        .tos-icon-wrapper {
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
        
        .tos-title {
          font-size: 42px;
          font-weight: 800;
          color: #1E3A5F;
          margin-bottom: 16px;
          letter-spacing: -1px;
        }
        
        .tos-updated {
          font-size: 15px;
          color: #666;
          font-weight: 500;
          padding: 10px 24px;
          background: #F5F5F5;
          border-radius: 20px;
          display: inline-block;
        }
        
        .tos-section {
          background: #fff;
          border: 2px solid #E0E0E0;
          border-radius: 16px;
          padding: 32px;
          margin-bottom: 24px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          animation: fadeInUp 0.6s ease-out backwards;
        }
        
        .tos-section:nth-child(1) { animation-delay: 0.1s; }
        .tos-section:nth-child(2) { animation-delay: 0.15s; }
        .tos-section:nth-child(3) { animation-delay: 0.2s; }
        .tos-section:nth-child(4) { animation-delay: 0.25s; }
        .tos-section:nth-child(5) { animation-delay: 0.3s; }
        .tos-section:nth-child(6) { animation-delay: 0.35s; }
        .tos-section:nth-child(7) { animation-delay: 0.4s; }
        .tos-section:nth-child(8) { animation-delay: 0.45s; }
        
        .tos-section:hover {
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
        
        .important-note {
          background: linear-gradient(135deg, #2B5BBA 0%, #1E3A5F 100%);
          border-radius: 16px;
          padding: 32px;
          margin-top: 40px;
          color: #fff;
          animation: fadeInUp 0.8s ease-out 0.5s backwards;
          box-shadow: 0 8px 24px rgba(43, 91, 186, 0.3);
        }
        
        .important-note-title {
          font-size: 24px;
          font-weight: 800;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .important-note-text {
          font-size: 15px;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.95);
          margin: 0;
        }
        
        @media (max-width: 768px) {
          .tos-container {
            padding: 40px 16px;
          }
          
          .tos-title {
            font-size: 32px;
          }
          
          .tos-section {
            padding: 24px;
          }
          
          .section-heading {
            font-size: 18px;
          }
          
          .section-content {
            font-size: 14px;
          }
          
          .important-note {
            padding: 24px;
          }
        }
      `}</style>
      
      <div className="tos-container container">
        <div className="tos-header">
          <div className="tos-icon-wrapper">
            <FaFileContract size={40} color="#fff" />
          </div>
          <h1 className="tos-title">{currentContent.title}</h1>
          <p className="tos-updated">{currentContent.lastUpdated}</p>
        </div>

        <div className="row">
          <div className="col-lg-10 mx-auto">
            {currentContent.sections.map((section, idx) => (
              <div key={idx} className="tos-section">
                <div className="section-header">
                  <div className="section-icon">
                    {section.icon}
                  </div>
                  <h5 className="section-heading">{section.heading}</h5>
                </div>
                <p className="section-content">{section.content}</p>
              </div>
            ))}
            
            <div className="important-note">
              <h6 className="important-note-title">
                <FaExclamationTriangle size={24} />
                {language === 'np' ? 'महत्त्वपूर्ण नोट' : 'Important Note'}
              </h6>
              <p className="important-note-text">
                {language === 'np'
                  ? 'यी सेवा सर्तहरू पढ्नुहोस् र बुझ्नुहोस्। यो वेबसाइट प्रयोग गरेर, तपाईं यी सर्तहरूमा सहमत हुनुहुन्छ। यदि तपाईं यी सर्तहरूसँग सहमत हुनुहुन्न भने, कृपया यो वेबसाइट प्रयोग नगर्नुहोस्।'
                  : 'Please read and understand these Terms of Service. By using this website, you agree to these terms. If you do not agree with these terms, please do not use this website.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsOfService;
