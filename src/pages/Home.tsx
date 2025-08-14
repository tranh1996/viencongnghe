import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useLanguage } from '../contexts/LanguageContext';
import BannerSlider from '../components/BannerSlider';
import SEO from '../components/SEO';
import OptimizedImage from '../components/OptimizedImage';
import { getSEOConfig } from '../utils/seo';

const Home: React.FC = () => {
  const { t } = useLanguage();

  // Banner slides for home page
  const bannerSlides = [
    {
      id: 1,
      image: '/images/banner/01.jpg',
      title: {
        vi: 'Dịch vụ chất lượng cao <span>Phòng thí nghiệm</span>',
        en: 'High Laboratory <span>Quality Service</span>'
      },
      subtitle: {
        vi: 'Chuyên môn nghiên cứu xuất sắc',
        en: 'Lab Research Excellence'
      },
      description: {
        vi: 'Chào mừng đến với trung tâm phòng thí nghiệm nghiên cứu của chúng tôi, nơi nghiên cứu đột phá gặp gỡ ứng dụng thực tế. Chúng tôi tập hợp chuyên môn đa dạng để giải quyết các vấn đề toàn cầu.',
        en: 'Welcome to our research laboratory center, where groundbreaking research meets practical applications. We bring together diverse expertise to tackle global issues.'
      },
      primaryButton: {
        text: {
          vi: 'Tìm hiểu thêm',
          en: 'Explore More'
        },
        link: '/about'
      },
      secondaryButton: {
        text: {
          vi: 'Liên hệ',
          en: 'Contact Us'
        },
        link: '/contact'
      }
    },
    {
      id: 2,
      image: '/images/banner/02.jpg',
      title: {
        vi: 'Dịch vụ đáng tin cậy & <span>Chất lượng cao</span>',
        en: 'Reliable & High <span>Quality Service</span>'
      },
      subtitle: {
        vi: 'Chuyên môn nghiên cứu xuất sắc',
        en: 'Lab Research Excellence'
      },
      description: {
        vi: 'Chào mừng đến với trung tâm phòng thí nghiệm nghiên cứu của chúng tôi, nơi nghiên cứu đột phá gặp gỡ ứng dụng thực tế. Chúng tôi tập hợp chuyên môn đa dạng để giải quyết các vấn đề toàn cầu.',
        en: 'Welcome to our research laboratory center, where groundbreaking research meets practical applications. We bring together diverse expertise to tackle global issues.'
      },
      primaryButton: {
        text: {
          vi: 'Tìm hiểu thêm',
          en: 'Explore More'
        },
        link: '/about'
      },
      secondaryButton: {
        text: {
          vi: 'Liên hệ',
          en: 'Contact Us'
        },
        link: '/contact'
      }
    },
    {
      id: 3,
      image: '/images/banner/03.jpg',
      title: {
        vi: 'Dịch vụ chất lượng cao',
        en: 'High Quality Services'
      },
      subtitle: {
        vi: 'Chuyên môn & Uy tín',
        en: 'Expertise & Reliability'
      },
      description: {
        vi: 'Cung cấp các dịch vụ kỹ thuật chất lượng cao với đội ngũ chuyên gia giàu kinh nghiệm',
        en: 'Providing high-quality technical services with experienced expert teams'
      },
      primaryButton: {
        text: {
          vi: 'Xem dịch vụ',
          en: 'View Services'
        },
        link: '/services'
      },
      secondaryButton: {
        text: {
          vi: 'Tìm hiểu thêm',
          en: 'Learn More'
        },
        link: '/about'
      }
    },
    {
      id: 4,
      image: '/images/banner/04.jpg',
      title: {
        vi: 'Đào tạo & Chuyển giao',
        en: 'Training & Transfer'
      },
      subtitle: {
        vi: 'Kiến thức & Kinh nghiệm',
        en: 'Knowledge & Experience'
      },
      description: {
        vi: 'Đào tạo chuyên sâu và chuyển giao công nghệ trong các lĩnh vực chuyên môn',
        en: 'Intensive training and technology transfer in specialized fields'
      },
      primaryButton: {
        text: {
          vi: 'Khóa học',
          en: 'Courses'
        },
        link: '/services'
      },
      secondaryButton: {
        text: {
          vi: 'Liên hệ tư vấn',
          en: 'Contact for Consultation'
        },
        link: '/contact'
      }
    }
  ];

  // Structured data for the home page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Viện Công nghệ (RITM) - Trang chủ",
    "description": "Trang chủ của Viện Công nghệ (RITM) - Viện nghiên cứu công nghệ cơ khí hàng đầu Việt Nam",
    "url": "https://viencongnghe.com",
    "mainEntity": {
      "@type": "Organization",
      "name": "Viện Công nghệ (RITM)",
      "alternateName": "Research Institute of Technology for Machinery",
      "description": "Viện nghiên cứu công nghệ cơ khí hàng đầu Việt Nam",
      "url": "https://viencongnghe.com",
      "logo": "https://viencongnghe.com/images/logo.svg",
      "foundingDate": "1970",
      "areaServed": "Vietnam",
      "serviceType": [
        "Công nghệ đúc",
        "Nhiệt luyện",
        "Gia công cơ khí",
        "Kiểm định vật liệu",
        "Chuyển giao công nghệ"
      ]
    }
  };

  return (
    <>
      <SEO config={getSEOConfig('home')} structuredData={structuredData} />
      
      {/* Hero Section */}
      <BannerSlider slides={bannerSlides} />

      {/* About Section */}
      <section className="light-bg">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <OptimizedImage 
                src="/images/about/01.jpg" 
                alt="Viện Công nghệ RITM - Nghiên cứu và phát triển"
                context="Trang chủ - Giới thiệu"
                className="about-img-shape"
                style={{ backgroundImage: 'url(/images/about/01.jpg)' }}
              />
            </Col>
            <Col lg={6}>
              <div className="ps-lg-5">
                <h6 className="text-theme mb-3">{t('home.about.title')}</h6>
                <h1 className="mb-4">{t('home.about.heading')}</h1>
                <p className="mb-4">
                  {t('home.about.description')}
                </p>
                <ul className="list-icon style-1">
                  <li>
                    <i className="bi bi-check-circle-fill"></i>
                    <span>{t('home.services.casting')}</span>
                  </li>
                  <li>
                    <i className="bi bi-check-circle-fill"></i>
                    <span>{t('home.services.heatTreatment')}</span>
                  </li>
                  <li>
                    <i className="bi bi-check-circle-fill"></i>
                    <span>{t('home.services.machining')}</span>
                  </li>
                  <li>
                    <i className="bi bi-check-circle-fill"></i>
                    <span>{t('home.services.testing')}</span>
                  </li>
                </ul>
                <div className="mt-4">
                  <Link to="/about" className="themeht-btn primary-btn">
                    {t('home.about.readMore')}
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Services Section */}
      <section>
        <Container>
          <Row className="text-center mb-5">
            <Col lg={8} className="mx-auto">
              <h6 className="text-theme mb-3">{t('home.services.title')}</h6>
              <h2 className="mb-4">{t('home.services.heading')}</h2>
              <p>
                {t('home.services.description')}
              </p>
            </Col>
          </Row>
          <Row>
            <Col lg={4} md={6} className="mb-4">
              <div className="service-item text-center p-4 rounded">
                <div className="service-icon mb-4">
                  <i className="bi bi-gear text-theme" style={{ fontSize: '3rem' }}></i>
                </div>
                <h3 className="h5 mb-3">{t('home.services.casting')}</h3>
                <p>
                  {t('home.services.casting')} - Nghiên cứu, phát triển các nhóm hợp kim đặc biệt dùng trong quốc phòng, y sinh. 
                  Mô phỏng thiết kế đúc bằng phần mềm MAGMASoft.
                </p>
                <Link to="/services" className="text-theme text-decoration-none">
                  {t('home.services.viewDetails')} <i className="bi bi-arrow-right ms-1"></i>
                </Link>
              </div>
            </Col>
            <Col lg={4} md={6} className="mb-4">
              <div className="service-item text-center p-4 rounded">
                <div className="service-icon mb-4">
                  <i className="bi bi-thermometer-half text-theme" style={{ fontSize: '3rem' }}></i>
                </div>
                <h3 className="h5 mb-3">{t('home.services.heatTreatment')}</h3>
                <p>
                  {t('home.services.heatTreatment')} - Nghiên cứu, dịch vụ nhiệt luyện chân không, nhiệt luyện truyền thống và hóa nhiệt luyện 
                  (thấm C, C-N, N) các loại khuôn và các sản phẩm cơ khí.
                </p>
                <Link to="/services" className="text-theme text-decoration-none">
                  {t('home.services.viewDetails')} <i className="bi bi-arrow-right ms-1"></i>
                </Link>
              </div>
            </Col>
            <Col lg={4} md={6} className="mb-4">
              <div className="service-item text-center p-4 rounded">
                <div className="service-icon mb-4">
                  <i className="bi bi-tools text-theme" style={{ fontSize: '3rem' }}></i>
                </div>
                <h3 className="h5 mb-3">{t('home.services.machining')}</h3>
                <p>
                  {t('home.services.machining')} - Thiết kế, chế tạo hoàn chỉnh các loại khuôn kim loại dùng trong các lĩnh vực 
                  rèn, dập, ép và đúc áp lực.
                </p>
                <Link to="/services" className="text-theme text-decoration-none">
                  {t('home.services.viewDetails')} <i className="bi bi-arrow-right ms-1"></i>
                </Link>
              </div>
            </Col>
            <Col lg={4} md={6} className="mb-4">
              <div className="service-item text-center p-4 rounded">
                <div className="service-icon mb-4">
                  <i className="bi bi-clipboard-check text-theme" style={{ fontSize: '3rem' }}></i>
                </div>
                <h3 className="h5 mb-3">{t('home.services.testing')}</h3>
                <p>
                  {t('home.services.testing')} - Thử nghiệm, kiểm định trong lĩnh vực hóa, cơ, không phá huỷ các loại vật liệu, 
                  kết cấu hàn và chi tiết máy.
                </p>
                <Link to="/services" className="text-theme text-decoration-none">
                  {t('home.services.viewDetails')} <i className="bi bi-arrow-right ms-1"></i>
                </Link>
              </div>
            </Col>
            <Col lg={4} md={6} className="mb-4">
              <div className="service-item text-center p-4 rounded">
                <div className="service-icon mb-4">
                  <i className="bi bi-arrow-repeat text-theme" style={{ fontSize: '3rem' }}></i>
                </div>
                <h3 className="h5 mb-3">{t('home.services.transfer')}</h3>
                <p>
                  {t('home.services.transfer')} - Cung cấp và chuyển giao công nghệ các thiết bị về xử lý nhiệt, Các dây chuyền/ 
                  hệ thống kết cấu cơ khí.
                </p>
                <Link to="/services" className="text-theme text-decoration-none">
                  {t('home.services.viewDetails')} <i className="bi bi-arrow-right ms-1"></i>
                </Link>
              </div>
            </Col>
            <Col lg={4} md={6} className="mb-4">
              <div className="service-item text-center p-4 rounded">
                <div className="service-icon mb-4">
                  <i className="bi bi-mortarboard text-theme" style={{ fontSize: '3rem' }}></i>
                </div>
                <h3 className="h5 mb-3">{t('home.services.training')}</h3>
                <p>
                  {t('home.services.training')} - Đào tạo, tư vấn trong lĩnh vực như Công nghệ Đúc; Xử lý nhiệt; Kiểm định vật liệu; 
                  và các lĩnh vực khác.
                </p>
                <Link to="/services" className="text-theme text-decoration-none">
                  {t('home.services.viewDetails')} <i className="bi bi-arrow-right ms-1"></i>
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="primary-bg text-white">
        <Container>
          <Row className="text-center">
            <Col lg={3} md={6} className="mb-4">
              <div className="counter">
                <h3 className="mb-2">50+</h3>
                <p>{t('home.stats.years')}</p>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <div className="counter">
                <h3 className="mb-2">100+</h3>
                <p>{t('home.stats.projects')}</p>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <div className="counter">
                <h3 className="mb-2">500+</h3>
                <p>{t('home.stats.products')}</p>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <div className="counter">
                <h3 className="mb-2">1000+</h3>
                <p>{t('home.stats.customers')}</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* News Section */}
      <section className="light-bg">
        <Container>
          <Row className="text-center mb-5">
            <Col lg={8} className="mx-auto">
              <h6 className="text-theme mb-3">{t('home.news.title')}</h6>
              <h2 className="mb-4">{t('home.news.heading')}</h2>
            </Col>
          </Row>
          <Row>
            <Col lg={4} md={6} className="mb-4">
              <div className="card h-100">
                <OptimizedImage 
                  src="/images/blog/01.jpg" 
                  alt="Tháng công nhân – Lan tỏa yêu thương, chia sẻ khó khăn"
                  context="Tin tức - Hoạt động"
                  className="card-img-top"
                />
                <div className="card-body">
                  <h6 className="text-muted mb-2">27/05/25</h6>
                  <h3 className="h5 card-title">Tháng công nhân – Lan tỏa yêu thương, chia sẻ khó khăn</h3>
                  <p className="card-text">
                    Hoạt động ý nghĩa trong tháng công nhân với nhiều hoạt động thiết thực...
                  </p>
                  <Link to="/blog" className="text-theme text-decoration-none">
                    {t('home.news.readMore')} <i className="bi bi-arrow-right ms-1"></i>
                  </Link>
                </div>
              </div>
            </Col>
            <Col lg={4} md={6} className="mb-4">
              <div className="card h-100">
                <OptimizedImage 
                  src="/images/blog/02.jpg" 
                  alt="Hoạt động hướng tới kỷ niệm 80 năm ngày thành lập Quân đội nhân dân Việt Nam"
                  context="Tin tức - Sự kiện"
                  className="card-img-top"
                />
                <div className="card-body">
                  <h6 className="text-muted mb-2">20/12/24</h6>
                  <h3 className="h5 card-title">Hoạt động hướng tới kỷ niệm 80 năm ngày thành lập Quân đội nhân dân Việt Nam</h3>
                  <p className="card-text">
                    Các hoạt động kỷ niệm 80 năm ngày thành lập Quân đội nhân dân Việt Nam...
                  </p>
                  <Link to="/blog" className="text-theme text-decoration-none">
                    {t('home.news.readMore')} <i className="bi bi-arrow-right ms-1"></i>
                  </Link>
                </div>
              </div>
            </Col>
            <Col lg={4} md={6} className="mb-4">
              <div className="card h-100">
                <OptimizedImage 
                  src="/images/blog/03.jpg" 
                  alt="Triển lãm Quốc tế về công nghiệp hỗ trợ VIMEXPO 2022"
                  context="Tin tức - Triển lãm"
                  className="card-img-top"
                />
                <div className="card-body">
                  <h6 className="text-muted mb-2">21/11/22</h6>
                  <h3 className="h5 card-title">Triển lãm Quốc tế về công nghiệp hỗ trợ VIMEXPO 2022</h3>
                  <p className="card-text">
                    Viện Công nghệ tham gia triển lãm VIMEXPO 2022 với nhiều sản phẩm công nghệ...
                  </p>
                  <Link to="/blog" className="text-theme text-decoration-none">
                    {t('home.news.readMore')} <i className="bi bi-arrow-right ms-1"></i>
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="primary-bg text-white">
        <Container>
          <Row className="text-center">
            <Col lg={8} className="mx-auto">
              <h2 className="mb-4">{t('home.cta.title')}</h2>
              <p className="mb-4">
                {t('home.cta.description')}
              </p>
              <Link to="/contact" className="themeht-btn secondary-btn me-3">
                {t('home.cta.contactNow')}
              </Link>
              <Link to="/services" className="themeht-btn primary-btn">
                {t('home.cta.viewServices')}
              </Link>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Home; 