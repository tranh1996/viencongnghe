'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'vi' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('vi');

  // Initialize language from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('preferred-language') as Language;
      if (savedLang && (savedLang === 'vi' || savedLang === 'en')) {
        setLanguage(savedLang);
      } else {
        // Detect browser language
        const browserLang = navigator.language.split('-')[0] as Language;
        if (browserLang === 'vi' || browserLang === 'en') {
          setLanguage(browserLang);
        }
      }
    }
  }, []);

  // Translation function with parameter interpolation
  const t = (key: string, params?: Record<string, string | number>): string => {
    const translations = language === 'vi' ? viTranslations : enTranslations;
    let translation = translations[key] || key;
    
    // Replace placeholders with parameters
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        translation = translation.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(value));
      });
    }
    
    return translation;
  };

  const value = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    // Fallback for static generation
    const fallbackTranslations = viTranslations;
    return {
      language: 'vi' as Language,
      setLanguage: () => {},
      t: (key: string, params?: Record<string, string | number>): string => {
        let translation = fallbackTranslations[key] || key;
        
        // Replace placeholders with parameters
        if (params) {
          Object.entries(params).forEach(([paramKey, value]) => {
            translation = translation.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(value));
          });
        }
        
        return translation;
      },
    };
  }
  return context;
};

// Vietnamese translations
const viTranslations: Record<string, string> = {
  // Header
  'nav.home': 'Trang chủ',
  'nav.about': 'Về chúng tôi',
  'nav.about.general': 'Giới thiệu chung',
  'nav.organization': 'Cơ cấu tổ chức',
  'nav.products': 'Sản phẩm',
  'nav.news': 'Tin tức',
  'nav.library': 'Thư viện',
  'nav.contact': 'Liên hệ',
  'nav.about.visionMission': 'Tầm nhìn sứ mệnh',
  'nav.about.history': 'Lịch sử hình thành & phát triển',
  'nav.organization.units': 'Đơn vị đoàn thể',
  'nav.organization.admin': 'Phòng Tổ chức – Hành chính',
  'nav.organization.accounting': 'Phòng Kế toán – Tài chính',
  'nav.organization.testing': 'Phòng Kiểm định Vật liệu',
  'nav.organization.technology': 'Phòng Thí nghiệm công nghệ & các Hợp kim đúc',
  'nav.organization.quality': 'Phòng Quản lý Chất lượng',
  'nav.organization.mold': 'Trung tâm chế tạo khuôn mẫu',
  'nav.organization.research': 'Phòng Nghiên cứu vật liệu, xử lý nhiệt và bề mặt',
  'nav.organization.company': 'Công ty TNHH MTV Cơ khí Mê Linh',
  'nav.news.activities': 'Tin hoạt động',
  'nav.news.science': 'Tin khoa học công nghệ',
  'nav.news.professional': 'Bài viết Chuyên môn',
  'nav.news.training': 'Hoạt động Đào tạo & Tư vấn',
  'nav.news.viewAll': 'Xem tất cả',
  'header.freeConsultation': 'Tư vấn miễn phí',
  'header.contactNow': 'Liên hệ ngay',
  'header.mainOffice': 'Tòa nhà 8 tầng, số 25, Vũ Ngọc Phan, Hà Nội',
  'header.branchOffice': 'Lô 27B, khu Công nghiệp Quang Minh, Mê Linh, Hà Nội',
  'header.workingHours': 'Thứ 2 - Thứ 6: 8:00 - 17:00',

  // Home page
  'home.hero.title': 'Giá trị trong từng hành động',
  'home.hero.subtitle': 'Viện Công nghệ',
  'home.hero.description': 'Viện công nghệ (RITM) là một tổ chức nghiên cứu và phát triển công nghệ về lĩnh vực chế tạo vật liệu có tính chất đặc biệt, gia công cơ khí chế tạo khuôn mẫu, xử lý nhiệt và bề mặt với mục tiêu ứng dụng vào thực tế cũng như nội địa hóa các sản phẩm nhập khẩu.',
  'home.hero.aboutButton': 'Về chúng tôi',
  'home.hero.servicesButton': 'Dịch vụ',
  'home.about.title': 'Về chúng tôi',
  'home.about.heading': 'Hơn 50 năm hoạt động trong lĩnh vực cơ khí và luyện kim',
  'home.about.description': 'Viện Công nghệ (thuộc Tổng cục Công nghiệp Quốc phòng) thành lập từ 1973, có 233 cán bộ khoa học kỹ thuật (40 Tiến sĩ, 160 Thạc sĩ). Chuyên về nghiên cứu phát triển công nghệ cơ khí, điện tử, vật liệu, hóa chất và tư vấn đầu tư, được trang bị thiết bị hiện đại như máy CNC 5 trục, hệ thống đo lường chính xác. Đơn vị hàng đầu trong lĩnh vực KHCN quốc phòng với 50 năm kinh nghiệm, thực hiện chuyển giao công nghệ lưỡng dụng phục vụ cả mục đích quân sự và dân sự.',
  'home.about.readMore': 'Xem thêm',
  'home.about.videos': 'Video giới thiệu',
  'home.about.watchOurStory': 'Xem câu chuyện của chúng tôi',
  'home.services.title': 'Lĩnh vực hoạt động',
  'home.services.heading': 'Chuyên môn và dịch vụ của chúng tôi',
  'home.services.description': 'Viện cũng triển khai nhiều nghiên cứu về lĩnh vực vật liệu mới, nhiệt luyện, cơ khí chế tạo khuôn mẫu với mục tiêu ứng dụng vào thực tế.',
  'home.services.casting': 'Công nghệ đúc và vật liệu mới',
  'home.services.heatTreatment': 'Công nghệ xử lý nhiệt',
  'home.services.machining': 'Cơ khí chế tạo khuôn mẫu',
  'home.services.testing': 'Kiểm định vật liệu',
  'home.services.transfer': 'Chuyển giao thiết bị/công nghệ',
  'home.services.training': 'Đào tạo, tư vấn công nghệ',
  'home.services.viewDetails': 'Xem chi tiết',
  'home.stats.years': 'Năm kinh nghiệm',
  'home.stats.projects': 'Dự án nghiên cứu',
  'home.stats.products': 'Sản phẩm chế tạo',
  'home.stats.customers': 'Khách hàng tin tưởng',
  'home.news.title': 'Tin tức',
  'home.news.heading': 'Tin tức mới nhất',
  'home.news.readMore': 'Đọc thêm',
  'home.news.noNews': 'Hiện tại không có tin tức mới.',
  'common.recentlyUpdated': 'Mới cập nhật',
  'home.cta.title': 'Sẵn sàng hợp tác với chúng tôi?',
  'home.cta.description': 'Liên hệ với đội ngũ chuyên gia của chúng tôi ngay hôm nay để thảo luận về nhu cầu nghiên cứu và khám phá cách chúng tôi có thể giúp bạn đạt được mục tiêu khoa học.',
  'home.cta.contactNow': 'Liên hệ ngay',
  'home.cta.viewServices': 'Xem dịch vụ',

  // About page
  'about.pageTitle': 'Về chúng tôi',
  'about.breadcrumb.home': 'Trang chủ',
  'about.breadcrumb.about': 'Về chúng tôi',
  'about.title': 'Về Viện Công nghệ',
  'about.heading': 'Hơn 50 năm hoạt động trong lĩnh vực cơ khí và luyện kim',
  'about.description1': 'Trong suốt hơn 50 năm hoạt động trong lĩnh vực cơ khí và luyện kim, Viện Công nghệ không ngừng đầu tư và phát triển các lĩnh vực thế mạnh của Viện nhằm đáp ứng được những yêu cầu khắt khe nhất của khách hàng trong nước và quốc tế.',
  'about.description2': 'Bên cạnh đó, Viện cũng triển khai nhiều nghiên cứu về lĩnh vực vật liệu mới, nhiệt luyện, cơ khí chế tạo khuôn mẫu với mục tiêu ứng dụng vào thực tế cũng như nội địa hóa các sản phẩm nhập khẩu.',
  'about.mission.title': 'Sứ mệnh',
  'about.mission.description': 'Nghiên cứu và phát triển công nghệ về lĩnh vực chế tạo vật liệu có tính chất đặc biệt, gia công cơ khí chế tạo khuôn mẫu, xử lý nhiệt và bề mặt với mục tiêu ứng dụng vào thực tế cũng như nội địa hóa các sản phẩm nhập khẩu.',
  'about.vision.title': 'Tầm nhìn',
  'about.vision.description': 'Trở thành viện nghiên cứu hàng đầu trong lĩnh vực cơ khí và luyện kim, được công nhận về sự xuất sắc, đổi mới và cam kết thúc đẩy sự phát triển của khoa học công nghệ.',
  'about.values.title': 'Giá trị cốt lõi',
  'about.values.quality': 'Chất lượng',
  'about.values.innovation': 'Đổi mới',
  'about.values.collaboration': 'Hợp tác',
  'about.values.integrity': 'Uy tín',
  'about.resources.title': 'Nguồn lực',
  'about.resources.facilities': 'Cơ sở vật chất',
  'about.resources.experts': 'Đội ngũ chuyên gia',
  'about.resources.technology': 'Công nghệ tiên tiến',
  'about.organization.title': 'Ban lãnh đạo',

  // Vision & Mission page
  'visionMission.pageTitle': 'Tầm nhìn & Sứ mệnh',
  'visionMission.breadcrumb.home': 'Trang chủ',
  'visionMission.breadcrumb.about': 'Về chúng tôi',
  'visionMission.breadcrumb.visionMission': 'Tầm nhìn & Sứ mệnh',
  'visionMission.title': 'Tầm nhìn & Sứ mệnh',
  'visionMission.mainTitle': 'VIỆN CÔNG NGHỆ - GIÁTRỊ TRONG TỪNG HÀNH ĐỘNG',
  'visionMission.overview.title': 'Tổng quan',
  'visionMission.organization.title': 'Ban lãnh đạo',
  'visionMission.organization.members': 'Thành viên ban lãnh đạo',
  'visionMission.vision.title': 'Tầm nhìn',
  'visionMission.mission.title': 'Sứ mệnh',
  'visionMission.values.title': 'Giá trị cốt lõi',
  'visionMission.vision.contentNotAvailable': 'Nội dung tầm nhìn chưa có sẵn.',
  'visionMission.mission.contentNotAvailable': 'Nội dung sứ mệnh chưa có sẵn.',
  'visionMission.values.contentNotAvailable': 'Nội dung giá trị cốt lõi chưa có sẵn.',
  'visionMission.summary.title': 'Tầm nhìn và Sứ mệnh',
  'visionMission.summary.description': 'Viện Công nghệ cam kết thực hiện tầm nhìn trở thành một tổ chức nghiên cứu hàng đầu trong lĩnh vực công nghệ, đóng góp tích cực vào sự phát triển bền vững của đất nước. Chúng tôi nỗ lực không ngừng để thực hiện sứ mệnh nghiên cứu, phát triển và chuyển giao công nghệ tiên tiến.',
  'visionMission.summary.aboutButton': 'Về chúng tôi',
  'visionMission.summary.historyButton': 'Lịch sử phát triển',

  // History page
  'history.pageTitle': 'Lịch sử hình thành & phát triển',
  'history.breadcrumb.home': 'Trang chủ',
  'history.breadcrumb.about': 'Về chúng tôi',
  'history.breadcrumb.history': 'Lịch sử hình thành & phát triển',
  'history.title': 'Lịch sử hình thành & phát triển',
  'history.subtitle': 'Hành trình hơn 50 năm phát triển',
  'history.milestones.title': 'Các mốc lịch sử quan trọng',

  // Services page
  'services.pageTitle': 'Lĩnh vực hoạt động',
  'services.breadcrumb.home': 'Trang chủ',
  'services.breadcrumb.services': 'Lĩnh vực hoạt động',
  'services.title': 'Lĩnh vực hoạt động',
  'services.heading': 'Chuyên môn và dịch vụ của chúng tôi',
  'services.description': 'Viện cũng triển khai nhiều nghiên cứu về lĩnh vực vật liệu mới, nhiệt luyện, cơ khí chế tạo khuôn mẫu với mục tiêu ứng dụng vào thực tế cũng như nội địa hóa các sản phẩm nhập khẩu.',
  'services.viewDetails': 'Xem chi tiết',
  'services.additional.title': 'Dịch vụ bổ sung',
  'services.additional.research.title': 'Nghiên cứu và phát triển',
  'services.additional.research.description': 'Thực hiện các dự án nghiên cứu khoa học, phát triển công nghệ mới và ứng dụng vào thực tế sản xuất.',
  'services.additional.training.title': 'Đào tạo và chuyển giao',
  'services.additional.training.description': 'Cung cấp các khóa đào tạo chuyên sâu về công nghệ đúc, xử lý nhiệt, kiểm định vật liệu.',

  // Products page
  'products.pageTitle': 'Sản phẩm & Dịch vụ',
  'products.breadcrumb.home': 'Trang chủ',
  'products.breadcrumb.products': 'Sản phẩm & Dịch vụ',
  'products.title': 'SẢN PHẨM & DỊCH VỤ',
  'products.heading': 'Các sản phẩm và dịch vụ của chúng tôi',
  'products.description': 'Viện Công nghệ cung cấp đa dạng các sản phẩm và dịch vụ trong lĩnh vực cơ khí, luyện kim và công nghệ vật liệu.',
  'products.category.technology': 'Khoa học công nghệ',
  'products.category.casting': 'Đúc',
  'products.category.machining': 'Gia công cơ khí',
  'products.viewDetails': 'Xem chi tiết',
  'products.special.title': 'Sản phẩm đặc biệt',
  'products.services.title': 'Dịch vụ của chúng tôi',
  'products.brand': 'Thương hiệu',
  'products.noDescription': 'Chưa có mô tả',
  
  // Product search and filters
  'products.search.title': 'Tìm kiếm sản phẩm',
  'products.search.placeholder': 'Tìm kiếm sản phẩm...',
  'products.search.searching': 'Đang tìm kiếm...',
  'products.search.popular.title': 'Từ khóa phổ biến',
  'products.search.results.found': 'Tìm thấy {count} kết quả cho "{query}"',
  'products.search.results.notFound': 'Không tìm thấy sản phẩm nào phù hợp với "{query}"',
  'products.search.results.notFoundMessage': 'Không tìm thấy sản phẩm nào phù hợp với "{query}". Vui lòng thử từ khóa khác.',
  'products.search.clear': 'Xóa tìm kiếm',
  'products.search.backToAll': 'Quay lại tất cả sản phẩm',
  'products.search.viewMore': 'Xem thêm',
  'products.search.enterToSearch': 'Nhấn Enter để tìm kiếm tất cả kết quả cho "{query}"',
  'products.search.noSuggestions': 'Nhập từ khóa để tìm kiếm sản phẩm',
  'products.search.viewMoreInCategory': 'Xem thêm {count} sản phẩm khác trong {category}',
  
  // Product categories
  'products.categories.title': 'Danh mục sản phẩm',
  'products.categories.all': 'Tất cả',
  'products.categories.showAll': 'Hiển thị tất cả',
  
  // Product sorting and filtering
  'products.sort.sortBy': 'Sắp xếp theo',
  'products.sort.default': 'Thứ tự mặc định',
  'products.sort.nameAsc': 'Tên A-Z',
  'products.sort.nameDesc': 'Tên Z-A',
  'products.sort.newest': 'Mới nhất',
  'products.sort.oldest': 'Cũ nhất',
  'products.sort.popular': 'Phổ biến',
  'products.sort.name': 'Theo tên',
  
  // Product results
  'products.results.showing': 'Hiển thị',
  'products.results.to': '-',
  'products.results.of': 'của',
  'products.results.total': 'kết quả',
  'products.results.noProducts': 'Không có sản phẩm nào',
  'products.results.noProductsMessage': 'Không tìm thấy sản phẩm nào trong danh mục này.',
  'products.results.tryDifferentSearch': 'Thử từ khóa tìm kiếm khác hoặc duyệt qua các danh mục.',
  'products.results.loading': 'Đang tải...',
  'products.results.error': 'Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.',
  
  // Popular search terms
  'products.popular.juicer': 'Máy ép trái cây',
  'products.popular.tea': 'Trà',
  'products.popular.household': 'Đồ gia dụng',
  'products.popular.medical': 'Thiết bị y tế',
  'products.popular.technology': 'Công nghệ',
  'products.popular.research': 'Nghiên cứu',

  // Blog page
  'blog.pageTitle': 'Tin tức',
  'blog.breadcrumb.home': 'Trang chủ',
  'blog.breadcrumb.news': 'Tin tức',
  'blog.title': 'Tin tức',
  'blog.heading': 'Tin tức mới nhất',
  'blog.description': 'Cập nhật những tin tức mới nhất về hoạt động, nghiên cứu và phát triển của Viện Công nghệ.',
  'blog.readMore': 'Đọc thêm',
  'blog.categories.activities': 'Tin hoạt động',
  'blog.categories.science': 'Tin khoa học công nghệ',
  'blog.categories.training': 'Hoạt động đào tạo',
  'blog.professional.title': 'Bài viết chuyên môn',
  'blog.allCategories': 'Tất cả danh mục',
  'blog.categories': 'Danh mục',
  'blog.noPosts': 'Không có bài viết',
  'blog.noPostsDescription': 'Hiện tại không có bài viết nào trong danh mục này.',
  'blog.breadcrumb.loading': 'Đang tải...',
  'blog.breadcrumb.error': 'Lỗi',
  'blog.postNotFound': 'Không tìm thấy bài viết',
  'blog.tags': 'Thẻ',
  'blog.backToBlog': 'Quay lại tin tức',
  'blog.noCategory': 'Không phân loại',
  'blog.relatedPosts': 'Bài viết liên quan',
  'blog.noRelatedPosts': 'Không có bài viết liên quan',
  'blog.searchTitle': 'Tìm kiếm bài viết',
  'blog.searchPlaceholder': 'Tìm kiếm bài viết...',
  'blog.recentPosts': 'Bài viết gần đây',
  'blog.popularTags': 'Thẻ phổ biến',
  'blog.admin': 'Quản trị viên',
  'blog.tags.laboratory': 'Phòng thí nghiệm',
  'blog.tags.research': 'Nghiên cứu',
  'blog.tags.technology': 'Công nghệ',
  'blog.tags.science': 'Khoa học',
  'blog.tags.innovation': 'Đổi mới',
  'blog.tags.development': 'Phát triển',
  'blog.comments.title': 'Bình luận cho bài viết',
  'blog.comments.noComments': 'Chưa có bình luận nào cho bài viết này.',
  'blog.comments.leaveReply': 'Để lại bình luận',
  'blog.comments.name': 'Họ tên',
  'blog.comments.email': 'Email',
  'blog.comments.comment': 'Bình luận',
  'blog.comments.namePlaceholder': 'Nhập họ tên của bạn',
  'blog.comments.emailPlaceholder': 'Nhập email của bạn',
  'blog.comments.commentPlaceholder': 'Nhập bình luận của bạn',
  'blog.comments.postComment': 'Gửi bình luận',
  'blog.search.results': 'Kết quả tìm kiếm',
  'blog.search.found': 'bài viết được tìm thấy cho',
  'blog.search.clear': 'Xóa tìm kiếm',
  'blog.search.noResults': 'Không tìm thấy kết quả',
  'blog.search.noResultsDescription': 'Không tìm thấy bài viết nào phù hợp với từ khóa',
  'blog.search.clearSearch': 'Xóa tìm kiếm và xem tất cả bài viết',

  // Library page
  'library.pageTitle': 'Thư viện',
  'library.breadcrumb.home': 'Trang chủ',
  'library.breadcrumb.library': 'Thư viện',
  'library.title': 'Thư viện',
  'library.heading': 'Hình ảnh hoạt động',
  'library.description': 'Khám phá những hình ảnh về các hoạt động, dự án và sự kiện của Viện Công nghệ trong suốt quá trình hoạt động và phát triển.',
  'library.activities.research': 'Hoạt động nghiên cứu',
  'library.activities.laboratory': 'Phòng thí nghiệm',
  'library.activities.production': 'Sản xuất',
  'library.activities.training': 'Đào tạo',
  'library.activities.seminar': 'Hội thảo',
  'library.activities.exhibition': 'Triển lãm',
  'library.video.title': 'Video hoạt động',
  'library.video.introduction': 'Giới thiệu Viện Công nghệ',
  'library.video.production': 'Quy trình sản xuất',
  'library.video.watch': 'Xem video',
  'library.gallery.title': 'Thư viện ảnh',

  // Contact page
  'contact.pageTitle': 'Liên hệ',
  'contact.breadcrumb.home': 'Trang chủ',
  'contact.breadcrumb.contact': 'Liên hệ',
  'contact.title': 'Liên hệ với chúng tôi',
  'contact.heading': 'Thông tin liên hệ',
  'contact.description': 'Sẵn sàng hợp tác với chúng tôi? Liên hệ với đội ngũ chuyên gia ngay hôm nay để thảo luận về nhu cầu và khám phá cách chúng tôi có thể giúp bạn đạt được mục tiêu.',
  'contact.form.title': 'Gửi tin nhắn cho chúng tôi',
  'contact.form.fullName': 'Họ và tên',
  'contact.form.company': 'Công ty',
  'contact.form.email': 'Email',
  'contact.form.phone': 'Điện thoại',
  'contact.form.subject': 'Tiêu đề',
  'contact.form.message': 'Nội dung',
  'contact.form.sendMessage': 'Gửi tin nhắn',
  'contact.form.department': 'Phòng ban quan tâm',
  'contact.form.departmentPlaceholder': 'Chọn phòng ban',
  'contact.form.successMessage': 'Tin nhắn đã được gửi thành công! Chúng tôi sẽ liên hệ lại với bạn sớm nhất.',
  'contact.form.errorMessage': 'Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại.',
  'contact.form.reset': 'Làm mới',
  'contact.info.title': 'Thông tin liên hệ',
  'contact.info.mainOffice': 'Trụ sở chính',
  'contact.info.branchOffice': 'Cơ sở 2',
  'contact.info.additional': 'Thông tin thêm',
  'contact.info.address': 'Địa chỉ',
  'contact.info.phone': 'Điện thoại',
  'contact.info.email': 'Email',
  'contact.info.website': 'Website',
  'contact.info.workingHoursTitle': 'Giờ làm việc',
  'contact.info.workingHours': 'Giờ làm việc',
  'contact.location.title': 'Vị trí của chúng tôi',
  'contact.location.getDirections': 'Chỉ đường',

  // Footer
  'footer.about.title': 'Về chúng tôi',
  'footer.about.description': 'Viện Công nghệ là một đơn vị nghiên cứu Khoa học và Công nghệ Quân sự trực thuộc Tổng cục Công nghiệp Quốc phòng, thành lập vào ngày 21/8/1973. Viện Công nghệ có một đội ngũ cán bộ nghiên cứu toàn diện, có trình độ chuyên môn cao, trên 30% quân số là Tiến sĩ, Thạc sĩ, hoạt động trên nhiều ngành.',
  'footer.quickLinks': 'Liên kết nhanh',
  'footer.services': 'Dịch vụ',
  'footer.contact': 'Liên hệ',
  'footer.followUs': 'Theo dõi chúng tôi',
  'footer.copyright': '© 2024 Viện Công nghệ. Tất cả quyền được bảo lưu.',
  'footer.privacy': 'Chính sách bảo mật',
  'footer.terms': 'Điều khoản sử dụng',

  // Footer company
  'footer.company.name': 'VIỆN CÔNG NGHỆ',
  'footer.company.subtitle': 'Institute of Technology',
  'footer.company.description': 'Viện công nghệ là một tổ chức nghiên cứu và phát triển công nghệ về lĩnh vực chế tạo vật liệu có tính chất đặc biệt, gia công cơ khí chế tạo khuôn mẫu, xử lý nhiệt và bề mặt với mục tiêu ứng dụng vào thực tế.',
  'footer.introduction.title': 'GIỚI THIỆU',
  'footer.introduction.about': 'Về chúng tôi',
  'footer.introduction.organization': 'Cơ cấu tổ chức',
  'footer.introduction.products': 'Sản phẩm & Dịch vụ',
  'footer.introduction.activities': 'Hình ảnh hoạt động',
  'footer.news.title': 'TIN TỨC',
  'footer.news.activities': 'Tin hoạt động',
  'footer.news.science': 'Tin khoa học công nghệ',
  'footer.news.training': 'Hoạt động đào tạo và tư vấn',
  'footer.news.professional': 'Bài viết chuyên môn',
  'footer.companyInfo.title': 'THÔNG TIN CÔNG TY',
  'footer.companyInfo.mainOffice': 'Trụ sở chính',
  'footer.companyInfo.branchOffice': 'Cơ sở 2',
  'footer.companyInfo.phone': 'Điện thoại',
  'footer.companyInfo.email': 'Email',
  'footer.companyInfo.workingHours': 'Giờ làm việc',
  'footer.sitemap': 'Sơ đồ trang',

  // Organization page
  'organization.title': 'Danh sách các phòng ban',
  'organization.description': 'Khám phá cơ cấu tổ chức của Viện Công nghệ với các phòng ban chuyên môn, đảm bảo hiệu quả hoạt động và phát triển bền vững.',
  'organization.loading': 'Đang tải dữ liệu...',
  'organization.error': 'Lỗi tải dữ liệu',
  'organization.noData': 'Không có dữ liệu',
  'organization.noDataMessage': 'Hiện tại không có thông tin về các phòng ban.',
  'organization.viewDetails': 'Xem chi tiết',
  'organization.contactInfo': 'Thông tin liên hệ:',
  'organization.backToList': 'Quay lại danh sách',
  'organization.backToDepartments': 'Xem phòng ban khác',
  'organization.departmentIntro': 'Giới thiệu phòng ban',
  'organization.imagesVideos': 'Hình ảnh & Video',
  'organization.image': 'Hình ảnh',
  'organization.video': 'Video',
  'organization.contactInformation': 'Thông tin liên hệ',
  'organization.email': 'Email',
  'organization.phone': 'Điện thoại',
  'organization.address': 'Địa chỉ',
  'organization.contactNotAvailable': 'Thông tin liên hệ chưa có sẵn.',
  'organization.generalContact': 'Liên hệ chung',
  'organization.generalContactDesc': 'Để biết thêm thông tin, vui lòng liên hệ:',
  'organization.haveQuestions': 'Bạn có câu hỏi?',
  'organization.haveQuestionsDesc': 'Nếu bạn cần thêm thông tin về phòng ban này hoặc muốn hợp tác, vui lòng liên hệ với chúng tôi.',
  'organization.viewAllDepartments': 'Xem tất cả phòng ban',
  'organization.departmentList': 'Danh sách phòng ban',

  // Language switcher
  'language.vi': 'Tiếng Việt',
  'language.en': 'English',
};

// English translations
const enTranslations: Record<string, string> = {
  // Header
  'nav.home': 'Home',
  'nav.about': 'About Us',
  'nav.about.general': 'General Introduction',
  'nav.organization': 'Organization',
  'nav.products': 'Products',
  'nav.news': 'News',
  'nav.library': 'Library',
  'nav.contact': 'Contact',
  'nav.about.visionMission': 'Vision & Mission',
  'nav.about.history': 'History of Formation & Development',
  'nav.organization.units': 'Units',
  'nav.organization.admin': 'Administration Department',
  'nav.organization.accounting': 'Accounting & Finance Department',
  'nav.organization.testing': 'Material Testing Department',
  'nav.organization.technology': 'Technology Laboratory & Casting Alloys Department',
  'nav.organization.quality': 'Quality Management Department',
  'nav.organization.mold': 'Mold Manufacturing Center',
  'nav.organization.research': 'Material Research, Heat Treatment & Surface Department',
  'nav.organization.company': 'Mechanical Engineering Company Limited',
  'nav.news.activities': 'Activity News',
  'nav.news.science': 'Science & Technology News',
  'nav.news.professional': 'Professional Articles',
  'nav.news.training': 'Training & Consulting Activities',
  'nav.news.viewAll': 'View All',
  'header.freeConsultation': 'Free Consultation',
  'header.contactNow': 'Contact Now',
  'header.mainOffice': '8-story building, No. 25, Vu Ngoc Phan, Hanoi',
  'header.branchOffice': 'Lot 27B, Quang Minh Industrial Park, Me Linh, Hanoi',
  'header.workingHours': 'Mon - Fri: 8:00 - 17:00',

  // Home page
  'home.hero.title': 'Value in Every Action',
  'home.hero.subtitle': 'Technology Institute',
  'home.hero.description': 'The Technology Institute (RITM) is a research and technology development organization in the field of manufacturing special materials, mechanical engineering for mold making, heat treatment and surface treatment with the goal of practical application as well as localization of imported products.',
  'home.hero.aboutButton': 'About Us',
  'home.hero.servicesButton': 'Services',
  'home.about.title': 'About Us',
  'home.about.heading': 'Over 50 years of experience in mechanical engineering and metallurgy',
  'home.about.description': 'The Technology Institute (under the General Department of Defense Industry) was established in 1973, with 233 scientific and technical staff (40 PhDs, 160 Masters). Specializing in research and development of mechanical, electronic, materials, chemical technology and investment consulting, equipped with modern equipment such as 5-axis CNC machines and precision measurement systems. A leading unit in the field of defense science and technology with 50 years of experience, implementing dual-use technology transfer serving both military and civilian purposes.',
  'home.about.readMore': 'Read More',
  'home.about.videos': 'Introduction Videos',
  'home.about.watchOurStory': 'Watch Our Story',
  'home.services.title': 'Areas of Operation',
  'home.services.heading': 'Our Expertise and Services',
  'home.services.description': 'The Institute also implements many research projects in the field of new materials, heat treatment, mechanical engineering for mold making with the goal of practical application.',
  'home.services.casting': 'Casting Technology and New Materials',
  'home.services.heatTreatment': 'Heat Treatment Technology',
  'home.services.machining': 'Mechanical Engineering for Mold Making',
  'home.services.testing': 'Material Testing',
  'home.services.transfer': 'Equipment/Technology Transfer',
  'home.services.training': 'Training and Technology Consulting',
  'home.services.viewDetails': 'View Details',
  'home.stats.years': 'Years of Experience',
  'home.stats.projects': 'Research Projects',
  'home.stats.products': 'Manufactured Products',
  'home.stats.customers': 'Trusted Customers',
  'home.news.title': 'News',
  'home.news.heading': 'Latest News',
  'home.news.readMore': 'Read More',
  'home.news.noNews': 'No news available at the moment.',
  'common.recentlyUpdated': 'Recently Updated',
  'home.cta.title': 'Ready to Collaborate with Us?',
  'home.cta.description': 'Contact our team of experts today to discuss your research needs and discover how we can help you achieve your scientific goals.',
  'home.cta.contactNow': 'Contact Now',
  'home.cta.viewServices': 'View Services',

  // About page
  'about.pageTitle': 'About Us',
  'about.breadcrumb.home': 'Home',
  'about.breadcrumb.about': 'About Us',
  'about.title': 'About Technology Institute',
  'about.heading': 'Over 50 years of experience in mechanical engineering and metallurgy',
  'about.description1': 'Throughout more than 50 years of operation in the field of mechanical engineering and metallurgy, the Technology Institute has continuously invested and developed the Institute\'s strengths to meet the most stringent requirements of domestic and international customers.',
  'about.description2': 'Additionally, the Institute also implements many research projects in the field of new materials, heat treatment, mechanical engineering for mold making with the goal of practical application as well as localization of imported products.',
  'about.mission.title': 'Mission',
  'about.mission.description': 'Research and develop technology in the field of manufacturing special materials, mechanical engineering for mold making, heat treatment and surface treatment with the goal of practical application as well as localization of imported products.',
  'about.vision.title': 'Vision',
  'about.vision.description': 'To become the leading research institute in the field of mechanical engineering and metallurgy, recognized for excellence, innovation and commitment to promoting the development of science and technology.',
  'about.values.title': 'Core Values',
  'about.values.quality': 'Quality',
  'about.values.innovation': 'Innovation',
  'about.values.collaboration': 'Collaboration',
  'about.values.integrity': 'Integrity',
  'about.resources.title': 'Resources',
  'about.resources.facilities': 'Facilities',
  'about.resources.experts': 'Expert Team',
  'about.resources.technology': 'Advanced Technology',
  'about.organization.title': 'Leadership',

  // Vision & Mission page
  'visionMission.pageTitle': 'Vision & Mission',
  'visionMission.breadcrumb.home': 'Home',
  'visionMission.breadcrumb.about': 'About Us',
  'visionMission.breadcrumb.visionMission': 'Vision & Mission',
  'visionMission.title': 'Vision & Mission',
  'visionMission.mainTitle': 'TECHNOLOGY INSTITUTE - VALUE IN EVERY ACTION',
  'visionMission.overview.title': 'Overview',
  'visionMission.organization.title': 'Leadership',
  'visionMission.organization.members': 'Leadership Members',
  'visionMission.vision.title': 'Vision',
  'visionMission.mission.title': 'Mission',
  'visionMission.values.title': 'Core Values',
  'visionMission.vision.contentNotAvailable': 'Vision content not available.',
  'visionMission.mission.contentNotAvailable': 'Mission content not available.',
  'visionMission.values.contentNotAvailable': 'Core values content not available.',
  'visionMission.summary.title': 'Vision and Mission',
  'visionMission.summary.description': 'The Technology Institute is committed to realizing its vision of becoming a leading research organization in the field of technology, actively contributing to the sustainable development of the country. We strive continuously to fulfill our mission of researching, developing and transferring advanced technologies.',
  'visionMission.summary.aboutButton': 'About Us',
  'visionMission.summary.historyButton': 'Development History',

  // History page
  'history.pageTitle': 'History of Formation & Development',
  'history.breadcrumb.home': 'Home',
  'history.breadcrumb.about': 'About Us',
  'history.breadcrumb.history': 'History of Formation & Development',
  'history.title': 'History of Formation & Development',
  'history.subtitle': 'Over 50 years of development journey',
  'history.milestones.title': 'Key Historical Milestones',

  // Services page
  'services.pageTitle': 'Areas of Operation',
  'services.breadcrumb.home': 'Home',
  'services.breadcrumb.services': 'Areas of Operation',
  'services.title': 'Areas of Operation',
  'services.heading': 'Our Expertise and Services',
  'services.description': 'The Institute also implements many research projects in the field of new materials, heat treatment, mechanical engineering for mold making with the goal of practical application as well as localization of imported products.',
  'services.viewDetails': 'View Details',
  'services.additional.title': 'Additional Services',
  'services.additional.research.title': 'Research and Development',
  'services.additional.research.description': 'Conduct scientific research projects, develop new technologies and apply them to practical production.',
  'services.additional.training.title': 'Training and Transfer',
  'services.additional.training.description': 'Provide intensive training courses on casting technology, heat treatment, material testing.',

  // Products page
  'products.pageTitle': 'Products & Services',
  'products.breadcrumb.home': 'Home',
  'products.breadcrumb.products': 'Products & Services',
  'products.title': 'PRODUCTS & SERVICES',
  'products.heading': 'Our Products and Services',
  'products.description': 'The Technology Institute provides diverse products and services in the field of mechanical engineering, metallurgy and material technology.',
  'products.category.technology': 'Science & Technology',
  'products.category.casting': 'Casting',
  'products.category.machining': 'Mechanical Processing',
  'products.viewDetails': 'View Details',
  'products.special.title': 'Special Products',
  'products.services.title': 'Our Services',
  'products.brand': 'Brand',
  'products.noDescription': 'No description available',
  
  // Product search and filters
  'products.search.title': 'Search Products',
  'products.search.placeholder': 'Search products...',
  'products.search.searching': 'Searching...',
  'products.search.popular.title': 'Popular Keywords',
  'products.search.results.found': 'Found {count} results for "{query}"',
  'products.search.results.notFound': 'No products found matching "{query}"',
  'products.search.results.notFoundMessage': 'No products found matching "{query}". Please try different keywords.',
  'products.search.clear': 'Clear Search',
  'products.search.backToAll': 'Back to All Products',
  'products.search.viewMore': 'View More',
  'products.search.enterToSearch': 'Press Enter to search all results for "{query}"',
  'products.search.noSuggestions': 'Enter keywords to search products',
  'products.search.viewMoreInCategory': 'View {count} more products in {category}',
  
  // Product categories
  'products.categories.title': 'Product Categories',
  'products.categories.all': 'All',
  'products.categories.showAll': 'Show All',
  
  // Product sorting and filtering
  'products.sort.sortBy': 'Sort By',
  'products.sort.default': 'Default Order',
  'products.sort.nameAsc': 'Name A-Z',
  'products.sort.nameDesc': 'Name Z-A',
  'products.sort.newest': 'Newest',
  'products.sort.oldest': 'Oldest',
  'products.sort.popular': 'Popular',
  'products.sort.name': 'By Name',
  
  // Product results
  'products.results.showing': 'Showing',
  'products.results.to': '-',
  'products.results.of': 'of',
  'products.results.total': 'results',
  'products.results.noProducts': 'No Products',
  'products.results.noProductsMessage': 'No products found in this category.',
  'products.results.tryDifferentSearch': 'Try different search keywords or browse through categories.',
  'products.results.loading': 'Loading...',
  'products.results.error': 'Unable to load product data. Please try again later.',
  
  // Popular search terms
  'products.popular.juicer': 'Juicer',
  'products.popular.tea': 'Tea',
  'products.popular.household': 'Household Items',
  'products.popular.medical': 'Medical Equipment',
  'products.popular.technology': 'Technology',
  'products.popular.research': 'Research',

  // Blog page
  'blog.pageTitle': 'News',
  'blog.breadcrumb.home': 'Home',
  'blog.breadcrumb.news': 'News',
  'blog.title': 'News',
  'blog.heading': 'Latest News',
  'blog.description': 'Stay updated with the latest news about activities, research and development of the Technology Institute.',
  'blog.readMore': 'Read More',
  'blog.categories.activities': 'Activity News',
  'blog.categories.science': 'Science & Technology News',
  'blog.categories.training': 'Training Activities',
  'blog.professional.title': 'Professional Articles',
  'blog.allCategories': 'All Categories',
  'blog.categories': 'Categories',
  'blog.noPosts': 'No Posts',
  'blog.noPostsDescription': 'There are currently no posts in this category.',
  'blog.breadcrumb.loading': 'Loading...',
  'blog.breadcrumb.error': 'Error',
  'blog.postNotFound': 'Post not found',
  'blog.tags': 'Tags',
  'blog.backToBlog': 'Back to News',
  'blog.noCategory': 'Uncategorized',
  'blog.relatedPosts': 'Related Posts',
  'blog.noRelatedPosts': 'No related posts found',
  'blog.searchTitle': 'Search Articles',
  'blog.searchPlaceholder': 'Search articles...',
  'blog.recentPosts': 'Recent Posts',
  'blog.popularTags': 'Popular Tags',
  'blog.admin': 'Admin',
  'blog.tags.laboratory': 'Laboratory',
  'blog.tags.research': 'Research',
  'blog.tags.technology': 'Technology',
  'blog.tags.science': 'Science',
  'blog.tags.innovation': 'Innovation',
  'blog.tags.development': 'Development',
  'blog.comments.title': 'Comments on',
  'blog.comments.noComments': 'No comments yet for this article.',
  'blog.comments.leaveReply': 'Leave a Reply',
  'blog.comments.name': 'Name',
  'blog.comments.email': 'Email',
  'blog.comments.comment': 'Comment',
  'blog.comments.namePlaceholder': 'Enter your name',
  'blog.comments.emailPlaceholder': 'Enter your email',
  'blog.comments.commentPlaceholder': 'Enter your comment',
  'blog.comments.postComment': 'Post Comment',
  'blog.search.results': 'Search results',
  'blog.search.found': 'articles found for',
  'blog.search.clear': 'Clear search',
  'blog.search.noResults': 'No results found',
  'blog.search.noResultsDescription': 'No articles found matching the keyword',
  'blog.search.clearSearch': 'Clear search and view all articles',

  // Library page
  'library.pageTitle': 'Library',
  'library.breadcrumb.home': 'Home',
  'library.breadcrumb.library': 'Library',
  'library.title': 'Library',
  'library.heading': 'Activity Images',
  'library.description': 'Explore images of activities, projects and events of the Technology Institute throughout its operation and development process.',
  'library.activities.research': 'Research Activities',
  'library.activities.laboratory': 'Laboratory',
  'library.activities.production': 'Production',
  'library.activities.training': 'Training',
  'library.activities.seminar': 'Seminar',
  'library.activities.exhibition': 'Exhibition',
  'library.video.title': 'Activity Videos',
  'library.video.introduction': 'Technology Institute Introduction',
  'library.video.production': 'Production Process',
  'library.video.watch': 'Watch Video',
  'library.gallery.title': 'Photo Gallery',

  // Contact page
  'contact.pageTitle': 'Contact',
  'contact.breadcrumb.home': 'Home',
  'contact.breadcrumb.contact': 'Contact',
  'contact.title': 'Contact Us',
  'contact.heading': 'Contact Information',
  'contact.description': 'Ready to collaborate with us? Contact our team of experts today to discuss your needs and discover how we can help you achieve your goals.',
  'contact.form.title': 'Send us a Message',
  'contact.form.fullName': 'Full Name',
  'contact.form.company': 'Company',
  'contact.form.email': 'Email',
  'contact.form.phone': 'Phone',
  'contact.form.subject': 'Subject',
  'contact.form.message': 'Message',
  'contact.form.sendMessage': 'Send Message',
  'contact.form.department': 'Department of Interest',
  'contact.form.departmentPlaceholder': 'Select Department',
  'contact.form.successMessage': 'Message sent successfully! We will contact you back as soon as possible.',
  'contact.form.errorMessage': 'An error occurred while sending the message. Please try again.',
  'contact.form.reset': 'Reset',
  'contact.info.title': 'Contact Information',
  'contact.info.mainOffice': 'Main Office',
  'contact.info.branchOffice': 'Branch Office',
  'contact.info.additional': 'Additional Information',
  'contact.info.address': 'Address',
  'contact.info.phone': 'Phone',
  'contact.info.email': 'Email',
  'contact.info.website': 'Website',
  'contact.info.workingHoursTitle': 'Working Hours',
  'contact.info.workingHours': 'Working Hours',
  'contact.location.title': 'Our Locations',
  'contact.location.getDirections': 'Get Directions',

  // Footer
  'footer.about.title': 'About Us',
  'footer.about.description': 'Institute of Technology is an organization for research and development of technology in the field of manufacturing special materials and mechanical processing.',
  'footer.quickLinks': 'Quick Links',
  'footer.services': 'Services',
  'footer.contact': 'Contact',
  'footer.followUs': 'Follow Us',
  'footer.copyright': '© 2024 Institute of Technology. All rights reserved.',
  'footer.privacy': 'Privacy Policy',
  'footer.terms': 'Terms of Service',

  // Footer company
  'footer.company.name': 'TECHNOLOGY INSTITUTE',
  'footer.company.subtitle': 'Institute of Technology ',
  'footer.company.description': 'The Technology Institute is a research and technology development organization in the field of manufacturing special materials, mechanical engineering for mold making, heat treatment and surface treatment with the goal of practical application.',
  'footer.introduction.title': 'INTRODUCTION',
  'footer.introduction.about': 'About Us',
  'footer.introduction.organization': 'Organization',
  'footer.introduction.products': 'Products & Services',
  'footer.introduction.activities': 'Activity Images',
  'footer.news.title': 'NEWS',
  'footer.news.activities': 'Activity News',
  'footer.news.science': 'Science & Technology News',
  'footer.news.training': 'Training & Consulting Activities',
  'footer.news.professional': 'Professional Articles',
  'footer.companyInfo.title': 'COMPANY INFORMATION',
  'footer.companyInfo.mainOffice': 'Main Office',
  'footer.companyInfo.branchOffice': 'Branch Office',
  'footer.companyInfo.phone': 'Phone',
  'footer.companyInfo.email': 'Email',
  'footer.companyInfo.workingHours': 'Working Hours',
  'footer.sitemap': 'Sitemap',

  // Organization page
  'organization.title': 'List of Departments',
  'organization.description': 'Explore the organizational structure of the Technology Institute with specialized departments, ensuring operational efficiency and sustainable development.',
  'organization.loading': 'Loading data...',
  'organization.error': 'Error Loading Data',
  'organization.noData': 'No Data Available',
  'organization.noDataMessage': 'Currently no department information is available.',
  'organization.viewDetails': 'View Details',
  'organization.contactInfo': 'Contact Information:',
  'organization.backToList': 'Back to List',
  'organization.backToDepartments': 'View Other Departments',
  'organization.departmentIntro': 'Department Introduction',
  'organization.imagesVideos': 'Images & Videos',
  'organization.image': 'Image',
  'organization.video': 'Video',
  'organization.contactInformation': 'Contact Information',
  'organization.email': 'Email',
  'organization.phone': 'Phone',
  'organization.address': 'Address',
  'organization.contactNotAvailable': 'Contact information not available.',
  'organization.generalContact': 'General Contact',
  'organization.generalContactDesc': 'For more information, please contact:',
  'organization.haveQuestions': 'Have Questions?',
  'organization.haveQuestionsDesc': 'If you need more information about this department or want to collaborate, please contact us.',
  'organization.viewAllDepartments': 'View All Departments',
  'organization.departmentList': 'Department List',

  // Language switcher
  'language.vi': 'Tiếng Việt',
  'language.en': 'English',
};
