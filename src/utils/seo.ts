export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  noIndex?: boolean;
}

export interface PageSEOData {
  [key: string]: SEOConfig;
}

// Base URL for canonical URLs
export const BASE_URL = process.env.REACT_APP_BASE_URL || 'https://viencongnghe.com';

// Default SEO configuration
export const DEFAULT_SEO: SEOConfig = {
  title: 'Viện Công nghệ - Institute of Technology',
  description: 'Viện Công nghệ (RITM) - Viện nghiên cứu công nghệ cơ khí hàng đầu Việt Nam. Chuyên nghiên cứu, phát triển và chuyển giao công nghệ trong lĩnh vực đúc, nhiệt luyện, gia công cơ khí và kiểm định vật liệu.',
  keywords: [
    'viện công nghệ',
    'RITM',
    'nghiên cứu công nghệ',
    'cơ khí',
    'đúc kim loại',
    'nhiệt luyện',
    'gia công cơ khí',
    'kiểm định vật liệu',
    'chuyển giao công nghệ',
    'vật liệu kim loại',
    'khuôn đúc',
    'hợp kim đặc biệt',
    'công nghệ quốc phòng',
    'y sinh',
    'MAGMASoft',
    'nhiệt luyện chân không',
    'hóa nhiệt luyện',
    'thử nghiệm không phá hủy',
    'kết cấu hàn',
    'chi tiết máy'
  ],
  ogType: 'website',
  twitterCard: 'summary_large_image',
  ogImage: `${BASE_URL}/images/og-default.jpg`
};

// SEO configurations for each page
export const PAGE_SEO_DATA: PageSEOData = {
  home: {
    title: 'Viện Công nghệ (RITM) - Nghiên cứu & Phát triển Công nghệ Cơ khí',
    description: 'Viện Công nghệ (RITM) - Đơn vị nghiên cứu công nghệ cơ khí hàng đầu Việt Nam. Chuyên nghiên cứu đúc, nhiệt luyện, gia công cơ khí và kiểm định vật liệu với 50+ năm kinh nghiệm.',
    keywords: [
      'viện công nghệ',
      'RITM',
      'nghiên cứu cơ khí',
      'công nghệ đúc',
      'nhiệt luyện',
      'gia công cơ khí',
      'kiểm định vật liệu',
      'chuyển giao công nghệ',
      'vật liệu kim loại',
      'khuôn đúc',
      'hợp kim đặc biệt',
      'công nghệ quốc phòng',
      'y sinh',
      'MAGMASoft',
      'nhiệt luyện chân không',
      'hóa nhiệt luyện',
      'thử nghiệm không phá hủy',
      'kết cấu hàn',
      'chi tiết máy',
      'đào tạo công nghệ'
    ],
    canonical: `${BASE_URL}/`,
    ogImage: `${BASE_URL}/images/banner/01.jpg`
  },
  about: {
    title: 'Giới thiệu - Viện Công nghệ (RITM) | Lịch sử & Sứ mệnh',
    description: 'Tìm hiểu về lịch sử 50+ năm phát triển của Viện Công nghệ (RITM), sứ mệnh nghiên cứu và phát triển công nghệ cơ khí, cùng đội ngũ chuyên gia giàu kinh nghiệm.',
    keywords: [
      'giới thiệu viện công nghệ',
      'lịch sử RITM',
      'sứ mệnh viện công nghệ',
      'đội ngũ chuyên gia',
      'nghiên cứu cơ khí',
      'phát triển công nghệ',
      'viện nghiên cứu',
      'công nghệ cơ khí',
      'chuyên gia cơ khí',
      'nghiên cứu vật liệu'
    ],
    canonical: `${BASE_URL}/about`,
    ogImage: `${BASE_URL}/images/about/01.jpg`
  },
  services: {
    title: 'Dịch vụ - Viện Công nghệ (RITM) | Đúc, Nhiệt luyện, Gia công Cơ khí',
    description: 'Cung cấp các dịch vụ công nghệ cao: đúc kim loại, nhiệt luyện chân không, gia công cơ khí, kiểm định vật liệu, chuyển giao công nghệ và đào tạo chuyên môn.',
    keywords: [
      'dịch vụ viện công nghệ',
      'đúc kim loại',
      'nhiệt luyện chân không',
      'gia công cơ khí',
      'kiểm định vật liệu',
      'chuyển giao công nghệ',
      'đào tạo công nghệ',
      'dịch vụ cơ khí',
      'nhiệt luyện',
      'hóa nhiệt luyện',
      'thử nghiệm vật liệu',
      'khuôn đúc',
      'hợp kim đặc biệt',
      'công nghệ quốc phòng',
      'y sinh'
    ],
    canonical: `${BASE_URL}/services`,
    ogImage: `${BASE_URL}/images/service/01.jpg`
  },
  products: {
    title: 'Sản phẩm - Viện Công nghệ (RITM) | Khuôn đúc, Hợp kim đặc biệt',
    description: 'Sản phẩm công nghệ cao của Viện Công nghệ: khuôn đúc kim loại, hợp kim đặc biệt cho quốc phòng và y sinh, thiết bị nhiệt luyện, hệ thống cơ khí.',
    keywords: [
      'sản phẩm viện công nghệ',
      'khuôn đúc kim loại',
      'hợp kim đặc biệt',
      'thiết bị nhiệt luyện',
      'hệ thống cơ khí',
      'sản phẩm quốc phòng',
      'sản phẩm y sinh',
      'khuôn rèn dập',
      'khuôn ép',
      'khuôn đúc áp lực',
      'hợp kim cao cấp',
      'vật liệu đặc biệt',
      'thiết bị công nghệ',
      'hệ thống cơ khí'
    ],
    canonical: `${BASE_URL}/products`,
    ogImage: `${BASE_URL}/images/product/01.jpg`
  },
  organization: {
    title: 'Tổ chức - Viện Công nghệ (RITM) | Cơ cấu tổ chức & Ban lãnh đạo',
    description: 'Cơ cấu tổ chức và ban lãnh đạo Viện Công nghệ (RITM). Tìm hiểu về các phòng ban, trung tâm nghiên cứu và đội ngũ lãnh đạo chuyên môn.',
    keywords: [
      'tổ chức viện công nghệ',
      'cơ cấu tổ chức RITM',
      'ban lãnh đạo',
      'phòng ban nghiên cứu',
      'trung tâm nghiên cứu',
      'lãnh đạo viện',
      'cơ cấu viện',
      'tổ chức nghiên cứu',
      'ban giám đốc',
      'phòng kỹ thuật'
    ],
    canonical: `${BASE_URL}/organization`,
    ogImage: `${BASE_URL}/images/team/01.jpg`
  },
  research: {
    title: 'Nghiên cứu - Viện Công nghệ (RITM) | Dự án & Công trình nghiên cứu',
    description: 'Các dự án nghiên cứu, công trình khoa học và thành tựu nghiên cứu của Viện Công nghệ (RITM) trong lĩnh vực công nghệ cơ khí và vật liệu.',
    keywords: [
      'nghiên cứu viện công nghệ',
      'dự án nghiên cứu',
      'công trình khoa học',
      'thành tựu nghiên cứu',
      'nghiên cứu cơ khí',
      'nghiên cứu vật liệu',
      'dự án khoa học',
      'công trình nghiên cứu',
      'kết quả nghiên cứu',
      'nghiên cứu công nghệ'
    ],
    canonical: `${BASE_URL}/research`,
    ogImage: `${BASE_URL}/images/about/02.jpg`
  },
  blog: {
    title: 'Tin tức - Viện Công nghệ (RITM) | Tin tức & Sự kiện',
    description: 'Tin tức, sự kiện và hoạt động mới nhất của Viện Công nghệ (RITM). Cập nhật về các dự án, nghiên cứu và thành tựu của viện.',
    keywords: [
      'tin tức viện công nghệ',
      'sự kiện RITM',
      'hoạt động viện',
      'tin tức cơ khí',
      'sự kiện công nghệ',
      'tin tức nghiên cứu',
      'hoạt động khoa học',
      'tin tức dự án',
      'sự kiện chuyển giao',
      'tin tức đào tạo'
    ],
    canonical: `${BASE_URL}/blog`,
    ogImage: `${BASE_URL}/images/blog/01.jpg`
  },
  contact: {
    title: 'Liên hệ - Viện Công nghệ (RITM) | Thông tin liên hệ & Địa chỉ',
    description: 'Thông tin liên hệ, địa chỉ và cách thức liên hệ với Viện Công nghệ (RITM). Tư vấn và hỗ trợ về các dịch vụ công nghệ.',
    keywords: [
      'liên hệ viện công nghệ',
      'địa chỉ RITM',
      'thông tin liên hệ',
      'tư vấn công nghệ',
      'hỗ trợ kỹ thuật',
      'địa chỉ viện',
      'số điện thoại liên hệ',
      'email liên hệ',
      'tư vấn dịch vụ',
      'hỗ trợ khách hàng'
    ],
    canonical: `${BASE_URL}/contact`,
    ogImage: `${BASE_URL}/images/contact-bg.jpg`
  }
};

// Function to get SEO config for a specific page
export const getSEOConfig = (page: string, customData?: Partial<SEOConfig>): SEOConfig => {
  const pageConfig = PAGE_SEO_DATA[page] || DEFAULT_SEO;
  
  if (customData) {
    return {
      ...pageConfig,
      ...customData,
      keywords: [...(pageConfig.keywords || []), ...(customData.keywords || [])]
    };
  }
  
  return pageConfig;
};

// Function to generate canonical URL
export const generateCanonicalUrl = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_URL}${cleanPath}`;
};

// Function to optimize image alt text
export const generateImageAlt = (imagePath: string, title?: string, context?: string): string => {
  if (title) {
    return `${title} - ${context || 'Viện Công nghệ RITM'}`;
  }
  
  // Extract meaningful name from image path
  const fileName = imagePath.split('/').pop()?.split('.')[0] || '';
  const cleanName = fileName.replace(/[-_]/g, ' ').replace(/\d+/g, '').trim();
  
  if (cleanName) {
    return `${cleanName} - ${context || 'Viện Công nghệ RITM'}`;
  }
  
  return `Hình ảnh ${context || 'Viện Công nghệ RITM'}`;
};

// Function to generate image title
export const generateImageTitle = (imagePath: string, title?: string): string => {
  return title || generateImageAlt(imagePath);
};

// Google Analytics configuration
export const GA_CONFIG = {
  measurementId: process.env.REACT_APP_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX',
  debug: process.env.NODE_ENV === 'development'
};

// Sitemap configuration
export const SITEMAP_CONFIG = {
  baseUrl: BASE_URL,
  pages: [
    { path: '/', priority: 1.0, changefreq: 'daily' },
    { path: '/about', priority: 0.8, changefreq: 'monthly' },
    { path: '/services', priority: 0.9, changefreq: 'weekly' },
    { path: '/products', priority: 0.9, changefreq: 'weekly' },
    { path: '/organization', priority: 0.7, changefreq: 'monthly' },
    { path: '/research', priority: 0.8, changefreq: 'weekly' },
    { path: '/blog', priority: 0.8, changefreq: 'daily' },
    { path: '/contact', priority: 0.6, changefreq: 'monthly' }
  ]
};
