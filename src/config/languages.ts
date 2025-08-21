export interface LanguageConfig {
  code: string;
  name: string;
  flag: string;
  direction: 'ltr' | 'rtl';
}

export interface ContactTranslations {
  // Header
  pageTitle: string;
  breadcrumbHome: string;
  breadcrumbContact: string;
  
  // Contact Form Section
  contactTitle: string;
  welcomeTitle: string;
  welcomeMessage: string;
  
  // Form Fields
  nameLabel: string;
  emailLabel: string;
  phoneLabel: string;
  addressLabel: string;
  subjectLabel: string;
  messageLabel: string;
  
  // Form Actions
  sendButton: string;
  resetButton: string;
  
  // Success/Error Messages
  successMessage: string;
  errorMessage: string;
  validationError: string;
  
  // Company Info Sections
  mainOfficeTitle: string;
  branchOfficeTitle: string;
  companyAddressLabel: string;
  companyPhoneLabel: string;
  faxLabel: string;
  companyEmailLabel: string;
  websiteLabel: string;
  
  // Map Section
  branchTitle: string;
  mainOfficeTab: string;
  branchTab: string;
  hanoiTab: string;
  hcmTab: string;
  danangTab: string;
  canthoTab: string;
  mapLoadingText: string;
  
  // Social Media
  followUs: string;
}

export const supportedLanguages: LanguageConfig[] = [
  {
    code: 'vi',
    name: 'Tiếng Việt',
    flag: '🇻🇳',
    direction: 'ltr'
  },
  {
    code: 'en',
    name: 'English',
    flag: '🇺🇸',
    direction: 'ltr'
  }
];

export const contactTranslations: Record<string, ContactTranslations> = {
  vi: {
    // Header
    pageTitle: 'LIÊN HỆ',
    breadcrumbHome: 'Trang chủ',
    breadcrumbContact: 'Liên hệ',
    
    // Contact Form Section
    contactTitle: 'LIÊN HỆ',
    welcomeTitle: 'CHÀO MỪNG ĐẾN VỚI WEBSITE!',
    welcomeMessage: 'Cảm ơn bạn đã quan tâm đến VIỆN CÔNG NGHỆ. Nếu bạn có bất kỳ câu hỏi, phản hồi hoặc đề xuất nào, vui lòng điền vào biểu mẫu bên dưới và gửi cho chúng tôi. Chân thành cảm ơn!',
    
    // Form Fields
    nameLabel: 'Họ và tên (*)',
    emailLabel: 'Email (*)',
    phoneLabel: 'Điện thoại (*)',
    addressLabel: 'Địa chỉ (*)',
    subjectLabel: 'Tiêu đề (*)',
    messageLabel: 'Tin nhắn (*)',
    
    // Form Actions
    sendButton: 'GỬI',
    resetButton: 'LÀM MỚI',
    
    // Success/Error Messages
    successMessage: 'Tin nhắn đã được gửi thành công! Chúng tôi sẽ liên hệ lại với bạn sớm nhất.',
    errorMessage: 'Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại.',
    validationError: 'Vui lòng kiểm tra lại thông tin và thử lại.',
    
    // Company Info Sections
    mainOfficeTitle: 'TRỤ SỞ CHÍNH',
    branchOfficeTitle: 'CHI NHÁNH',
    companyAddressLabel: 'Địa chỉ:',
    companyPhoneLabel: 'Điện thoại:',
    faxLabel: 'Fax:',
    companyEmailLabel: 'Email:',
    websiteLabel: 'Website:',
    
    // Map Section
    branchTitle: 'CHI NHÁNH',
    mainOfficeTab: 'TRỤ SỞ CHÍNH',
    branchTab: 'CHI NHÁNH',
    hanoiTab: 'HÀ NỘI',
    hcmTab: 'HỒ CHÍ MINH',
    danangTab: 'ĐÀ NẴNG',
    canthoTab: 'CẦN THƠ',
    mapLoadingText: 'Bản đồ đang được tải...',
    
    // Social Media
    followUs: 'Theo dõi chúng tôi'
  },
  en: {
    // Header
    pageTitle: 'CONTACT',
    breadcrumbHome: 'Home',
    breadcrumbContact: 'Contact',
    
    // Contact Form Section
    contactTitle: 'CONTACT',
    welcomeTitle: 'WELCOME TO OUR WEBSITE!',
    welcomeMessage: 'Thank you for your interest in INSTITUTE OF TECHNOLOGY. If you have any questions, feedback, or suggestions, please fill out the form below and send it to us. Sincerely thank you!',
    
    // Form Fields
    nameLabel: 'Full Name (*)',
    emailLabel: 'Email (*)',
    phoneLabel: 'Phone (*)',
    addressLabel: 'Address (*)',
    subjectLabel: 'Subject (*)',
    messageLabel: 'Message (*)',
    
    // Form Actions
    sendButton: 'SEND',
    resetButton: 'RESET',
    
    // Success/Error Messages
    successMessage: 'Message sent successfully! We will contact you back as soon as possible.',
    errorMessage: 'An error occurred while sending the message. Please try again.',
    validationError: 'Please check your information and try again.',
    
    // Company Info Sections
    mainOfficeTitle: 'HEAD OFFICE',
    branchOfficeTitle: 'BRANCH',
    companyAddressLabel: 'Address:',
    companyPhoneLabel: 'Phone:',
    faxLabel: 'Fax:',
    companyEmailLabel: 'Email:',
    websiteLabel: 'Website:',
    
    // Map Section
    branchTitle: 'BRANCHES',
    mainOfficeTab: 'HEAD OFFICE',
    branchTab: 'BRANCH',
    hanoiTab: 'HANOI',
    hcmTab: 'HO CHI MINH',
    danangTab: 'DA NANG',
    canthoTab: 'CAN THO',
    mapLoadingText: 'Map is loading...',
    
    // Social Media
    followUs: 'Follow Us'
  }
};

export const getCurrentLanguage = (): string => {
  if (typeof window !== 'undefined') {
    const savedLang = localStorage.getItem('preferred-language');
    if (savedLang && supportedLanguages.find(lang => lang.code === savedLang)) {
      return savedLang;
    }
    
    const browserLang = navigator.language.split('-')[0];
    if (supportedLanguages.find(lang => lang.code === browserLang)) {
      return browserLang;
    }
  }
  return 'vi'; // Default to Vietnamese
};

export const setLanguage = (languageCode: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('preferred-language', languageCode);
  }
};
