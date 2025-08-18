'use client';

import type { Metadata } from 'next';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useLanguage } from '@/contexts/LanguageContext';
import BannerSlider from '@/components/BannerSlider';
import OptimizedImage from '@/components/OptimizedImage';
import { fetchLatestNews, News, fetchAboutOverview, AboutOverview } from '@/utils/api';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function HomePage() {
  const { t, language } = useLanguage();
  const [latestNews, setLatestNews] = useState<News[]>([]);
  const [aboutOverview, setAboutOverview] = useState<AboutOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [aboutLoading, setAboutLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsData, aboutData] = await Promise.all([
          fetchLatestNews(language, 3),
          fetchAboutOverview(language)
        ]);
        setLatestNews(newsData);
        setAboutOverview(aboutData);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback to empty array if API fails
        setLatestNews([]);
        setAboutOverview(null);
      } finally {
        setLoading(false);
        setAboutLoading(false);
      }
    };

    fetchData();
  }, [language]);

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

  return (
    <>
      {/* Hero Section */}
      <BannerSlider slides={bannerSlides} />

      {/* About Section */}
      <section className="light-bg">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              {aboutLoading ? (
                <div className="about-img-shape" style={{ 
                  height: '400px', 
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
                              height: '400px',
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
              <div className="ps-lg-5">
                <h6 className="text-theme mb-3">{t('home.about.title')}</h6>
                <h2 className="mb-4">
                  {aboutOverview?.title || t('home.about.heading')}
                </h2>
                <p className="mb-4">
                  {aboutOverview?.description || t('home.about.description')}
                </p>
                
                {/* Video Section - Only show if videos are available */}
                {aboutOverview && aboutOverview.videos && aboutOverview.videos.length > 0 && (
                  <div className="mt-4">
                    <h6 className="text-theme mb-3">{t('home.about.videos')}</h6>
                    <h4 className="mb-4">{t('home.about.watchOurStory')}</h4>
                    <Row>
                      {aboutOverview.videos.map((video, index) => (
                        <Col lg={12} className="mb-3" key={index}>
                          <div className="video-container position-relative">
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
                            <div className="video-title mt-3">
                              <h6 className="text-center">{video.title}</h6>
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}
                
                <div className="mt-4">
                  <Link href="/about" className="themeht-btn primary-btn">
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
                <Link href="/services" className="text-theme text-decoration-none">
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
                <Link href="/services" className="text-theme text-decoration-none">
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
                <Link href="/services" className="text-theme text-decoration-none">
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
                <Link href="/services" className="text-theme text-decoration-none">
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
                <Link href="/services" className="text-theme text-decoration-none">
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
                <Link href="/services" className="text-theme text-decoration-none">
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
              latestNews.map((news, index) => (
                <Col lg={4} md={6} className="mb-4" key={news.id}>
                  <div className="card h-100">
                    <OptimizedImage 
                      src={news.image_url || "/images/blog/01.jpg"} 
                      alt={news.title}
                      context="Tin tức - Hoạt động"
                      className="card-img-top"
                    />
                    <div className="card-body">
                      <h6 className="text-muted mb-2">
                        {news.created_at ? formatDate(news.created_at) : t('common.recentlyUpdated')}
                      </h6>
                      <h3 className="h5 card-title">{news.title}</h3>
                      <p className="card-text">
                        {truncateText(news.description || '', 150)}
                      </p>
                      <Link href={`/news/${news.slug}`} className="text-theme text-decoration-none">
                        {t('home.news.readMore')} <i className="bi bi-arrow-right ms-1"></i>
                      </Link>
                    </div>
                  </div>
                </Col>
              ))
            )}
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="primary-bg text-white">
        <Container>
          <Row className="text-center">
            <Col lg={8} className="mx-auto">
              <h2 className="mb-4 text-white">{t('home.cta.title')}</h2>
              <p className="mb-4">
                {t('home.cta.description')}
              </p>
              <Link href="/contact" className="themeht-btn secondary-btn me-3">
                {t('home.cta.contactNow')}
              </Link>
              <Link href="/services" className="themeht-btn primary-btn">
                {t('home.cta.viewServices')}
              </Link>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}
