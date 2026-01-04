import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    // Navigation
    home: 'Home',
    buy: 'Buy',
    rent: 'Rent',
    sell: 'Sell',
    agents: 'Agents',
    contact: 'Contact',
    saved: 'Saved Properties',
    myListings: 'My Listings',
    login: 'Login',
    signup: 'Sign Up',
    logout: 'Logout',
    adminPanel: 'Admin Panel',
    profile: 'Profile',
    language: 'Language',
    
    // Property Related
    propertyRequests: 'Property Requests',
    properties: 'Properties',
    propertyTitle: 'Property Title',
    propertyType: 'Property Type',
    propertyDetails: 'Property Details',
    allProperties: 'All Properties',
    newArrivals: 'New Arrivals',
    latestProperties: 'Latest Properties',
    noNewProperties: 'No new properties',
    noResults: 'No results found',
    viewDetails: 'View Details',
    viewAll: 'View all',
    viewMedia: 'View Media',
    fullDetails: 'Full Details',
    
    // Property Attributes
    bedrooms: 'Bedrooms',
    bathrooms: 'Bathrooms',
    floors: 'Floors',
    parking: 'Parking',
    area: 'Area',
    price: 'Price',
    year: 'Year',
    beds: 'Beds',
    baths: 'Baths',
    
    // Listing Types
    forSale: 'For Sale',
    forRent: 'For Rent',
    postForSale: 'Post for Sale',
    postForRent: 'Post for Rent',
    
    // Location
    location: 'Location',
    address: 'Address',
    city: 'City',
    state: 'State/Province',
    country: 'Country',
    
    // Details & Description
    description: 'Description',
    amenities: 'Amenities',
    nearbyFacilities: 'Nearby Facilities',
    
    // Actions
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    update: 'Update',
    delete: 'Delete',
    approve: 'Approve',
    reject: 'Reject',
    search: 'Search',
    filter: 'Filter',
    applyFilter: 'Apply Filter',
    clearFilter: 'Clear Filter',
    
    // Status
    approved: 'Approved',
    rejected: 'Rejected',
    pending: 'Pending',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    failed: 'Failed',
    required: 'This field is required',
    
    // User Related
    firstName: 'First Name',
    lastName: 'Last Name',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    citizenshipNumber: 'Citizenship Number',
    profilePic: 'Profile Picture',
    myProfile: 'My Profile',
    editProfile: 'Edit Profile',
    changePassword: 'Change Password',
    
    // Forms
    enterEmail: 'Enter your email',
    enterPassword: 'Enter your password',
    enterFirstName: 'Enter your first name',
    enterLastName: 'Enter your last name',
    enterPhone: 'Enter your phone',
    enterCitizenship: 'Enter your citizenship number',
    enterPrice: 'Enter price',
    enterPropertyTitle: 'Enter property title',
    enterDescription: 'Enter property description',
    enterAddress: 'Enter full address',
    selectPropertyType: 'Select property type',
    selectListingType: 'Select listing type',
    confirmPassword: 'Confirm Password',
    enterConfirmPassword: 'Re-enter password',
    passwordsDontMatch: "Passwords don't match",
    
    // Auth
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: 'Already have an account?',
    forgotPassword: 'Forgot Password?',
    resetPassword: 'Reset Password',
    sendResetLink: 'Send Reset Link',
    backToLogin: 'Back to Login',
    loginRequired: 'Login required',
    logoutConfirm: 'Are you sure you want to logout?',
    
    // Media
    selectPhoto: 'Select Photo',
    selectVideo: 'Select Video',
    uploadPhoto: 'Upload Photo',
    uploadVideo: 'Upload Video',
    selectFile: 'Select File',
    clickOrDrag: 'Click or drag file to this area to upload',
    chooseFromGallery: 'Choose from Gallery',
    takePhoto: 'Take Photo',
    
    // Contact & Owner
    contactOwner: 'Contact Owner',
    contactInfo: 'Contact Info',
    ownerDetails: 'Owner Details',
    reportProperty: 'Report Property',
    
    // Admin
    adminDashboard: 'Admin Dashboard',
    agents_manage: 'Agents',
    messages: 'Messages',
    
    // Misc
    savedProperties: 'Saved Properties',
    buySellRent: 'Buy, Sell, Rent and Explore Properties in Nepal',
    quickLinks: 'Quick Links',
    company: 'Company',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    recent: 'Recent',
    popular: 'Popular',
    featured: 'Featured',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    searchPlaceholder: 'Search properties...',
    priceRange: 'Price Range',
    loadingProfile: 'Loading profile...',
    profileUpdated: 'Profile updated',
    updateFailed: 'Update failed',
  },
  ne: {
    // Navigation
    home: 'गृह',
    buy: 'किन्नुहोस्',
    rent: 'भाडामा',
    sell: 'बेच्नुहोस्',
    agents: 'एजेन्टहरू',
    contact: 'सम्पर्क',
    saved: 'सुरक्षित सम्पत्तिहरू',
    myListings: 'मेरा सूचीहरू',
    login: 'लगइन',
    signup: 'साइन अप',
    logout: 'लगआउट',
    adminPanel: 'प्रशासक प्यानल',
    profile: 'प्रोफाइल',
    language: 'भाषा',
    
    // Property Related
    propertyRequests: 'सम्पत्ति अनुरोधहरू',
    properties: 'सम्पत्तिहरू',
    propertyTitle: 'सम्पत्ति शीर्षक',
    propertyType: 'सम्पत्तिको प्रकार',
    propertyDetails: 'सम्पत्तिको विवरण',
    allProperties: 'सबै सम्पत्तिहरू',
    newArrivals: 'नयाँ आगमन',
    latestProperties: 'नवीनतम सम्पत्तिहरू',
    noNewProperties: 'कुनै नयाँ सम्पत्ति छैन',
    noResults: 'कुनै परिणाम फेला परेन',
    viewDetails: 'विवरण हेर्नुहोस्',
    viewAll: 'सबै हेर्नुहोस्',
    viewMedia: 'मिडिया हेर्नुहोस्',
    fullDetails: 'पूर्ण विवरण',
    
    // Property Attributes
    bedrooms: 'शयनकक्षहरू',
    bathrooms: 'बाथरूमहरू',
    floors: 'तलाहरू',
    parking: 'पार्किङ',
    area: 'क्षेत्रफल',
    price: 'मूल्य',
    year: 'वर्ष',
    beds: 'शयनकक्ष',
    baths: 'बाथरूम',
    
    // Listing Types
    forSale: 'बिक्रीको लागि',
    forRent: 'भाडाको लागि',
    postForSale: 'बिक्रीको लागि पोस्ट गर्नुहोस्',
    postForRent: 'भाडाको लागि पोस्ट गर्नुहोस्',
    
    // Location
    location: 'स्थान',
    address: 'ठेगाना',
    city: 'शहर',
    state: 'राज्य/प्रान्त',
    country: 'देश',
    
    // Details & Description
    description: 'विवरण',
    amenities: 'सुविधाहरू',
    nearbyFacilities: 'नजिकैका सुविधाहरू',
    
    // Actions
    submit: 'पेश गर्नुहोस्',
    cancel: 'रद्द गर्नुहोस्',
    save: 'सुरक्षित गर्नुहोस्',
    edit: 'सम्पादन गर्नुहोस्',
    update: 'अपडेट गर्नुहोस्',
    delete: 'मेटाउनुहोस्',
    approve: 'स्वीकृत गर्नुहोस्',
    reject: 'अस्वीकार गर्नुहोस्',
    search: 'खोज्नुहोस्',
    filter: 'फिल्टर',
    applyFilter: 'फिल्टर लागू गर्नुहोस्',
    clearFilter: 'फिल्टर खाली गर्नुहोस्',
    
    // Status
    approved: 'स्वीकृत',
    rejected: 'अस्वीकृत',
    pending: 'विचाराधीन',
    loading: 'लोड हुँदैछ...',
    error: 'त्रुटि',
    success: 'सफलता',
    failed: 'असफल',
    required: 'यो क्षेत्र आवश्यक छ',
    
    // User Related
    firstName: 'पहिलो नाम',
    lastName: 'थर',
    name: 'नाम',
    email: 'इमेल',
    phone: 'फोन',
    citizenshipNumber: 'नागरिकता नम्बर',
    profilePic: 'प्रोफाइल तस्बिर',
    myProfile: 'मेरो प्रोफाइल',
    editProfile: 'प्रोफाइल सम्पादन गर्नुहोस्',
    changePassword: 'पासवर्ड परिवर्तन गर्नुहोस्',
    
    // Forms
    enterEmail: 'आफ्नो इमेल प्रविष्ट गर्नुहोस्',
    enterPassword: 'आफ्नो पासवर्ड प्रविष्ट गर्नुहोस्',
    enterFirstName: 'आफ्नो पहिलो नाम प्रविष्ट गर्नुहोस्',
    enterLastName: 'आफ्नो थर प्रविष्ट गर्नुहोस्',
    enterPhone: 'आफ्नो फोन नम्बर प्रविष्ट गर्नुहोस्',
    enterCitizenship: 'आफ्नो नागरिकता नम्बर प्रविष्ट गर्नुहोस्',
    enterPrice: 'मूल्य प्रविष्ट गर्नुहोस्',
    enterPropertyTitle: 'सम्पत्तिको शीर्षक प्रविष्ट गर्नुहोस्',
    enterDescription: 'सम्पत्तिको विवरण प्रविष्ट गर्नुहोस्',
    enterAddress: 'पूरा ठेगाना प्रविष्ट गर्नुहोस्',
    selectPropertyType: 'सम्पत्तिको प्रकार चयन गर्नुहोस्',
    selectListingType: 'सूचीकरण प्रकार चयन गर्नुहोस्',
    confirmPassword: 'पासवर्ड पुष्टि गर्नुहोस्',
    enterConfirmPassword: 'पासवर्ड पुनः प्रविष्ट गर्नुहोस्',
    passwordsDontMatch: 'पासवर्डहरू मेल खाएनन्',
    
    // Auth
    dontHaveAccount: 'खाता छैन?',
    alreadyHaveAccount: 'पहिले नै खाता छ?',
    forgotPassword: 'पासवर्ड बिर्सनुभयो?',
    resetPassword: 'पासवर्ड रिसेट गर्नुहोस्',
    sendResetLink: 'रिसेट लिङ्क पठाउनुहोस्',
    backToLogin: 'लगइनमा फर्कनुहोस्',
    loginRequired: 'लगइन आवश्यक छ',
    logoutConfirm: 'के तपाईं लगआउट गर्न निश्चित हुनुहुन्छ?',
    
    // Media
    selectPhoto: 'तस्बिर चयन गर्नुहोस्',
    selectVideo: 'भिडियो चयन गर्नुहोस्',
    uploadPhoto: 'तस्बिर अपलोड गर्नुहोस्',
    uploadVideo: 'भिडियो अपलोड गर्नुहोस्',
    selectFile: 'फाइल चयन गर्नुहोस्',
    clickOrDrag: 'अपलोड गर्न यस क्षेत्रमा फाइल क्लिक वा तान्नुहोस्',
    chooseFromGallery: 'ग्यालेरीबाट छान्नुहोस्',
    takePhoto: 'तस्बिर खिच्नुहोस्',
    
    // Contact & Owner
    contactOwner: 'मालिकलाई सम्पर्क गर्नुहोस्',
    contactInfo: 'सम्पर्क जानकारी',
    ownerDetails: 'मालिकको विवरण',
    reportProperty: 'सम्पत्ति रिपोर्ट गर्नुहोस्',
    
    // Admin
    adminDashboard: 'प्रशासक ड्यासबोर्ड',
    agents_manage: 'एजेन्टहरू',
    messages: 'सन्देशहरू',
    
    // Misc
    savedProperties: 'सुरक्षित सम्पत्तिहरू',
    buySellRent: 'नेपालमा सम्पत्ति किन्नुहोस्, बेच्नुहोस्, भाडामा लिनुहोस् र अन्वेषण गर्नुहोस्',
    quickLinks: 'द्रुत लिङ्कहरू',
    company: 'कम्पनी',
    privacyPolicy: 'गोपनीयता नीति',
    termsOfService: 'सेवा सर्तहरू',
    recent: 'हालसालै',
    popular: 'लोकप्रिय',
    featured: 'विशेष',
    yes: 'हो',
    no: 'होइन',
    ok: 'ठीक छ',
    searchPlaceholder: 'सम्पत्तिहरू खोज्नुहोस्...',
    priceRange: 'मूल्य दायरा',
    loadingProfile: 'प्रोफाइल लोड हुँदैछ...',
    profileUpdated: 'प्रोफाइल अपडेट भयो',
    updateFailed: 'अपडेट असफल भयो',
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    if (language === 'ne') {
      document.documentElement.dir = 'ltr';
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ne' : 'en');
  };

  const t = (key) => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
