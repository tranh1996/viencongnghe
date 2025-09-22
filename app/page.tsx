'use client';

import type { Metadata } from 'next';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {Container, Row, Col, Button, Card} from 'react-bootstrap';
import { useLanguage } from '@/contexts/LanguageContext';
import BannerSlider from '@/components/BannerSlider';
import OptimizedImage from '@/components/OptimizedImage';
import { fetchLatestNews, News, fetchAboutOverview, AboutOverview, fetchBanners, Banner, fetchProducts, Product, fetchPartners, Partner } from '@/utils/api';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function HomePage() {
  const { t, language } = useLanguage();
  const [latestNews, setLatestNews] = useState<News[]>([]);
  const [aboutOverview, setAboutOverview] = useState<AboutOverview | null>(null);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [aboutLoading, setAboutLoading] = useState(true);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [partnersLoading, setPartnersLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsData, aboutData, bannerData, productsData, partnersData] = await Promise.all([
          fetchLatestNews(language, 3),
          fetchAboutOverview(language),
          fetchBanners('header', 1),
          fetchProducts(language, 1, 4), // Fetch 4 products for homepage
          fetchPartners() // Fetch partners data
        ]);
        setLatestNews(newsData);
        setAboutOverview(aboutData);
        setBanners(bannerData);
        setProducts(productsData.products);
        setPartners(partnersData);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback to empty array if API fails
        setLatestNews([]);
        setAboutOverview(null);
        setBanners([]);
        setProducts([]);
        setPartners([]);
      } finally {
        setLoading(false);
        setAboutLoading(false);
        setBannerLoading(false);
        setProductsLoading(false);
        setPartnersLoading(false);
      }
    };

    fetchData();
  }, [language]);

  // Auto-play functionality for partners slider
  useEffect(() => {
    const interval = setInterval(() => {
      const track = document.getElementById('partnersTrack');
      const slides = track?.querySelectorAll('.partner-slide');
      const activeSlide = track?.querySelector('.partner-slide.active');

      if (slides && activeSlide) {
        const activeIndex = Array.from(slides).indexOf(activeSlide as Element);
        const nextIndex = activeIndex === slides.length - 1 ? 0 : activeIndex + 1;

        activeSlide.classList.remove('active');
        slides[nextIndex]?.classList.add('active');

        // Update indicators
        const indicators = document.querySelectorAll('.partners-indicator');
        indicators.forEach(indicator => indicator.classList.remove('active'));
        indicators[nextIndex]?.classList.add('active');
      }
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, []);

  // Auto-play functionality for products slider
  useEffect(() => {
    // Only enable auto-play if we have more than 4 products (multiple slides)
    if (productsLoading || products.length <= 4) return;

    const interval = setInterval(() => {
      const track = document.getElementById('productsTrack');
      const slides = track?.querySelectorAll('.product-slide');
      const activeSlide = track?.querySelector('.product-slide.active');

      if (slides && activeSlide && slides.length > 1) {
        const activeIndex = Array.from(slides).indexOf(activeSlide as Element);
        const nextIndex = activeIndex === slides.length - 1 ? 0 : activeIndex + 1;

        activeSlide.classList.remove('active');
        slides[nextIndex]?.classList.add('active');

        // Update indicators
        const indicators = document.querySelectorAll('.products-indicator');
        indicators.forEach(indicator => indicator.classList.remove('active'));
        indicators[nextIndex]?.classList.add('active');
      }
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [productsLoading, products.length]);


  const formatDate = (dateString: string | null) => {
    if (!dateString) {
      return '';
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return '';
    }
    return date.toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Transform API banners to BannerSlider format
  const transformBanners = (apiBanners: Banner[]) => {
    return apiBanners
      .sort((a, b) => a.priority - b.priority) // Sort by priority
      .map((banner) => ({
        id: banner.id,
        image: banner.imageUrl,
        title: {
          vi: 'Giá trị trong từng hành động',
          en: 'VALUE IN EVERY ACTION'
        },
        subtitle: {
          vi: '',
          en: ''
        },
        description: {
          vi: 'Viện Công nghệ (thuộc Tổng cục Công nghiệp Quốc phòng) thành lập từ 1973, có 233 cán bộ khoa học kỹ thuật (40 Tiến sĩ, 160 Thạc sĩ). Chuyên về nghiên cứu phát triển công nghệ cơ khí, điện tử, vật liệu, hóa chất và tư vấn đầu tư, được trang bị thiết bị hiện đại như máy CNC 5 trục, hệ thống đo lường chính xác. Đơn vị hàng đầu trong lĩnh vực KHCN quốc phòng với 50 năm kinh nghiệm, thực hiện chuyển giao công nghệ lưỡng dụng phục vụ cả mục đích quân sự và dân sự.',
          en: 'The Technology Institute (under the General Department of Defense Industry) was established in 1973, with 233 scientific and technical staff (40 PhDs, 160 Masters). Specializing in research and development of mechanical, electronic, materials, chemical technology and investment consulting, equipped with modern equipment such as 5-axis CNC machines and precision measurement systems. A leading unit in the field of defense science and technology with 50 years of experience, implementing dual-use technology transfer serving both military and civilian purposes.'
        },
        primaryButton: {
          text: {
            vi: 'VỀ CHÚNG TÔI',
            en: 'ABOUT US'
          },
          link: '/about'
        }
      }));
  };

  // Banner slides for home page
  const bannerSlides = [
    {
      id: 1,
      image: '/images/backgroudBanner.png',
      title: {
        vi: 'Giá trị trong từng hành động',
        en: 'VALUE IN EVERY ACTION'
      },
      subtitle: {
        vi: '',
        en: ''
      },
      description: {
        vi: 'Viện công nghệ  là một tổ chức nghiên cứu và phát triển công nghệ về lĩnh vực chế tạo vật liệu có tính chất đặc biệt, gia công cơ khí chế tạo khuôn mẫu, xử lý nhiệt và bề mặt với mục tiêu ứng dụng vào thực tế cũng như nội địa hóa các sản phẩm nhập khẩu',
        en: 'The Institute of Technology is a research and development organization focused on manufacturing materials with special properties, mechanical processing for mold making, heat treatment and surface processing, aimed at practical applications as well as localizing imported products.'
      },
      primaryButton: {
        text: {
          vi: 'VỀ CHÚNG TÔI',
          en: 'ABOUT US'
        },
        link: '/about'
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

  return (
    <>
      {/* Hero Section */}
      {bannerLoading ? (
        <div className="banner-loading" style={{
          height: '600px',
          background: '#f8f9fa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="spinner-border text-theme" role="status">
            <span className="visually-hidden">Loading banners...</span>
          </div>
        </div>
      ) : (
        <BannerSlider slides={banners.length > 0 ? transformBanners(banners) : bannerSlides} />
      )}

      <div style={{ maxWidth: '1170px', margin: '0 auto' }}>

      {/* About Section */}
      <section style={{ paddingTop: '140px' }}>
        <Container>
          <Row>
            <Col lg={6} className="mb-4 mb-lg-0">
              {aboutLoading ? (
                <div className="about-img-shape" style={{ 
                  height: '100%', 
                  background: '#f8f9fa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div className="spinner-border text-theme" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : aboutOverview && aboutOverview.images.length > 0 ? (
                <div className="about-img-shape position-relative">
                  <div id="aboutImageCarousel" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-inner">
                      {aboutOverview.images.map((image, index) => (
                        <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                          <OptimizedImage 
                            src={image} 
                            alt={`${aboutOverview.title} - Image ${index + 1}`}
                            context="Trang chủ - Giới thiệu"
                            className="w-100 h-100"
                            style={{
                              objectFit: 'cover',
                              height: '100%',
                              width: '100%'
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    {aboutOverview.images.length > 1 && (
                      <>
                        <button className="carousel-control-prev" type="button" data-bs-target="#aboutImageCarousel" data-bs-slide="prev">
                          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                          <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#aboutImageCarousel" data-bs-slide="next">
                          <span className="carousel-control-next-icon" aria-hidden="true"></span>
                          <span className="visually-hidden">Next</span>
                        </button>
                        <div className="carousel-indicators">
                          {aboutOverview.images.map((_, index) => (
                            <button 
                              key={index}
                              type="button" 
                              data-bs-target="#aboutImageCarousel" 
                              data-bs-slide-to={index} 
                              className={index === 0 ? 'active' : ''}
                              aria-current={index === 0 ? 'true' : 'false'}
                              aria-label={`Slide ${index + 1}`}
                            ></button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <OptimizedImage 
                  src="/images/about/01.jpg" 
                  alt="Viện Công nghệ RITM - Nghiên cứu và phát triển"
                  context="Trang chủ - Giới thiệu"
                  className="about-img-shape"
                  style={{ backgroundImage: 'url(/images/about/01.jpg)' }}
                />
              )}
            </Col>
            <Col lg={6}>
              <div className="ps-lg-6">
                <p className="text-theme">{t('home.about.title')}</p>
                <span style={{ textTransform: 'uppercase', fontSize: '2.25rem', fontWeight: 700 }}>
                  {aboutOverview?.title || t('home.about.heading')}
                </span>
                <div className="is-divider divider clearfix" style={{ maxWidth: '66px', backgroundColor: 'rgb(33, 117, 155)' }}></div>
                <span className="mb-3 about-description">
                  {aboutOverview?.description || t('home.about.description')}
                </span>
                <div className="mt-1">
                  <Link
                    href="/about"
                    className="themeht-btn primary-btn"
                    style={{
                      backgroundColor: 'white !important',
                      color: '#FF9500 !important',
                      borderColor: '#FF9500',
                      textTransform: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.setProperty('background-color', '#FF9500', 'important');
                      e.currentTarget.style.setProperty('color', 'white', 'important');
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.setProperty('background-color', 'white', 'important');
                      e.currentTarget.style.setProperty('color', '#FF9500', 'important');
                    }}
                  >
                    <span>{t('home.about.readMore')}</span>
                    <i className="bi bi-caret-right"></i>
                  </Link>
                </div>
                
                {/* Video Section - Company Introduction */}

                {/* Additional Videos from API - Only show if videos are available */}
                {aboutOverview && aboutOverview.videos && aboutOverview.videos.length > 0 && (
                  <div className="mt-4">
                    <Row>
                      {aboutOverview.videos.map((video, index) => (
                        <Col lg={12} key={index}>
                          <div className="ratio ratio-16x9">
                            <iframe
                              src={video.url}
                              title={video.title}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="rounded"
                            ></iframe>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Services Section */}
      <section className="services-section py-5" style={{ backgroundImage: 'url(/images/bg-left-bottom.webp)', backgroundPosition: 'left bottom', backgroundRepeat: 'no-repeat', width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: 'calc(50vw - 50%)', paddingRight: 'calc(50vw - 50%)' }}>
        <Container>
          <Row className="text-center mb-5">
            <Col lg={12}>
              <p className="section-subtitle text-uppercase mb-2">
                {language === 'vi' ? 'FIELDS OF OPERATION' : 'FIELDS OF OPERATION'}
              </p>
              <h2 className="section-main-title mb-4">
                {language === 'vi' ? 'LĨNH VỰC HOẠT ĐỘNG' : 'FIELDS OF OPERATION'}
              </h2>
            </Col>
          </Row>
          <Row>
            {/* Service 1: Casting Technology */}
            <Col lg={4} md={6} className="mb-4">
              <div className="service-card position-relative">
                <div className="service-number-badge">
                  <span>01</span>
                </div>
                <div className="service-image">
                  <OptimizedImage
                    src="/images/casting.webp"
                    alt={language === 'vi' ? 'Công nghệ đúc và vật liệu mới' : 'Casting Technology and New Materials'}
                    context="Dịch vụ - Công nghệ đúc"
                    className="service-img"
                  />
                </div>
                <div className="service-content">
                  <h3 className="service-title">
                    {language === 'vi' ? 'Công nghệ đúc và vật liệu mới' : 'Casting Technology and New Materials'}
                  </h3>
                  <p className="service-description">
                    {language === 'vi'
                      ? 'Nghiên cứu, phát triển các nhóm hợp kim đặc biệt dùng trong quốc phòng, y sinh, phòng thiết kế đúc bằng phần mềm MAGMASoft.'
                      : 'Research and development of special alloy groups for defense and medical use, casting design software MAGMASoft.'
                    }
                  </p>
                </div>
              </div>
            </Col>

            {/* Service 2: Heat Treatment */}
            <Col lg={4} md={6} className="mb-4">
              <div className="service-card position-relative">
                <div className="service-number-badge">
                  <span>02</span>
                </div>
                <div className="service-image">
                  <OptimizedImage
                    src="/images/heat-treatment.webp"
                    alt={language === 'vi' ? 'Công nghệ xử lý nhiệt' : 'Heat Treatment Technology'}
                    context="Dịch vụ - Xử lý nhiệt"
                    className="service-img"
                  />
                </div>
                <div className="service-content">
                  <h3 className="service-title">
                    {language === 'vi' ? 'Công nghệ xử lý nhiệt' : 'Heat Treatment Technology'}
                  </h3>
                  <p className="service-description">
                    {language === 'vi'
                      ? 'Nhiệt luyện chân không, nhiệt luyện truyền thống và hóa nhiệt luyện (thấm C, C-N, N) các loại khuôn và các sản phẩm cơ khí.'
                      : 'Vacuum heat treatment, traditional heat treatment and chemical heat treatment (C, C-N, N diffusion) for molds and mechanical products.'
                    }
                  </p>
                </div>
              </div>
            </Col>

            {/* Service 3: Mold Manufacturing */}
            <Col lg={4} md={6} className="mb-4">
              <div className="service-card position-relative">
                <div className="service-number-badge">
                  <span>03</span>
                </div>
                <div className="service-image">
                  <OptimizedImage
                    src="/images/machining.webp"
                    alt={language === 'vi' ? 'Cơ khí chế tạo khuôn mẫu' : 'Mechanical Mold Manufacturing'}
                    context="Dịch vụ - Gia công cơ khí"
                    className="service-img"
                  />
                </div>
                <div className="service-content">
                  <h3 className="service-title">
                    {language === 'vi' ? 'Cơ khí chế tạo khuôn mẫu' : 'Mechanical Mold Manufacturing'}
                  </h3>
                  <p className="service-description">
                    {language === 'vi'
                      ? 'Thiết kế, chế tạo hoàn chỉnh các loại khuôn kim loại dùng trong các lĩnh vực rèn, dập, ép và đúc áp lực.'
                      : 'Complete design and manufacturing of metal molds for forging, stamping, pressing and pressure casting fields.'
                    }
                  </p>
                </div>
              </div>
            </Col>

            {/* Service 4: Material Testing */}
            <Col lg={4} md={6} className="mb-4">
              <div className="service-card position-relative">
                <div className="service-number-badge">
                  <span>04</span>
                </div>
                <div className="service-image">
                  <OptimizedImage
                    src="/images/testing.jpg"
                    alt={language === 'vi' ? 'Kiểm định vật liệu' : 'Material Testing'}
                    context="Dịch vụ - Kiểm định"
                    className="service-img"
                  />
                </div>
                <div className="service-content">
                  <h3 className="service-title">
                    {language === 'vi' ? 'Kiểm định vật liệu' : 'Material Testing'}
                  </h3>
                  <p className="service-description">
                    {language === 'vi'
                      ? 'Thử nghiệm, kiểm định trong lĩnh vực hóa, cơ, không phá huỷ các loại vật liệu, kết cấu hàn và chi tiết máy.'
                      : 'Testing and inspection in chemical, mechanical, non-destructive fields for materials, welded structures and machine parts.'
                    }
                  </p>
                </div>
              </div>
            </Col>

            {/* Service 5: Technology Transfer */}
            <Col lg={4} md={6} className="mb-4">
              <div className="service-card position-relative">
                <div className="service-number-badge">
                  <span>05</span>
                </div>
                <div className="service-image">
                  <OptimizedImage
                    src="/images/transfer.webp"
                    alt={language === 'vi' ? 'Chuyển giao thiết bị/công nghệ' : 'Equipment/Technology Transfer'}
                    context="Dịch vụ - Chuyển giao công nghệ"
                    className="service-img"
                  />
                </div>
                <div className="service-content">
                  <h3 className="service-title">
                    {language === 'vi' ? 'Chuyển giao thiết bị/công nghệ' : 'Equipment/Technology Transfer'}
                  </h3>
                  <p className="service-description">
                    {language === 'vi'
                      ? 'Cung cấp và chuyển giao công nghệ các thiết bị về xử lý nhiệt, các dây chuyển hệ thống kết cấu cơ khí.'
                      : 'Supply and transfer of heat treatment equipment technology, mechanical structure system production lines.'
                    }
                  </p>
                </div>
              </div>
            </Col>

            {/* Service 6: Training & Consulting */}
            <Col lg={4} md={6} className="mb-4">
              <div className="service-card position-relative">
                <div className="service-number-badge">
                  <span>06</span>
                </div>
                <div className="service-image">
                  <OptimizedImage
                    src="/images/training.webp"
                    alt={language === 'vi' ? 'Đào tạo, tư vấn công nghệ' : 'Technology Training and Consulting'}
                    context="Dịch vụ - Đào tạo"
                    className="service-img"
                  />
                </div>
                <div className="service-content">
                  <h3 className="service-title">
                    {language === 'vi' ? 'Đào tạo, tư vấn công nghệ' : 'Technology Training and Consulting'}
                  </h3>
                  <p className="service-description">
                    {language === 'vi'
                      ? 'Đào tạo, tư vấn trong lĩnh vực như Công nghệ Đúc; Xử lý nhiệt; Kiểm định vật liệu; và các lĩnh vực khác.'
                      : 'Training and consulting in fields such as Casting Technology; Heat Treatment; Material Testing; and other fields.'
                    }
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* News Section */}
      <section style={{ paddingTop: '30px', paddingBottom: '30px', backgroundPosition: 'left bottom', backgroundRepeat: 'no-repeat', width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: 'calc(50vw - 50%)', paddingRight: 'calc(50vw - 50%)' }}>
        <Container>
          {/* News Section Title */}
          <Row className="mb-5">
            <Col lg={12}>
              <div className="news-section-header">
                <h2 className="news-section-title">
                  {language === 'vi' ? 'Tin tức' : 'News'}
                </h2>
              </div>
            </Col>
          </Row>

          {/* News Content */}
          <Row>
            {loading ? (
              <Col lg={12} className="text-center py-5">
                <div className="spinner-border text-theme" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </Col>
            ) : latestNews.length === 0 ? (
              <Col lg={12} className="text-center py-5">
                <p>{t('home.news.noNews')}</p>
              </Col>
            ) : (
              <>
                {/* Featured News - Large Card on Left */}
                <Col lg={8} className="mb-4">
                  <div className="featured-news-large">
                    <Link href={`/blog/${latestNews[0].slug}`} className="text-decoration-none">
                      <div className="featured-news-card-large position-relative">
                        <OptimizedImage
                          src={latestNews[0].image_url || "/images/blog/01.jpg"}
                          alt={latestNews[0].title}
                          context="Tin tức nổi bật"
                          className="featured-news-bg"
                        />
                        <div className="featured-news-overlay">
                          <div className="featured-news-content">
                            <h2 className="featured-news-title text-white">
                              {latestNews[0].title}
                            </h2>
                            <div className="featured-news-meta d-flex align-items-center text-white mt-3">
                              <i className="bi bi-person-fill me-2"></i>
                              <span className="me-3">viencongnghe</span>
                              <i className="bi bi-calendar3 me-2"></i>
                              <span>
                                {latestNews[0].created_at ? formatDate(latestNews[0].created_at) : '29/08/25'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </Col>

                {/* Smaller News Cards - Right Side */}
                <Col lg={4}>
                  <div className="news-sidebar">
                    {latestNews.slice(1, 3).map((news, index) => (
                      <div key={news.id} className="news-card-small mb-4">
                        <Link href={`/blog/${news.slug}`} className="text-decoration-none">
                          <div className="news-card-small-inner position-relative">
                            <OptimizedImage
                              src={news.image_url || "/images/blog/01.jpg"}
                              alt={news.title}
                              context="Tin tức"
                              className="news-card-small-bg"
                            />
                            <div className="news-card-small-overlay">
                              <div className="news-tag">
                                <span className="badge bg-warning text-dark">
                                  {language === 'vi' ? 'Tin tức chung' : 'General News'}
                                </span>
                              </div>
                              <div className="news-card-small-content">
                                <h5 className="news-card-small-title text-white">
                                  {truncateText(news.title, 80)}
                                </h5>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </Col>
              </>
            )}
          </Row>

          {/* Activity News Section */}
          <Row className="mt-5">
            <Col lg={12}>
              <div className="activity-news-section">
                <div className="activity-header-container">
                <div className="activity-header">
                  <h3 className="activity-header-title">
                    {language === 'vi' ? 'TIN HOẠT ĐỘNG' : 'ACTIVITY NEWS'}
                  </h3>
                </div>
                </div>              
                <div className="activity-slider-container position-relative">
                  <div className="activity-slider" id="activitySlider">
                    <div className="activity-track" id="activityTrack">
                      {/* Slide 1 */}
                      <div className="activity-slide active">
                        <div className="activity-cards-wrapper">
                          {latestNews.length > 0 ? (
                            latestNews.slice(0, 4).map((news, index) => (
                              <div key={`activity-${news.id}`} className="activity-card">
                                <Link href={`/blog/${news.slug}`} className="activity-card-link">
                                  <div className="activity-card-image">
                                    <OptimizedImage
                                      src={news.image_url || "/images/blog/01.jpg"}
                                      alt={news.title}
                                      context="Tin hoạt động"
                                      className="activity-img"
                                    />
                                  </div>
                                  <div className="activity-card-content">
                                    <h4 className="activity-card-title">
                                      {truncateText(news.title, 60)}
                                    </h4>
                                    <div className="activity-card-meta">
                                      <span className="activity-card-author">
                                        <i className="bi bi-person me-1"></i>
                                        viencongnghe
                                      </span>
                                      <span className="activity-card-date">
                                        <i className="bi bi-calendar3 me-1"></i>
                                        {news.created_at ?
                                          new Date(news.created_at).toLocaleDateString('vi-VN', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: '2-digit'
                                          }) : '11/04/25'
                                        }
                                      </span>
                                    </div>
                                  </div>
                                </Link>
                              </div>
                            ))
                          ) : (
                            <>
                              <div className="activity-card">
                                <Link href="/blog/bao-gia-may-trang-phuc-nhan-vien-2025" className="activity-card-link">
                                  <div className="activity-card-image">
                                    <OptimizedImage
                                      src="/images/blog/01.jpg"
                                      alt="Báo giá may trang phục nhân viên năm 2025"
                                      context="Tin hoạt động"
                                      className="activity-img"
                                    />
                                  </div>
                                  <div className="activity-card-content">
                                    <h4 className="activity-card-title">
                                      Báo giá may trang phục nhân viên năm 2025
                                    </h4>
                                    <div className="activity-card-meta">
                                      <span className="activity-card-author">
                                        <i className="bi bi-person me-1"></i>
                                        viencongnghe
                                      </span>
                                      <span className="activity-card-date">
                                        <i className="bi bi-calendar3 me-1"></i>
                                        11/04/25
                                      </span>
                                    </div>
                                  </div>
                                </Link>
                              </div>
                              <div className="activity-card">
                                <Link href="/blog/hoat-dong-huong-toi-ky-niem-80-nam" className="activity-card-link">
                                  <div className="activity-card-image">
                                    <OptimizedImage
                                      src="/images/blog/02.jpg"
                                      alt="Hoạt động hướng tới kỷ niệm 80 năm"
                                      context="Tin hoạt động"
                                      className="activity-img"
                                    />
                                  </div>
                                  <div className="activity-card-content">
                                    <h4 className="activity-card-title">
                                      Hoạt động hướng tới kỷ niệm 80 năm ngày thành lập Quân đội nhân dân Việt Nam
                                    </h4>
                                    <div className="activity-card-meta">
                                      <span className="activity-card-author">
                                        <i className="bi bi-person me-1"></i>
                                        viencongnghe
                                      </span>
                                      <span className="activity-card-date">
                                        <i className="bi bi-calendar3 me-1"></i>
                                        20/12/24
                                      </span>
                                    </div>
                                  </div>
                                </Link>
                              </div>
                              <div className="activity-card">
                                <Link href="/blog/vien-cong-nghe-trao-kinh-phi" className="activity-card-link">
                                  <div className="activity-card-image">
                                    <OptimizedImage
                                      src="/images/blog/03.jpg"
                                      alt="Viện công nghệ trao kinh phí hỗ trợ bão Yagi"
                                      context="Tin hoạt động"
                                      className="activity-img"
                                    />
                                  </div>
                                  <div className="activity-card-content">
                                    <h4 className="activity-card-title">
                                      Viện công nghệ trao kinh phí hỗ trợ bão Yagi
                                    </h4>
                                    <div className="activity-card-meta">
                                      <span className="activity-card-author">
                                        <i className="bi bi-person me-1"></i>
                                        viencongnghe
                                      </span>
                                      <span className="activity-card-date">
                                        <i className="bi bi-calendar3 me-1"></i>
                                        23/09/24
                                      </span>
                                    </div>
                                  </div>
                                </Link>
                              </div>
                              <div className="activity-card">
                                <Link href="/blog/trien-lam-quoc-te-vimexpo-2022" className="activity-card-link">
                                  <div className="activity-card-image">
                                    <OptimizedImage
                                      src="/images/blog/04.jpg"
                                      alt="Triển lãm Quốc tế về công nghiệp hỗ trợ VIMEXPO 2022"
                                      context="Tin hoạt động"
                                      className="activity-img"
                                    />
                                  </div>
                                  <div className="activity-card-content">
                                    <h4 className="activity-card-title">
                                      Triển lãm Quốc tế về công nghiệp hỗ trợ VIMEXPO 2022
                                    </h4>
                                    <div className="activity-card-meta">
                                      <span className="activity-card-author">
                                        <i className="bi bi-person me-1"></i>
                                        viencongnghe
                                      </span>
                                      <span className="activity-card-date">
                                        <i className="bi bi-calendar3 me-1"></i>
                                        21/11/22
                                      </span>
                                    </div>
                                  </div>
                                </Link>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Slide 2 - Example second slide */}
                      <div className="activity-slide">
                        <div className="activity-cards-wrapper">
                          <div className="activity-card">
                            <Link href="/blog/sample-news-5" className="activity-card-link">
                              <div className="activity-card-image">
                                <OptimizedImage
                                  src="/images/blog/05.jpg"
                                  alt="Sample news 5"
                                  context="Tin hoạt động"
                                  className="activity-img"
                                />
                              </div>
                              <div className="activity-card-content">
                                <h4 className="activity-card-title">
                                  Hội thảo khoa học công nghệ năm 2024
                                </h4>
                                <div className="activity-card-meta">
                                  <span className="activity-card-author">
                                    <i className="bi bi-person me-1"></i>
                                    viencongnghe
                                  </span>
                                  <span className="activity-card-date">
                                    <i className="bi bi-calendar3 me-1"></i>
                                    15/08/24
                                  </span>
                                </div>
                              </div>
                            </Link>
                          </div>
                          <div className="activity-card">
                            <Link href="/blog/sample-news-6" className="activity-card-link">
                              <div className="activity-card-image">
                                <OptimizedImage
                                  src="/images/blog/06.jpg"
                                  alt="Sample news 6"
                                  context="Tin hoạt động"
                                  className="activity-img"
                                />
                              </div>
                              <div className="activity-card-content">
                                <h4 className="activity-card-title">
                                  Chương trình đào tạo chuyên sâu
                                </h4>
                                <div className="activity-card-meta">
                                  <span className="activity-card-author">
                                    <i className="bi bi-person me-1"></i>
                                    viencongnghe
                                  </span>
                                  <span className="activity-card-date">
                                    <i className="bi bi-calendar3 me-1"></i>
                                    10/07/24
                                  </span>
                                </div>
                              </div>
                            </Link>
                          </div>
                          <div className="activity-card">
                            <Link href="/blog/sample-news-7" className="activity-card-link">
                              <div className="activity-card-image">
                                <OptimizedImage
                                  src="/images/blog/07.jpg"
                                  alt="Sample news 7"
                                  context="Tin hoạt động"
                                  className="activity-img"
                                />
                              </div>
                              <div className="activity-card-content">
                                <h4 className="activity-card-title">
                                  Hợp tác quốc tế trong nghiên cứu
                                </h4>
                                <div className="activity-card-meta">
                                  <span className="activity-card-author">
                                    <i className="bi bi-person me-1"></i>
                                    viencongnghe
                                  </span>
                                  <span className="activity-card-date">
                                    <i className="bi bi-calendar3 me-1"></i>
                                    05/06/24
                                  </span>
                                </div>
                              </div>
                            </Link>
                          </div>
                          <div className="activity-card">
                            <Link href="/blog/sample-news-8" className="activity-card-link">
                              <div className="activity-card-image">
                                <OptimizedImage
                                  src="/images/blog/08.jpg"
                                  alt="Sample news 8"
                                  context="Tin hoạt động"
                                  className="activity-img"
                                />
                              </div>
                              <div className="activity-card-content">
                                <h4 className="activity-card-title">
                                  Giải thưởng sáng tạo khoa học 2024
                                </h4>
                                <div className="activity-card-meta">
                                  <span className="activity-card-author">
                                    <i className="bi bi-person me-1"></i>
                                    viencongnghe
                                  </span>
                                  <span className="activity-card-date">
                                    <i className="bi bi-calendar3 me-1"></i>
                                    20/05/24
                                  </span>
                                </div>
                              </div>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Slider Navigation */}
                  <div className="activity-slider-nav">
                    <button className="news-nav-btn news-prev-btn" onClick={() => {
                      const track = document.getElementById('activityTrack');
                      const slides = track?.querySelectorAll('.activity-slide');
                      const activeSlide = track?.querySelector('.activity-slide.active');
                      if (slides && activeSlide) {
                        const activeIndex = Array.from(slides).indexOf(activeSlide as Element);
                        const prevIndex = activeIndex === 0 ? slides.length - 1 : activeIndex - 1;

                        activeSlide.classList.remove('active');
                        slides[prevIndex]?.classList.add('active');

                        // Update indicators
                        const indicators = document.querySelectorAll('.activity-indicator');
                        indicators.forEach(indicator => indicator.classList.remove('active'));
                        indicators[prevIndex]?.classList.add('active');
                      }
                    }}>
                      <i className="bi bi-chevron-left"></i>
                    </button>
                    <button className="news-nav-btn news-next-btn" onClick={() => {
                      const track = document.getElementById('activityTrack');
                      const slides = track?.querySelectorAll('.activity-slide');
                      const activeSlide = track?.querySelector('.activity-slide.active');
                      if (slides && activeSlide) {
                        const activeIndex = Array.from(slides).indexOf(activeSlide as Element);
                        const nextIndex = activeIndex === slides.length - 1 ? 0 : activeIndex + 1;

                        activeSlide.classList.remove('active');
                        slides[nextIndex]?.classList.add('active');

                        // Update indicators
                        const indicators = document.querySelectorAll('.activity-indicator');
                        indicators.forEach(indicator => indicator.classList.remove('active'));
                        indicators[nextIndex]?.classList.add('active');
                      }
                    }}>
                      <i className="bi bi-chevron-right"></i>
                    </button>
                  </div>

                  {/* Slider Indicators */}
                  <div className="activity-slider-indicators">
                    <button className="activity-indicator active" onClick={() => {
                      const track = document.getElementById('activityTrack');
                      const slides = track?.querySelectorAll('.activity-slide');
                      const indicators = document.querySelectorAll('.activity-indicator');

                      slides?.forEach(slide => slide.classList.remove('active'));
                      indicators.forEach(indicator => indicator.classList.remove('active'));

                      slides?.[0]?.classList.add('active');
                      indicators[0]?.classList.add('active');
                    }}></button>
                    <button className="activity-indicator" onClick={() => {
                      const track = document.getElementById('activityTrack');
                      const slides = track?.querySelectorAll('.activity-slide');
                      const indicators = document.querySelectorAll('.activity-indicator');

                      slides?.forEach(slide => slide.classList.remove('active'));
                      indicators.forEach(indicator => indicator.classList.remove('active'));

                      slides?.[1]?.classList.add('active');
                      indicators[1]?.classList.add('active');
                    }}></button>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          {/* Three Categories Section */}
          <Row className="mt-5">
            {/* Science & Technology News */}
            <Col lg={4} className="mb-4">
              <div className="news-category-section">
                <div className="category-header-simple category-blue-container mb-3">
                  <h4 className="category-title-simple category-blue">
                    {language === 'vi' ? 'TIN KHOA HỌC CÔNG NGHỆ' : 'SCIENCE & TECHNOLOGY NEWS'}
                  </h4>
                </div>
                <div className="category-list">
                  <ul className="simple-bullet-list">
                    <li>
                      <Link href="/blog/ky-hieu-mac-thep-theo-tieu-chuan-nhat-ban" className="simple-link">
                        {language === 'vi'
                          ? 'Giới thiệu kí hiệu mác thép theo tiêu chuẩn Nhật Bản'
                          : 'Introduction to Japanese Steel Grade Standards'
                        }
                      </Link>
                    </li>
                    <li>
                      <Link href="/blog/tieu-chuan-thu-keo-viet-nam" className="simple-link">
                        {language === 'vi'
                          ? 'Tiêu chuẩn thử kéo Việt Nam'
                          : 'Vietnam Tensile Testing Standards'
                        }
                      </Link>
                    </li>
                    <li>
                      <Link href="/blog/san-pham-tieu-bieu-vien-cong-nghe" className="simple-link">
                        {language === 'vi'
                          ? 'Sản phẩm tiêu biểu Viện Công Nghệ'
                          : 'Typical Products of Technology Institute'
                        }
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </Col>

            {/* Training Activities */}
            <Col lg={4} className="mb-4">
              <div className="news-category-section">
                <div className="category-header-simple category-orange-container mb-3">
                  <h4 className="category-title-simple category-orange">
                    {language === 'vi' ? 'HOẠT ĐỘNG ĐÀO TẠO' : 'TRAINING ACTIVITIES'}
                  </h4>
                </div>
                <div className="category-list">
                  <ul className="simple-bullet-list">
                    <li>
                      <Link href="/blog/chuong-trinh-huan-luyen-pccc-cnch-co-so-ii" className="simple-link">
                        {language === 'vi'
                          ? 'Chương trình huấn luyện nghiệp vụ thực tập phương án PCCC & CNCH tại Cơ sở II – Lô 27B, Khu CN Quang Minh, Mê Linh, Hà Nội.'
                          : 'Fire Safety & Emergency Training Program at Facility II – Lot 27B, Quang Minh Industrial Zone, Me Linh, Hanoi'
                        }
                      </Link>
                    </li>
                    <li>
                      <Link href="/blog/huan-luyen-pccc-chcn-doi-pccc-vien-2022" className="simple-link">
                        {language === 'vi'
                          ? 'Huấn luyện Nghiệp vụ thực tập phương án PCCC&CHCN cho đội PCCC của viện năm 2022 tại toà nhà 25 Vũ Ngọc Phan'
                          : 'Fire Safety Training for Institute Fire Team 2022 at 25 Vu Ngoc Phan Building'
                        }
                      </Link>
                    </li>
                    <li>
                      <Link href="/blog/chuong-trinh-huan-luyen-an-toan-ve-sinh-lao-dong-2022" className="simple-link">
                        {language === 'vi'
                          ? 'Chương trình huấn luyện an toàn vệ sinh lao động năm 2022'
                          : 'Occupational Health and Safety Training Program 2022'
                        }
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </Col>

            {/* Professional Articles */}
            <Col lg={4} className="mb-4">
              <div className="news-category-section">
                <div className="category-header-simple category-green-container mb-3">
                  <h4 className="category-title-simple category-green">
                    {language === 'vi' ? 'BÀI VIẾT CHUYÊN MÔN' : 'PROFESSIONAL ARTICLES'}
                  </h4>
                </div>
                <div className="category-list">
                  <ul className="simple-bullet-list">
                    <li>
                      <Link href="/blog/chuyen-ke-ve-kim-loai-quyen-1" className="simple-link">
                        {language === 'vi'
                          ? 'Chuyện kể về Kim Loại Quyển 1'
                          : 'Stories about Metals Volume 1'
                        }
                      </Link>
                    </li>
                    <li>
                      <Link href="/blog/chuyen-ke-ve-kim-loai-quyen-2" className="simple-link">
                        {language === 'vi'
                          ? 'Chuyện kể về Kim Loại Quyển 2'
                          : 'Stories about Metals Volume 2'
                        }
                      </Link>
                    </li>
                    <li>
                      <Link href="/blog/ky-hieu-mac-thep-theo-tieu-chuan-nhat-ban" className="simple-link">
                        {language === 'vi'
                          ? 'Giới thiệu kí hiệu mác thép theo tiêu chuẩn Nhật Bản'
                          : 'Introduction to Japanese Steel Grade Standards'
                        }
                      </Link>
                    </li>
                    <li>
                      <Link href="/blog/tieu-chuan-thu-keo-viet-nam" className="simple-link">
                        {language === 'vi'
                          ? 'Tiêu chuẩn thử kéo Việt Nam'
                          : 'Vietnam Tensile Testing Standards'
                        }
                      </Link>
                    </li>
                    <li>
                      <Link href="/blog/thiet-ke-lap-dat-chuyen-giao-nhiet-luyen" className="simple-link">
                        {language === 'vi'
                          ? 'Thiết kế, lắp đặt và chuyển giao trong lĩnh vực nhiệt luyện'
                          : 'Design, Installation and Transfer in Heat Treatment Field'
                        }
                      </Link>
                    </li>
                    <li>
                      <Link href="/blog/anh-san-pham-duc-noi-bat-co-khi-me-linh" className="simple-link">
                        {language === 'vi'
                          ? 'Ảnh sản phẩm đúc nổi bật của cơ khí Mê Linh'
                          : 'Outstanding Casting Products from Me Linh Mechanics'
                        }
                      </Link>
                    </li>
                    <li>
                      <Link href="/blog/nguyen-ly-toi-phan-cap-lo-chan-khong" className="simple-link">
                        {language === 'vi'
                          ? 'Nguyên lý tôi phân cấp, tôi phân cấp trong lò chân không đơn buồng'
                          : 'Principle of Vacuum Furnace Gradient Hardening'
                        }
                      </Link>
                    </li>
                    <li>
                      <Link href="/blog/khao-sat-phan-tich-anh-huong-thong-so" className="simple-link">
                        {language === 'vi'
                          ? 'Khảo sát/phân tích ảnh hưởng của một số thông số công nghệ đến đặc tính lớp thấm N plasma thép SKD61 trên thiết bị NITRION'
                          : 'Survey/Analysis of Technology Parameter Effects on N Plasma Penetration Layer Characteristics of SKD61 Steel on NITRION Equipment'
                        }
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Activity Images Section */}
      <section className="activity-images-section py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col lg={12}>
              <p className="section-subtitle text-uppercase mb-2">
                {language === 'vi' ? 'MEDIA' : 'MEDIA'}
              </p>
              <h2 className="section-main-title mb-4">
                {language === 'vi' ? 'HÌNH ẢNH HOẠT ĐỘNG' : 'ACTIVITY IMAGES'}
              </h2>
            </Col>
          </Row>

          {/* Activity Images Slider */}
          <div className="activity-slider-wrapper position-relative">
            <div className="activity-slider" id="activityImagesSlider">
              <div className="activity-slide active">
                <Row className="activity-images-row h-100">
                  <Col lg={4} md={4} className="activity-image-item">
                    <div className="activity-gallery-item h-100">
                      <OptimizedImage
                        src="/images/activities/event-outdoor.jpg"
                        alt={language === 'vi' ? 'Sự kiện ngoài trời của viện' : 'Institute Outdoor Event'}
                        context="Hình ảnh hoạt động"
                        className="activity-gallery-img"
                      />
                    </div>
                  </Col>
                  <Col lg={4} md={4} className="activity-image-item">
                    <div className="activity-gallery-item h-100">
                      <OptimizedImage
                        src="/images/activities/official-ceremony.jpg"
                        alt={language === 'vi' ? 'Lễ công bố quyết định của viện' : 'Official Announcement Ceremony'}
                        context="Hình ảnh hoạt động"
                        className="activity-gallery-img"
                      />
                    </div>
                  </Col>
                  <Col lg={4} md={4} className="activity-image-item">
                    <div className="activity-gallery-item h-100">
                      <OptimizedImage
                        src="/images/activities/training-session.jpg"
                        alt={language === 'vi' ? 'Buổi đào tạo và hội thảo' : 'Training and Workshop Session'}
                        context="Hình ảnh hoạt động"
                        className="activity-gallery-img"
                      />
                    </div>
                  </Col>
                </Row>
              </div>

              <div className="activity-slide">
                <Row className="activity-images-row h-100">
                  <Col lg={4} md={4} className="activity-image-item">
                    <div className="activity-gallery-item h-100">
                      <OptimizedImage
                        src="/images/activities/conference.jpg"
                        alt={language === 'vi' ? 'Hội nghị khoa học' : 'Scientific Conference'}
                        context="Hình ảnh hoạt động"
                        className="activity-gallery-img"
                      />
                    </div>
                  </Col>
                  <Col lg={4} md={4} className="activity-image-item">
                    <div className="activity-gallery-item h-100">
                      <OptimizedImage
                        src="/images/activities/laboratory.jpg"
                        alt={language === 'vi' ? 'Hoạt động phòng thí nghiệm' : 'Laboratory Activities'}
                        context="Hình ảnh hoạt động"
                        className="activity-gallery-img"
                      />
                    </div>
                  </Col>
                  <Col lg={4} md={4} className="activity-image-item">
                    <div className="activity-gallery-item h-100">
                      <OptimizedImage
                        src="/images/activities/workshop.jpg"
                        alt={language === 'vi' ? 'Hội thảo chuyên môn' : 'Professional Workshop'}
                        context="Hình ảnh hoạt động"
                        className="activity-gallery-img"
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              className="activity-nav-btn activity-prev"
              onClick={() => {
                const slider = document.getElementById('activityImagesSlider');
                const slides = slider?.querySelectorAll('.activity-slide');
                const activeSlide = slider?.querySelector('.activity-slide.active');
                if (slides && activeSlide) {
                  const currentIndex = Array.from(slides).indexOf(activeSlide);
                  const prevIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
                  activeSlide.classList.remove('active');
                  slides[prevIndex].classList.add('active');
                }
              }}
            >
              <i className="bi bi-chevron-left"></i>
            </button>
            <button
              className="activity-nav-btn activity-next"
              onClick={() => {
                const slider = document.getElementById('activityImagesSlider');
                const slides = slider?.querySelectorAll('.activity-slide');
                const activeSlide = slider?.querySelector('.activity-slide.active');
                if (slides && activeSlide) {
                  const currentIndex = Array.from(slides).indexOf(activeSlide);
                  const nextIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
                  activeSlide.classList.remove('active');
                  slides[nextIndex].classList.add('active');
                }
              }}
            >
              <i className="bi bi-chevron-right"></i>
            </button>

            {/* Indicators */}
            <div className="activity-slider-indicators">
              <button
                className="activity-indicator active"
                onClick={() => {
                  const slider = document.getElementById('activityImagesSlider');
                  const slides = slider?.querySelectorAll('.activity-slide');
                  const indicators = document.querySelectorAll('.activity-indicator');
                  slides?.forEach(slide => slide.classList.remove('active'));
                  indicators.forEach(indicator => indicator.classList.remove('active'));
                  slides?.[0]?.classList.add('active');
                  indicators[0]?.classList.add('active');
                }}
              ></button>
              <button
                className="activity-indicator"
                onClick={() => {
                  const slider = document.getElementById('activityImagesSlider');
                  const slides = slider?.querySelectorAll('.activity-slide');
                  const indicators = document.querySelectorAll('.activity-indicator');
                  slides?.forEach(slide => slide.classList.remove('active'));
                  indicators.forEach(indicator => indicator.classList.remove('active'));
                  slides?.[1]?.classList.add('active');
                  indicators[1]?.classList.add('active');
                }}
              ></button>
            </div>
          </div>
        </Container>
      </section>

      {/* Products & Services Section */}
      <section className="products-services-section" style={{ backgroundImage: 'url(/images/bg-left-bottom.webp)', backgroundPosition: 'left bottom', backgroundRepeat: 'no-repeat', width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: 'calc(50vw - 50%)', paddingRight: 'calc(50vw - 50%)', paddingTop: '30px', paddingBottom: '30px' }}>
        <Container>
          <Row className="text-center mb-5">
            <Col lg={12}>
              <p className="section-subtitle text-uppercase mb-2">
                {language === 'vi' ? 'PRODUCTS & SERVICES' : 'PRODUCTS & SERVICES'}
              </p>
              <h2 className="section-main-title mb-4">
                {language === 'vi' ? 'SẢN PHẨM & DỊCH VỤ' : 'PRODUCTS & SERVICES'}
              </h2>
            </Col>
          </Row>

          <Row>
            <Col lg={12}>
              <div className="products-slider-wrapper position-relative">
                <div className="products-slider" id="productsSlider">
                  <div className="products-track" id="productsTrack">
                    {productsLoading ? (
                      // Loading slide
                      <div className="product-slide active">
                        <div className="row">
                          {Array.from({ length: 4 }).map((_, index) => (
                            <div className="col-lg-3 col-md-6 mb-4" key={`loading-${index}`}>
                              <div className="product-card">
                                <div className="product-image">
                                  <div className="placeholder-img bg-light d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
                                    <div className="spinner-border text-primary" role="status">
                                      <span className="visually-hidden">Loading...</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="product-content">
                                  <div className="product-category">
                                    <span className="category-tag placeholder-glow">
                                      <span className="placeholder col-8"></span>
                                    </span>
                                  </div>
                                  <h4 className="product-title placeholder-glow">
                                    <span className="placeholder col-12"></span>
                                    <span className="placeholder col-8"></span>
                                  </h4>
                                  <p className="product-description placeholder-glow">
                                    <span className="placeholder col-12"></span>
                                    <span className="placeholder col-12"></span>
                                    <span className="placeholder col-6"></span>
                                  </p>
                                  <div className="placeholder-glow">
                                    <span className="placeholder btn btn-primary col-6"></span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : products.length > 0 ? (
                      // Render product slides from API
                      (() => {
                        const slides = [];
                        for (let i = 0; i < products.length; i += 4) {
                          const slideProducts = products.slice(i, i + 4);
                          slides.push(
                            <div className={`product-slide ${i === 0 ? 'active' : ''}`} key={`slide-${i}`}>
                              <div className="row">
                                {slideProducts.map((product) => (
                                  <div className="col-lg-3 col-md-6 mb-4" key={product.id}>
                                    <div className="product-card">
                                      <div className="product-image">
                                        <OptimizedImage
                                          src={product.primary_image || '/images/products/default-product.jpg'}
                                          alt={product.name}
                                          context={`Sản phẩm - ${product.name}`}
                                          className="product-img"
                                        />
                                      </div>
                                      <div className="product-content">
                                        <div className="product-category">
                                          <span className="category-tag">
                                            {product.brand || (language === 'vi' ? 'Khoa học công nghệ' : 'Science & Technology')}
                                          </span>
                                        </div>
                                        <h4 className="product-title">
                                          {product.name}
                                        </h4>
                                        <p className="product-description">
                                          {product.description || product.specifications || (language === 'vi' ? 'Mô tả sản phẩm đang được cập nhật...' : 'Product description coming soon...')}
                                        </p>
                                        <Link href={`/products/${product.slug}`} className="product-btn">
                                          {language === 'vi' ? 'Xem chi tiết' : 'View Details'}
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        return slides;
                      })()
                    ) : (
                      // No products fallback slide
                      <div className="product-slide active">
                        <div className="row">
                          <div className="col-lg-12 text-center py-5">
                            <div className="no-products-message">
                              <h5 className="text-muted mb-3">
                                {language === 'vi' ? 'Hiện tại chưa có sản phẩm nào' : 'No products available'}
                              </h5>
                              <p className="text-muted">
                                {language === 'vi' ? 'Vui lòng quay lại sau để xem các sản phẩm mới nhất' : 'Please check back later for the latest products'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Slider Navigation - only show if we have products and more than 4 products */}
                {!productsLoading && products.length > 4 && (
                  <div className="products-slider-nav">
                    <button className="products-nav-btn products-prev-btn" onClick={() => {
                      const track = document.getElementById('productsTrack');
                      const slides = track?.querySelectorAll('.product-slide');
                      const activeSlide = track?.querySelector('.product-slide.active');
                      if (slides && activeSlide) {
                        const activeIndex = Array.from(slides).indexOf(activeSlide as Element);
                        const prevIndex = activeIndex === 0 ? slides.length - 1 : activeIndex - 1;

                        activeSlide.classList.remove('active');
                        slides[prevIndex]?.classList.add('active');

                        // Update indicators
                        const indicators = document.querySelectorAll('.products-indicator');
                        indicators.forEach(indicator => indicator.classList.remove('active'));
                        indicators[prevIndex]?.classList.add('active');
                      }
                    }}>
                      <i className="bi bi-chevron-left"></i>
                    </button>
                    <button className="products-nav-btn products-next-btn" onClick={() => {
                      const track = document.getElementById('productsTrack');
                      const slides = track?.querySelectorAll('.product-slide');
                      const activeSlide = track?.querySelector('.product-slide.active');
                      if (slides && activeSlide) {
                        const activeIndex = Array.from(slides).indexOf(activeSlide as Element);
                        const nextIndex = activeIndex === slides.length - 1 ? 0 : activeIndex + 1;

                        activeSlide.classList.remove('active');
                        slides[nextIndex]?.classList.add('active');

                        // Update indicators
                        const indicators = document.querySelectorAll('.products-indicator');
                        indicators.forEach(indicator => indicator.classList.remove('active'));
                        indicators[nextIndex]?.classList.add('active');
                      }
                    }}>
                      <i className="bi bi-chevron-right"></i>
                    </button>
                  </div>
                )}

                {/* Slider Indicators - only show if we have products and more than 4 products */}
                {!productsLoading && products.length > 4 && (
                  <div className="products-slider-indicators">
                    {Array.from({ length: Math.ceil(products.length / 4) }).map((_, index) => (
                      <button
                        key={index}
                        className={`products-indicator ${index === 0 ? 'active' : ''}`}
                        onClick={() => {
                          const track = document.getElementById('productsTrack');
                          const slides = track?.querySelectorAll('.product-slide');
                          const indicators = document.querySelectorAll('.products-indicator');

                          slides?.forEach(slide => slide.classList.remove('active'));
                          indicators.forEach(indicator => indicator.classList.remove('active'));

                          slides?.[index]?.classList.add('active');
                          indicators[index]?.classList.add('active');
                        }}
                      ></button>
                    ))}
                  </div>
                )}
              </div>
            </Col>
          </Row>

          {/* View All Products Button */}
          <Row className="text-center mt-4">
            <Col lg={12}>
              <Link href="/products" className="view-all-products-btn">
                {language === 'vi' ? 'Xem tất cả sản phẩm, dịch vụ' : 'View All Products & Services'}
                <i className="bi bi-arrow-right ms-2"></i>
              </Link>
            </Col>
          </Row>
        </Container>
      </section>

      {/*   */}
      <section className="partners-section" style={{ paddingTop: '30px', paddingBottom: '30px', backgroundImage: 'url(/images/Group-1660.webp)', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: 'calc(50vw - 50%)', paddingRight: 'calc(50vw - 50%)' }}>
        <Container>
          <Row className="text-center mb-5">
            <Col lg={12}>
              <p className="section-subtitle text-uppercase mb-2">
                {language === 'vi' ? 'CUSTOMERS & PARTNERS' : 'CUSTOMERS & PARTNERS'}
              </p>
              <h2 className="section-main-title mb-4">
                {language === 'vi' ? 'KHÁCH HÀNG & ĐỐI TÁC' : 'CUSTOMERS & PARTNERS'}
              </h2>
            </Col>
          </Row>

          {/* Gap spacing like original website */}
          <div style={{ paddingTop: '30px' }}></div>

          <Row>
            <Col lg={12}>
              <div className="partners-slider-wrapper position-relative">
                <div className="partners-slider" id="partnersSlider">
                  <div className="partners-track" id="partnersTrack">
                    {partnersLoading ? (
                      // Loading slide
                      <div className="partner-slide active">
                        <div className="partner-item">
                          <div className="placeholder-img bg-light d-flex align-items-center justify-content-center" style={{ height: '100px', width: '150px' }}>
                            <div className="spinner-border text-primary" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                          </div>
                        </div>
                        {Array.from({ length: 5 }).map((_, index) => (
                          <div className="partner-item" key={`loading-${index}`}>
                            <div className="placeholder-img bg-light" style={{ height: '100px', width: '150px', borderRadius: '8px' }}></div>
                          </div>
                        ))}
                      </div>
                    ) : partners.length > 0 ? (
                      // Render partner slides from API
                      (() => {
                        const slides = [];
                        const partnersPerSlide = 6; // Desktop: 6 logos per slide
                        for (let i = 0; i < partners.length; i += partnersPerSlide) {
                          const slidePartners = partners.slice(i, i + partnersPerSlide);
                          slides.push(
                            <div className={`partner-slide ${i === 0 ? 'active' : ''}`} key={`slide-${i}`}>
                              {slidePartners.map((partner) => (
                                <div className="partner-item" key={partner.id}>
                                  <OptimizedImage
                                    src={partner.logo}
                                    alt={partner.name}
                                    context={`Đối tác - ${partner.name}`}
                                    className="partner-logo"
                                  />
                                </div>
                              ))}
                            </div>
                          );
                        }
                        return slides;
                      })()
                    ) : (
                      // Fallback to default partners if API fails
                      <>
                        <div className="partner-slide active">
                          <div className="partner-item">
                            <OptimizedImage
                              src="/images/partners/disoco-logo.png"
                              alt="DISOCO"
                              context="Đối tác - DISOCO"
                              className="partner-logo"
                            />
                          </div>
                          <div className="partner-item">
                            <OptimizedImage
                              src="/images/partners/futur-logo.png"
                              alt="FUTUR"
                              context="Đối tác - FUTUR"
                              className="partner-logo"
                            />
                          </div>
                          <div className="partner-item">
                            <OptimizedImage
                              src="/images/partners/fteme-logo.png"
                              alt="FTEME"
                              context="Đối tác - FTEME"
                              className="partner-logo"
                            />
                          </div>
                          <div className="partner-item">
                            <OptimizedImage
                              src="/images/partners/t4-logo.png"
                              alt="T4 NHÂN TM CỤA BAN"
                              context="Đối tác - T4"
                              className="partner-logo"
                            />
                          </div>
                          <div className="partner-item">
                            <OptimizedImage
                              src="/images/partners/daido-steel-logo.png"
                              alt="DAIDO STEEL"
                              context="Đối tác - DAIDO STEEL"
                              className="partner-logo"
                            />
                          </div>
                          <div className="partner-item">
                            <OptimizedImage
                              src="/images/partners/fomeco-logo.png"
                              alt="FOMECO"
                              context="Đối tác - FOMECO"
                              className="partner-logo"
                            />
                          </div>
                        </div>
                        <div className="partner-slide">
                          <div className="partner-item">
                            <OptimizedImage
                              src="/images/partners/yamaha-logo.png"
                              alt="Yamaha"
                              context="Đối tác - Yamaha"
                              className="partner-logo"
                            />
                          </div>
                          <div className="partner-item">
                            <OptimizedImage
                              src="/images/partners/vdi-logo.png"
                              alt="VDI"
                              context="Đối tác - VDI"
                              className="partner-logo"
                            />
                          </div>
                          <div className="partner-item">
                            <OptimizedImage
                              src="/images/partners/seiki-logo.png"
                              alt="Seiki"
                              context="Đối tác - Seiki"
                              className="partner-logo"
                            />
                          </div>
                          <div className="partner-item">
                            <OptimizedImage
                              src="/images/partners/astemo-logo.png"
                              alt="Astemo"
                              context="Đối tác - Astemo"
                              className="partner-logo"
                            />
                          </div>
                          <div className="partner-item">
                            <OptimizedImage
                              src="/images/partners/hal-vietnam-logo.png"
                              alt="HAL Vietnam"
                              context="Đối tác - HAL Vietnam"
                              className="partner-logo"
                            />
                          </div>
                          <div className="partner-item">
                            <OptimizedImage
                              src="/images/partners/moldtech-logo.png"
                              alt="Moldtech"
                              context="Đối tác - Moldtech"
                              className="partner-logo"
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Slider Navigation */}
                <div className="partners-slider-nav">
                  <button className="partners-nav-btn partners-prev-btn" onClick={() => {
                    const slider = document.getElementById('partnersSlider');
                    const track = document.getElementById('partnersTrack');
                    const slides = track?.querySelectorAll('.partner-slide');
                    const activeSlide = track?.querySelector('.partner-slide.active');
                    const activeIndex = Array.from(slides || []).indexOf(activeSlide as Element);
                    const prevIndex = activeIndex === 0 ? (slides?.length || 1) - 1 : activeIndex - 1;

                    activeSlide?.classList.remove('active');
                    slides?.[prevIndex]?.classList.add('active');

                    // Update indicators
                    const indicators = document.querySelectorAll('.partners-indicator');
                    indicators.forEach(indicator => indicator.classList.remove('active'));
                    indicators[prevIndex]?.classList.add('active');
                  }}>
                    <i className="bi bi-chevron-left"></i>
                  </button>

                  <button className="partners-nav-btn partners-next-btn" onClick={() => {
                    const slider = document.getElementById('partnersSlider');
                    const track = document.getElementById('partnersTrack');
                    const slides = track?.querySelectorAll('.partner-slide');
                    const activeSlide = track?.querySelector('.partner-slide.active');
                    const activeIndex = Array.from(slides || []).indexOf(activeSlide as Element);
                    const nextIndex = activeIndex === (slides?.length || 1) - 1 ? 0 : activeIndex + 1;

                    activeSlide?.classList.remove('active');
                    slides?.[nextIndex]?.classList.add('active');

                    // Update indicators
                    const indicators = document.querySelectorAll('.partners-indicator');
                    indicators.forEach(indicator => indicator.classList.remove('active'));
                    indicators[nextIndex]?.classList.add('active');
                  }}>
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </div>
              </div>
            </Col>
          </Row>

        </Container>
      </section>
      </div>
    </>
  );
}
