'use client';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchAboutOverview, fetchOrganization, fetchAboutHistory } from '@/utils/api';
import OptimizedImage from '@/components/OptimizedImage';
import Breadcrumb from '@/components/Breadcrumb';
import '@/assets/css/about-timeline.css';

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

  // Vision, Mission, Core Values data
  const visionMissionData = [
    {
      icon: 'bi-eye',
      title: language === 'vi' ? 'Tầm nhìn' : 'Vision',
      content: language === 'vi'
        ? 'Trở thành trung tâm nghiên cứu và phát triển công nghệ hàng đầu trong lĩnh vực cơ khí tại Việt Nam và khu vực.'
        : 'To become a leading research and technology development center in the field of machinery in Vietnam and the region.'
    },
    {
      icon: 'bi-bullseye',
      title: language === 'vi' ? 'Sứ mệnh' : 'Mission',
      content: language === 'vi'
        ? 'Nghiên cứu, ứng dụng và chuyển giao công nghệ tiên tiến để phục vụ sự phát triển công nghiệp và nâng cao năng lực cạnh tranh của doanh nghiệp.'
        : 'Research, apply and transfer advanced technology to serve industrial development and enhance business competitiveness.'
    },
    {
      icon: 'bi-heart',
      title: language === 'vi' ? 'Giá trị cốt lõi' : 'Core Values',
      content: language === 'vi'
        ? 'Chất lượng - Đổi mới - Hợp tác - Phát triển bền vững. Chúng tôi cam kết mang lại giá trị tốt nhất cho khách hàng và đối tác.'
        : 'Quality - Innovation - Cooperation - Sustainable development. We are committed to bringing the best value to customers and partners.'
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
        items={breadcrumbItems}
      />

      {/* About Us Introduction Section */}
      <section className="py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <OptimizedImage
                src="https://viencongnghe.com/wp-content/uploads/2023/05/image-20.webp"
                alt={language === 'vi' ? 'Viện Công nghệ' : 'Technology Institute'}
                context="About page - Institute image"
                className="img-fluid rounded"
                style={{ width: '100%', height: '400px', objectFit: 'cover' }}
              />
            </Col>
            <Col lg={6}>
              <div className="ps-lg-4">
                <h6 className="text-theme mb-3 text-uppercase">
                  {language === 'vi' ? 'Giới thiệu' : 'About Us'}
                </h6>
                <h2 className="mb-4">
                  {language === 'vi'
                    ? 'Viện Nghiên cứu Công nghệ Cơ khí'
                    : 'Research Institute of Technology for Machinery'
                  }
                </h2>
                <p className="mb-4 text-muted">
                  {language === 'vi'
                    ? 'Viện Nghiên cứu Công nghệ Cơ khí (RITM) được thành lập từ năm 1970, là một trong những đơn vị nghiên cứu và phát triển công nghệ hàng đầu tại Việt Nam trong lĩnh vực cơ khí. Với hơn 50 năm kinh nghiệm, chúng tôi đã không ngừng đổi mới và phát triển để đáp ứng nhu cầu của thị trường và xã hội.'
                    : 'The Research Institute of Technology for Machinery (RITM) was established in 1970, is one of the leading research and technology development units in Vietnam in the field of machinery. With over 50 years of experience, we have continuously innovated and developed to meet market and social needs.'
                  }
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Vision, Mission, Core Values Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="mb-4">
                {language === 'vi' ? 'Tầm nhìn - Sứ mệnh - Giá trị cốt lõi' : 'Vision - Mission - Core Values'}
              </h2>
            </Col>
          </Row>
          <Row>
            {visionMissionData.map((item, index) => (
              <Col lg={4} md={6} className="mb-4" key={index}>
                <Card className="h-100 text-center border-0 shadow-sm">
                  <Card.Body className="p-4">
                    <div className="mb-3">
                      <i className={`bi ${item.icon} text-theme`} style={{ fontSize: '3rem' }}></i>
                    </div>
                    <Card.Title className="h5 mb-3">{item.title}</Card.Title>
                    <Card.Text className="text-muted">{item.content}</Card.Text>
                  </Card.Body>
                </Card>
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
                      <i className="bi bi-play-circle text-theme mb-3" style={{ fontSize: '4rem' }}></i>
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
                        <div className="timeline-year-badge bg-primary text-white rounded px-3 py-2 me-3" style={{ minWidth: '80px', textAlign: 'center', fontWeight: 'bold' }}>
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
                      <i className="bi bi-clock-history text-theme mb-3" style={{ fontSize: '3rem' }}></i>
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
      <section className="py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="mb-4">
                {language === 'vi' ? 'Lĩnh vực hoạt động' : 'Fields of Operation'}
              </h2>
            </Col>
          </Row>
          <Row>
            {fieldsData.map((field, index) => (
              <Col lg={4} md={6} className="mb-4" key={index}>
                <Card className="h-100 text-center border-0 shadow-sm">
                  <Card.Body className="p-4">
                    <div className="mb-3">
                      <i className={`bi ${field.icon} text-theme`} style={{ fontSize: '3rem' }}></i>
                    </div>
                    <Card.Title className="h5 mb-3">{field.title}</Card.Title>
                    <Card.Text className="text-muted small">{field.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  );
}
