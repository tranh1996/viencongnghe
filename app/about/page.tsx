'use client';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchAboutOverview, fetchOrganization } from '@/utils/api';
import OptimizedImage from '@/components/OptimizedImage';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function AboutPage() {
  const { t, language } = useLanguage();
  const [overview, setOverview] = useState<any>(null);
  const [organization, setOrganization] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [overviewData, organizationData] = await Promise.all([
          fetchAboutOverview(language, controller.signal),
          fetchOrganization(language, controller.signal)
        ]);

        if (isMounted) {
          setOverview(overviewData);
          setOrganization(organizationData);
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

  return (
    <>
      {/* Page Title */}
      <section className="page-title dark-bg">
        <Container>
          <Row>
            <Col>
              <h1>{t('about.pageTitle')}</h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="/">{t('about.breadcrumb.home')}</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {t('about.breadcrumb.about')}
                  </li>
                </ol>
              </nav>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Overview Section */}
      {overview && (
        <section>
          <Container>
            <Row className="align-items-center">
              <Col lg={6} className="mb-4 mb-lg-0">
                {overview.images && overview.images.length > 0 && (
                  <div className="overview-image-slider">
                    <div id="overviewCarousel" className="carousel slide" data-bs-ride="carousel">
                      <div className="carousel-indicators">
                        {overview.images.map((_: string, index: number) => (
                          <button
                            key={index}
                            type="button"
                            data-bs-target="#overviewCarousel"
                            data-bs-slide-to={index}
                            className={index === 0 ? "active" : ""}
                            aria-current={index === 0 ? "true" : "false"}
                            aria-label={`Slide ${index + 1}`}
                          ></button>
                        ))}
                      </div>
                      <div className="carousel-inner">
                        {overview.images.map((image: string, index: number) => (
                          <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                            <OptimizedImage 
                              src={image} 
                              alt={`${overview.title} - Image ${index + 1}`}
                              context="About page - Overview slider"
                              className="about-img-shape"
                              style={{ backgroundImage: `url(${image})` }}
                            />
                          </div>
                        ))}
                      </div>
                      {overview.images.length > 1 && (
                        <>
                          <button className="carousel-control-prev" type="button" data-bs-target="#overviewCarousel" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                          </button>
                          <button className="carousel-control-next" type="button" data-bs-target="#overviewCarousel" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </Col>
              <Col lg={6}>
                <div className="ps-lg-5">
                  <h6 className="text-theme mb-3">{t('about.title')}</h6>
                  <h2 className="mb-4">{overview.title}</h2>
                  <p className="mb-4">{overview.description}</p>
                  
                  {/* Video Section */}
                  {overview.videos && overview.videos.length > 0 && (
                    <div className="mt-4">
                      <h5 className="mb-3">{t('home.about.videos')}</h5>
                      <div className="ratio ratio-16x9">
                        <iframe
                          src={overview.videos[0].url}
                          title={overview.videos[0].title}
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      )}

      {/* Organization Section */}
      {organization && organization.length > 0 && (
        <section className="light-bg">
          <Container>
            <Row className="text-center mb-5">
              <Col>
                <h2 className="mb-4">{t('about.organization.title')}</h2>
              </Col>
            </Row>
            <Row>
              {organization.map((member, index) => (
                <Col lg={6} md={6} className="mb-4" key={index}>
                  <Card className="h-100">
                    <Card.Body className="text-center">
                      {member.avatar && (
                        <div className="mb-3">
                          <OptimizedImage 
                            src={member.avatar} 
                            alt={member.name}
                            context="Organization member"
                            className="rounded-circle"
                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                          />
                        </div>
                      )}
                      <Card.Title>{member.name}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">{member.position}</Card.Subtitle>
                      <Card.Text className="small text-muted mb-2">{member.department}</Card.Text>
                      <Card.Text>{member.description}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}

      {/* Navigation Cards */}
      <section className="light-bg">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="mb-4">Tìm hiểu thêm về chúng tôi</h2>
            </Col>
          </Row>
          <Row>
            <Col lg={6} className="mb-4">
              <Card className="h-100 text-center">
                <Card.Body className="p-5">
                  <div className="mb-4">
                    <i className="bi bi-eye text-theme" style={{ fontSize: '4rem' }}></i>
                  </div>
                  <Card.Title className="h4 mb-3">{t('nav.about.visionMission')}</Card.Title>
                  <Card.Text className="mb-4">
                    Khám phá tầm nhìn, sứ mệnh và giá trị cốt lõi của Viện Công nghệ, 
                    cùng với thông tin về ban lãnh đạo và cơ cấu tổ chức.
                  </Card.Text>
                  <a href="/about/vision-mission" className="btn btn-primary">
                    Xem chi tiết
                  </a>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6} className="mb-4">
              <Card className="h-100 text-center">
                <Card.Body className="p-5">
                  <div className="mb-4">
                    <i className="bi bi-clock-history text-theme" style={{ fontSize: '4rem' }}></i>
                  </div>
                  <Card.Title className="h4 mb-3">{t('nav.about.history')}</Card.Title>
                  <Card.Text className="mb-4">
                    Tìm hiểu hành trình hơn 50 năm phát triển của Viện Công nghệ 
                    thông qua các mốc lịch sử quan trọng từ năm 1970 đến nay.
                  </Card.Text>
                  <a href="/about/history" className="btn btn-primary">
                    Xem chi tiết
                  </a>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}
