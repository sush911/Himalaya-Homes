import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const TermsOfService = () => {
  const { language } = useLanguage();

  const content = {
    en: {
      title: "Terms of Service",
      lastUpdated: "Last Updated: December 2024",
      sections: [
        {
          heading: "1. Agreement to Terms",
          content: "By accessing and using the Himalaya Homes website and services, you accept and agree to be bound by and comply with the terms and provision of this agreement."
        },
        {
          heading: "2. Use License",
          content: "Permission is granted to temporarily download one copy of the materials (information or software) on Himalaya Homes for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:\n• Modify or copy the materials\n• Use the materials for any commercial purpose or for any public display\n• Attempt to decompile or reverse engineer any software contained on Himalaya Homes\n• Remove any copyright or other proprietary notations from the materials\n• Transfer the materials to another person or \"mirror\" the materials on any other server"
        },
        {
          heading: "3. Disclaimer",
          content: "The materials on Himalaya Homes are provided on an 'as is' basis. Himalaya Homes makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights."
        },
        {
          heading: "4. Limitations",
          content: "In no event shall Himalaya Homes or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Himalaya Homes, even if Himalaya Homes or an authorized representative has been notified orally or in writing of the possibility of such damage."
        },
        {
          heading: "5. Accuracy of Materials",
          content: "The materials appearing on Himalaya Homes could include technical, typographical, or photographic errors. Himalaya Homes does not warrant that any of the materials on its website are accurate, complete, or current. Himalaya Homes may make changes to the materials contained on its website at any time without notice."
        },
        {
          heading: "6. Links",
          content: "Himalaya Homes has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Himalaya Homes of the site. Use of any such linked website is at the user's own risk."
        },
        {
          heading: "7. Modifications",
          content: "Himalaya Homes may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service."
        },
        {
          heading: "8. Governing Law",
          content: "These terms and conditions are governed by and construed in accordance with the laws of Nepal, and you irrevocably submit to the exclusive jurisdiction of the courts in that location."
        }
      ]
    },
    np: {
      title: "सेवा की शर्तें",
      lastUpdated: "अन्तिम अपडेट: डिसेम्बर २०२४",
      sections: [
        {
          heading: "१. शर्तों के लिए समझौता",
          content: "हिमालय होम्स वेबसाइट और सेवाओं तक पहुंचने और उपयोग करके, आप इस समझौते की शर्तों और प्रावधानों द्वारा बाध्य होने और अनुपालन करने के लिए स्वीकार करते हैं और सहमत होते हैं।"
        },
        {
          heading: "२. उपयोग लाइसेंस",
          content: "हिमालय होम्स पर सामग्रियों (जानकारी या सॉफ्टवेयर) की एक प्रति को व्यक्तिगत, गैर-वाणिज्यिक क्षणिक देखने के लिए अस्थायी रूप से डाउनलोड करने की अनुमति दी गई है। यह एक लाइसेंस का अनुदान है, शीर्षक का स्थानांतरण नहीं है, और इस लाइसेंस के तहत आप:\n• सामग्रियों को संशोधित या कॉपी नहीं कर सकते\n• किसी भी वाणिज्यिक उद्देश्य के लिए या किसी भी सार्वजनिक प्रदर्शन के लिए सामग्रियों का उपयोग नहीं कर सकते\n• हिमालय होम्स पर निहित किसी भी सॉफ्टवेयर को विघटित या रिवर्स इंजीनियर करने का प्रयास नहीं कर सकते"
        },
        {
          heading: "३. अस्वीकरण",
          content: "हिमालय होम्स पर सामग्रियां 'जैसा है' के आधार पर प्रदान की जाती हैं। हिमालय होम्स कोई वारंटी, व्यक्त या निहित नहीं देता है, और यहां सभी अन्य वारंटियों को अस्वीकार और नकारता है, जिसमें सीमा के बिना, व्यापारीयता की निहित वारंटियां या शर्तें, किसी विशेष उद्देश्य के लिए उपयुक्तता, या बौद्धिक संपत्ति या अन्य अधिकारों के उल्लंघन का सुरक्षा शामिल है।"
        },
        {
          heading: "४. सीमाएं",
          content: "किसी भी स्थिति में हिमालय होम्स या इसके आपूर्तिकर्ता किसी भी नुकसान के लिए जिम्मेदार नहीं होंगे (जिसमें डेटा या लाभ के नुकसान के लिए नुकसान, या व्यवसाय में व्यवधान के कारण होने वाले नुकसान शामिल हैं) हिमालय होम्स पर सामग्रियों के उपयोग या उपयोग की अक्षमता से उत्पन्न होने वाले नुकसान।"
        },
        {
          heading: "५. सामग्रियों की सटीकता",
          content: "हिमालय होम्स पर दिखाई देने वाली सामग्रियों में तकनीकी, वर्तनी, या फोटोग्राफिक त्रुटियां शामिल हो सकती हैं। हिमालय होम्स की वारंटी नहीं है कि इसकी वेबसाइट पर कोई भी सामग्रियां सटीक, पूर्ण या वर्तमान हैं। हिमालय होम्स अपनी वेबसाइट पर निहित सामग्रियों में कभी भी सूचना के बिना परिवर्तन कर सकते हैं।"
        },
        {
          heading: "६. लिंक",
          content: "हिमालय होम्स ने अपनी वेबसाइट से जुड़ी सभी साइटों की समीक्षा नहीं की है और किसी भी ऐसी जुड़ी साइट की सामग्री के लिए जिम्मेदार नहीं है। किसी भी लिंक का समावेश हिमालय होम्स द्वारा साइट के समर्थन का अर्थ नहीं देता है। किसी भी ऐसी जुड़ी वेबसाइट का उपयोग उपयोगकर्ता के अपने जोखिम पर है।"
        },
        {
          heading: "७. संशोधन",
          content: "हिमालय होम्स अपनी वेबसाइट के लिए सेवा की शर्तों को सूचना के बिना किसी भी समय संशोधित कर सकते हैं। इस वेबसाइट का उपयोग करके आप इन सेवा की शर्तों के तत्कालीन वर्तमान संस्करण द्वारा बाध्य होने के लिए सहमत हैं।"
        },
        {
          heading: "८. शासन कानून",
          content: "ये शर्तें और शर्तें नेपाल के कानूनों द्वारा शासित हैं और आप अनिवार्य रूप से उस स्थान में अदालतों के एकमात्र अधिकार क्षेत्र में प्रस्तुत करते हैं।"
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

export default TermsOfService;
