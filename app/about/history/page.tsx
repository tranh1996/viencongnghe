'use client';

import Breadcrumb from '@/components/Breadcrumb';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { fetchAboutHistory, HistoryMilestone, fetchAboutOverview, AboutOverview } from '@/utils/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useState } from 'react';

function HistoryPageContent() {
  const { language, t } = useLanguage();
  const [historyData, setHistoryData] = useState<HistoryMilestone[]>([]);
  const [overview, setOverview] = useState<AboutOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [historyData, overviewData] = await Promise.all([
          fetchAboutHistory(language, controller.signal),
          fetchAboutOverview(language, controller.signal)
        ]);

        if (isMounted) {
          setHistoryData(historyData);
          setOverview(overviewData);
        }
      } catch (err) {
        if (isMounted && !(err instanceof Error && err.name === 'AbortError')) {
          console.error('Error loading data:', err);
          setError('Không thể tải dữ liệu lịch sử');
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

  const breadcrumbItems = [
    {
      label: { vi: 'Trang chủ', en: 'Home' },
      href: '/'
    },
    {
      label: { vi: 'Giới thiệu', en: 'About' },
      href: '/about'
    },
    {
      label: { vi: 'Lịch sử phát triển', en: 'History' },
      active: true
    }
  ];

  if (loading) {
    return (
      <>
        <Breadcrumb
          title={{ vi: 'Lịch sử phát triển', en: 'History' }}
          items={breadcrumbItems}
        />
        <div className="page-content">
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
            <div className="text-center">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Đang tải...</span>
              </div>
              <p className="text-muted">Đang tải lịch sử phát triển...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Breadcrumb
          title={{ vi: 'Lịch sử phát triển', en: 'History' }}
          items={breadcrumbItems}
        />
        <div className="page-content">
          <div className="container py-5">
            <div className="text-center">
              <div className="alert alert-danger">
                <h4>Lỗi tải dữ liệu</h4>
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumb
        title={{ vi: 'Lịch sử phát triển', en: 'History' }}
        items={breadcrumbItems}
      />
      <div className="page-content">

      {/* Development Journey Timeline Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="mb-4">
                {language === 'vi' ? 'Hành trình phát triển' : 'Development Journey'}
              </h2>
              <p className="text-muted lead">
                {language === 'vi'
                  ? 'Lịch sử hình thành và phát triển qua các mốc quan trọng của Viện Công nghệ.'
                  : 'The history of formation and development through important milestones of the Technology Institute.'
                }
              </p>
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
                {historyData && historyData.length > 0 ? (
                  historyData.map((item, index) => (
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
      </div>
    </>
  );
}

export default function HistoryPage() {
  return <HistoryPageContent />;
}