import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const PrivacyPolicy = () => {
  const { language } = useLanguage();

  const content = {
    en: {
      title: "Privacy Policy",
      lastUpdated: "Last Updated: December 2024",
      sections: [
        {
          heading: "1. Introduction",
          content: "Himalaya Homes is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services."
        },
        {
          heading: "2. Information We Collect",
          content: "We may collect information about you in a variety of ways. The information we may collect on the site includes:\n• Personal Data: Name, email address, phone number, address\n• Payment Information: Credit card details and billing information\n• Usage Data: IP address, browser type, pages visited, time spent on pages\n• Cookies and Tracking Data: Information stored through cookies and similar technologies"
        },
        {
          heading: "3. How We Use Your Information",
          content: "Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:\n• Create and manage your account\n• Process your transactions\n• Email you regarding your account or order\n• Fulfill and ship your orders\n• Generate a personal profile about you\n• Increase the efficiency and operation of the Site\n• Monitor and analyze usage and trends to improve your experience"
        },
        {
          heading: "4. Disclosure of Your Information",
          content: "We may share information we have collected about you in certain situations:\n• By Law or to Protect Rights: If we believe the release of information is necessary to comply with the law\n• Third-Party Service Providers: We may share your information with parties who assist us in operating our website and conducting our business\n• With Your Consent: We may disclose your personal information with your prior consent to do so"
        },
        {
          heading: "5. Security of Your Information",
          content: "We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable."
        },
        {
          heading: "6. Contact Us",
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
          content: "हिमालय होम्स आपकी गोपनीयता की सुरक्षा के लिए प्रतिबद्ध है। यह गोपनीयता नीति बताती है कि जब आप हमारी वेबसाइट पर जाते हैं और हमारी सेवाओं का उपयोग करते हैं तो हम आपकी जानकारी को कैसे एकत्र, उपयोग, प्रकट और सुरक्षित करते हैं।"
        },
        {
          heading: "२. हम कौन सी जानकारी एकत्र करते हैं",
          content: "हम विभिन्न तरीकों से आपके बारे में जानकारी एकत्र कर सकते हैं। साइट पर जो जानकारी हम एकत्र कर सकते हैं उसमें शामिल है:\n• व्यक्तिगत डेटा: नाम, ईमेल पता, फोन नंबर, पता\n• भुगतान जानकारी: क्रेडिट कार्ड विवरण और बिलिंग जानकारी\n• उपयोग डेटा: IP पता, ब्राउजर प्रकार, देखे गए पृष्ठ, पृष्ठों पर व्यतीत समय\n• कुकीज़ और ट्रैकिंग डेटा: कुकीज़ और समान तकनीकों के माध्यम से संग्रहीत जानकारी"
        },
        {
          heading: "३. हम आपकी जानकारी का उपयोग कैसे करते हैं",
          content: "आपके बारे में सटीक जानकारी होने से हमें आपको एक चिकनी, कुशल और अनुकूलित अनुभव प्रदान करने में सक्षम बनाता है। विशेष रूप से, हम साइट पर आपके बारे में एकत्र की गई जानकारी का उपयोग कर सकते हैं:\n• आपके खाते को बनाएं और प्रबंधित करें\n• आपके लेनदेन को संसाधित करें\n• आपकी खाते या ऑर्डर के बारे में ईमेल करें\n• आपके ऑर्डर को पूरा करें और शिप करें\n• आपके बारे में व्यक्तिगत प्रोफाइल तैयार करें"
        },
        {
          heading: "४. आपकी जानकारी का प्रकटीकरण",
          content: "हम कुछ स्थितियों में आपके बारे में एकत्र की गई जानकारी साझा कर सकते हैं:\n• कानून द्वारा या अधिकारों की सुरक्षा के लिए: यदि हमें विश्वास है कि जानकारी की रिहाई कानून का पालन करने के लिए आवश्यक है\n• तृतीय-पक्ष सेवा प्रदाता: हम अपनी वेबसाइट को संचालित करने और हमारे व्यवसाय को संचालित करने में सहायता करने वाले पक्षों के साथ आपकी जानकारी साझा कर सकते हैं\n• आपकी सहमति के साथ: हम आपकी जानकारी साझा करने के लिए आपकी पूर्व सहमति के साथ आपकी व्यक्तिगत जानकारी प्रकट कर सकते हैं"
        },
        {
          heading: "५. आपकी जानकारी की सुरक्षा",
          content: "हम आपकी व्यक्तिगत जानकारी की सुरक्षा में सहायता के लिए प्रशासनिक, तकनीकी और भौतिक सुरक्षा उपायों का उपयोग करते हैं। जबकि हमने आपके द्वारा प्रदान की गई व्यक्तिगत जानकारी को सुरक्षित करने के लिए उचित कदम उठाए हैं, कृपया ध्यान दें कि हमारे प्रयासों के बावजूद, कोई भी सुरक्षा उपाय पूर्ण या अभेद्य नहीं है।"
        },
        {
          heading: "६. हमसे संपर्क करें",
          content: "यदि आपको इस गोपनीयता नीति के बारे में कोई प्रश्न या टिप्पणी है, तो कृपया हमसे संपर्क करें:\nईमेल: himalayahomes@gmail.com\nफोन: 908821321\nपता: वार्ड नंबर २ थमेल, काठमांडौ, नेपाल"
        }
      ]
    }
  };

  const currentContent = content[language === 'np' ? 'np' : 'en'];

  return (
    <div className="container py-5">
      <h1 className="mb-4">{currentContent.title}</h1>
      <p className="text-muted mb-4">{currentContent.lastUpdated}</p>
      
      {currentContent.sections.map((section, idx) => (
        <div key={idx} className="mb-4">
          <h5 className="mb-2">{section.heading}</h5>
          <p style={{ whiteSpace: 'pre-wrap' }} className="text-justify">
            {section.content}
          </p>
        </div>
      ))}
    </div>
  );
};

export default PrivacyPolicy;
