'use client';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchAboutOverview, fetchOrganization, fetchAboutHistory } from '@/utils/api';
import OptimizedImage from '@/components/OptimizedImage';
import Breadcrumb from '@/components/Breadcrumb';
import '@/assets/css/about-timeline.css';
import '@/assets/css/about-page.css';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function AboutPage() {
  const { t, language } = useLanguage();
  const [overview, setOverview] = useState<any>(null);
  const [organization, setOrganization] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [overviewData, organizationData, historyData] = await Promise.all([
          fetchAboutOverview(language, controller.signal),
          fetchOrganization(language, controller.signal),
          fetchAboutHistory(language, controller.signal)
        ]);

        if (isMounted) {
          setOverview(overviewData);
          setOrganization(organizationData);
          setHistory(historyData);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error loading about data:', err);
          setError('Failed to load data. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [language]);

  // Utility function to convert newlines to <br> tags
  const formatTextWithLineBreaks = (text: string) => {
    if (!text) return '';
    return text.replace(/\n/g, '<br />');
  };

  // Vision, Mission, Core Values data
  const visionMissionData = [
    {
      icon: 'bi-eye-fill',
      title: language === 'vi' ? 'Slogan' : 'Slogan',
      content: language === 'vi'
        ? 'Tự lực – Tự cường – Chủ động – Sáng tạo\nĐoàn kết – Nghĩa Tình – Hội nhập – Phát triển'
        : 'Self-reliance – Self-strength – Proactive – Creative\nUnity – Righteousness – Integration – Development'
    },
    {
      icon: 'bi-bullseye',
      title: language === 'vi' ? 'Năng lực cốt lõi' : 'Core Competencies',
      content: language === 'vi'
        ? '• Công nghệ cơ khí chính xác và điều khiển tự động\n• Công nghệ vật liệu và luyện kim tiên tiến\n• Điện tử - điều khiển và công nghệ thông tin\n• Thiết kế và chế tạo thiết bị công nghiệp\n• Đo lường, kiểm định và tiêu chuẩn hóa\n• Công nghệ hóa chất và xử lý môi trường'
        : '• Precision mechanical technology and automation\n• Advanced materials and metallurgy technology\n• Electronics - control and information technology\n• Design and manufacturing of industrial equipment\n• Measurement, testing and standardization\n• Chemical technology and environmental treatment'
    },
    {
      icon: 'bi-heart-fill',
      title: language === 'vi' ? 'Hướng phát triển' : 'Development Direction',
      content: language === 'vi'
        ? 'Mở rộng các mối quan hệ và dịch vụ khoa học công nghệ, nghiên cứu áp dụng tính lưỡng dụng của nhiều công nghệ sản phẩm phục vụ cho mục đích quân sự cũng như sản xuất dân sinh.'
        : 'Expanding relationships and science and technology services, researching the dual-use application of many product technologies for both military purposes and civilian production.'
    }
  ];


  // Fields of operation data
  const fieldsData = [
    {
      icon: 'bi-gear',
      title: language === 'vi' ? 'Công nghệ đúc' : 'Casting Technology',
      description: language === 'vi' ? 'Nghiên cứu và ứng dụng các công nghệ đúc tiên tiến' : 'Research and application of advanced casting technologies'
    },
    {
      icon: 'bi-fire',
      title: language === 'vi' ? 'Xử lý nhiệt' : 'Heat Treatment',
      description: language === 'vi' ? 'Công nghệ xử lý nhiệt và cải thiện tính chất vật liệu' : 'Heat treatment technology and material property improvement'
    },
    {
      icon: 'bi-tools',
      title: language === 'vi' ? 'Sản xuất khuôn mẫu' : 'Mold Manufacturing',
      description: language === 'vi' ? 'Thiết kế và sản xuất khuôn mẫu chính xác cao' : 'Design and manufacture of high-precision molds'
    },
    {
      icon: 'bi-cpu',
      title: language === 'vi' ? 'Tự động hóa' : 'Automation',
      description: language === 'vi' ? 'Giải pháp tự động hóa và điều khiển thông minh' : 'Automation solutions and intelligent control'
    },
    {
      icon: 'bi-shield-check',
      title: language === 'vi' ? 'Kiểm định chất lượng' : 'Quality Testing',
      description: language === 'vi' ? 'Dịch vụ kiểm định và đánh giá chất lượng sản phẩm' : 'Product quality testing and evaluation services'
    },
    {
      icon: 'bi-book',
      title: language === 'vi' ? 'Đào tạo và tư vấn' : 'Training & Consulting',
      description: language === 'vi' ? 'Đào tạo chuyên môn và tư vấn công nghệ' : 'Professional training and technology consulting'
    }
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    {
      label: { vi: 'Trang chủ', en: 'Home' },
      href: '/'
    },
    {
      label: { vi: 'Giới thiệu', en: 'About' },
      active: true
    }
  ];

  return (
    <>
      <Breadcrumb
        title={{ vi: 'Giới thiệu', en: 'About Us' }}
        backgroundImage="/images/bg/bg-03.webp"
        items={breadcrumbItems}
      />

      {/* About Us Introduction Section */}
      <section className="py-5" style={{
        backgroundImage: 'url(/images/image-64.webp)',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        position: 'relative'
      }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              {loading ? (
                <div className="about-image-wrapper position-relative has-rectangle d-flex justify-content-center align-items-center" style={{
                  height: '400px',
                  background: '#f8f9fa',
                  borderRadius: '10px'
                }}>
                  <div className="spinner-border text-theme" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : overview && overview.images && overview.images.length > 0 ? (
                <div className="about-image-wrapper position-relative has-rectangle">
                  <div id="aboutPageImageCarousel" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-inner">
                      {overview.images.map((image: string, index: number) => (
                        <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                          <OptimizedImage
                            src={image}
                            alt={`${overview.title || (language === 'vi' ? 'Viện Công nghệ' : 'Technology Institute')} - Image ${index + 1}`}
                            context="About page - Institute image"
                            className="img-fluid w-100"
                            style={{
                              borderRadius: '10px',
                              height: '400px',
                              objectFit: 'cover'
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    {overview.images.length > 1 && (
                      <>
                        <button className="carousel-control-prev" type="button" data-bs-target="#aboutPageImageCarousel" data-bs-slide="prev">
                          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                          <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#aboutPageImageCarousel" data-bs-slide="next">
                          <span className="carousel-control-next-icon" aria-hidden="true"></span>
                          <span className="visually-hidden">Next</span>
                        </button>
                        <div className="carousel-indicators">
                          {overview.images.map((_: string, index: number) => (
                            <button
                              key={index}
                              type="button"
                              data-bs-target="#aboutPageImageCarousel"
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
                <div className="about-image-wrapper position-relative has-rectangle d-flex justify-content-center align-items-center">
                  <OptimizedImage
                    src="https://viencongnghe.com/wp-content/uploads/2023/05/image-20.webp"
                    alt={language === 'vi' ? 'Viện Công nghệ' : 'Technology Institute'}
                    context="About page - Institute image"
                    className="img-fluid"
                    style={{
                      maxWidth: '100%',
                      width: 'auto',
                      borderRadius: '10px',
                      position: 'relative',
                      zIndex: 1
                    }}
                  />
                </div>
              )}
            </Col>
            <Col lg={6}>
              <div className="about-text-card">
                <div className="mb-3">
                  <span className="about-label" style={{ color: '#21759b' }}>
                    {language === 'vi' ? 'About us' : 'About us'}
                  </span>
                </div>
                <h1 className="about-title">
                  {overview?.title || (language === 'vi' ? 'VỀ CHÚNG TÔI' : 'ABOUT US')}
                </h1>
                <div className="about-divider" style={{ background: '#21759b' }}></div>

                {loading ? (
                  <div className="loading-content">
                    <div className="placeholder-glow">
                      <span className="placeholder col-12 mb-3"></span>
                      <span className="placeholder col-12 mb-3"></span>
                      <span className="placeholder col-8"></span>
                    </div>
                  </div>
                ) : overview?.description ? (
                  <div className="about-text mb-0" dangerouslySetInnerHTML={{ __html: overview.description }} />
                ) : (
                  <>
                    <p className="about-text">
                      {language === 'vi'
                        ? 'Viện Công nghệ tiền thân là Viện nghiên cứu các phương pháp công nghệ mới được thành lập ngày 21/09/1970 theo Quyết định số 700/QĐ/QĐ của Bộ trưởng Bộ Cơ khí và Luyện kim (nay là Bộ Công Thương).'
                        : 'Institute of Technology  formerly known as the Research Institute of New Technology Methods, was established on September 21, 1970 according to Decision No. 700/QĐ/QĐ of the Minister of Machinery and Metallurgy (now the Ministry of Industry and Trade).'
                      }
                    </p>

                    <p className="about-text">
                      {language === 'vi'
                        ? 'Viện Công nghệ là Tổ chức khoa học và công nghệ hoạt động theo Luật Khoa học và công nghệ trong lĩnh vực nghiên cứu, hoạt động theo Luật doanh nghiệp trong lĩnh vực sản xuất kinh doanh.'
                        : 'The Technology Institute is a scientific and technological organization operating under the Law on Science and Technology in the field of research, and operating under the Enterprise Law in the field of production and business.'
                      }
                    </p>

                    <p className="about-text mb-0">
                      {language === 'vi'
                        ? 'Trong suốt hơn 50 năm hoạt động trong lĩnh vực cơ khí và luyện kim, Viện Công nghệ không ngừng đầu tư và phát triển các lĩnh vực thế mạnh của Viện nhằm đáp ứng được những yêu cầu khắt khe nhất của khách hàng trong nước và quốc tế. Bên cạnh đó, Viện cũng triển khai nhiều nghiên cứu về lĩnh vực vật liệu mới, nhiệt luyện, cơ khí chế tạo khuôn mẫu với mục tiêu ứng dụng vào thực tế cũng như thúc đẩy quá trình đồng bộ các sản phẩm nhập khẩu.'
                        : 'Throughout more than 50 years of operation in the field of machinery and metallurgy, the Technology Institute has continuously invested and developed the Institute\'s strengths to meet the most stringent requirements of domestic and international customers. In addition, the Institute also conducts many research projects in the field of new materials, heat treatment, mechanical mold manufacturing with the goal of practical application as well as promoting the process of synchronizing imported products.'
                      }
                    </p>
                  </>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Vision, Mission, Core Values Section */}
      <section className="light-bg py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="mb-4" style={{ textTransform: 'uppercase', lineHeight: '1.3' }}>
                {language === 'vi' ? (
                  <>
                    VIỆN CÔNG NGHỆ <br />
                    GIÁ TRỊ TRONG TỪNG HÀNH ĐỘNG
                  </>
                ) : (
                  <>
                    TECHNOLOGY INSTITUTE<br />
                    VALUE IN EVERY ACTION
                  </>
                )}
              </h2>
            </Col>
          </Row>
          <Row>
            {visionMissionData.map((item, index) => (
              <Col lg={4} className="mb-4" key={index}>
                <div className={index === 0 ? "vision-column" : index === 1 ? "mission-column" : "values-column"}>
                  <div className={index === 0 ? "vision-card" : index === 1 ? "mission-card" : "values-card"}>
                    <div className={index === 0 ? "vision-icon" : index === 1 ? "mission-icon" : "values-icon"}>
                      <i className={`bi ${item.icon}`}></i>
                    </div>
                    <h3 className={index === 0 ? "vision-title" : index === 1 ? "mission-title" : "values-title"}>{item.title}</h3>
                    <div className={`${index === 0 ? "vision-content" : index === 1 ? "mission-content" : "values-content"} text-start`}>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: formatTextWithLineBreaks(item.content)
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Organizational Structure Section */}
      <section className="py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="mb-4">
                {language === 'vi' ? 'Tổ chức bộ máy' : 'Organizational Structure'}
              </h2>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col lg={10}>
              <div className="text-center">
                <OptimizedImage
                  src="https://viencongnghe.com/wp-content/uploads/2023/05/so-do-to-chuc.webp"
                  alt={language === 'vi' ? 'Sơ đồ tổ chức' : 'Organizational Chart'}
                  context="About page - Organizational chart"
                  className="img-fluid"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Development Journey Timeline Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="mb-4">
                {language === 'vi' ? 'Hành trình phát triển' : 'Development Journey'}
              </h2>
            </Col>
          </Row>

          <Row className="align-items-start">
            {/* Video Column */}
            <Col lg={6} className="mb-4 mb-lg-0">
              {overview && overview.videos && overview.videos.length > 0 ? (
                <div>
                  <div className="text-center mb-4">
                    <h5 className="mb-3">
                      {language === 'vi' ? 'Video giới thiệu' : 'Introduction Video'}
                    </h5>
                    <p className="text-muted">
                      {language === 'vi'
                        ? 'Khám phá hành trình phát triển của Viện Công nghệ qua những năm tháng'
                        : 'Discover the development journey of the Technology Institute through the years'
                      }
                    </p>
                  </div>
                  <div className="video-container position-relative">
                    <div className="ratio ratio-16x9">
                      <iframe
                        src={overview.videos[0].url}
                        title={overview.videos[0].title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{
                          borderRadius: '10px',
                          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
                        }}
                      ></iframe>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="placeholder-video bg-white rounded p-5" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div>
                      <i className="bi bi-play-circle mb-3" style={{ fontSize: '4rem', color: '#21759b' }}></i>
                      <h5 className="text-muted">
                        {language === 'vi' ? 'Video sẽ được cập nhật sớm' : 'Video will be updated soon'}
                      </h5>
                    </div>
                  </div>
                </div>
              )}
            </Col>

            {/* Timeline Column */}
            <Col lg={6}>
              <div className="timeline-column">
                {history && history.length > 0 ? (
                  history.map((item, index) => (
                    <div key={index} className="timeline-item-simple mb-4">
                      <div className="d-flex align-items-start">
                        <div className="timeline-year-badge text-white rounded px-3 py-2 me-3" style={{ minWidth: '80px', textAlign: 'center', fontWeight: 'bold', backgroundColor: '#21759b' }}>
                          {item.year}
                        </div>
                        <div className="flex-grow-1">
                          <Card className="border-0 shadow-sm h-100">
                            <Card.Body className="p-3">
                              <Card.Text className="mb-1 fw-bold small">{item.title}</Card.Text>
                              <Card.Text className="mb-0 small text-muted">{item.description}</Card.Text>
                            </Card.Body>
                          </Card>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center">
                    <div className="placeholder-timeline bg-white rounded p-4">
                      <i className="bi bi-clock-history mb-3" style={{ fontSize: '3rem', color: '#21759b' }}></i>
                      <h6 className="text-muted">
                        {language === 'vi' ? 'Dữ liệu lịch sử đang được cập nhật' : 'Historical data is being updated'}
                      </h6>
                    </div>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Fields of Operation Section */}
      <section className="services-section py-5" style={{
        backgroundImage: 'url(/images/bg-left-bottom.webp)',
        backgroundPosition: 'left bottom',
        backgroundRepeat: 'no-repeat',
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        paddingLeft: 'calc(50vw - 50%)',
        paddingRight: 'calc(50vw - 50%)'
      }}>
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
    </>
  );
}
