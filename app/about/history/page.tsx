'use client';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchAboutHistory } from '@/utils/api';
import OptimizedImage from '@/components/OptimizedImage';
import Breadcrumb from '@/components/Breadcrumb';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function HistoryPage() {
  const { t, language } = useLanguage();
  const [milestones, setMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const historyData = await fetchAboutHistory(language, controller.signal);

        if (isMounted) {
          setMilestones(historyData);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error loading history data:', err);
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

  return (
    <>
      <Breadcrumb
        title={{ vi: 'Lịch sử phát triển', en: 'Development History' }}
        items={breadcrumbItems}
      />

      {/* Timeline Section */}
      {milestones && milestones.length > 0 && (
        <section className="light-bg">
          <Container>
            <Row className="text-center mb-5">
              <Col>
                <h2 className="mb-4">{t('history.milestones.title')}</h2>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="timeline">
                  {milestones.map((milestone, index) => (
                    <div key={index} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
                      <div className="timeline-content">
                        <Card className="h-100">
                          <Card.Body>
                            <div className="d-flex align-items-start">
                              <div className="timeline-year me-3">
                                <span className="badge bg-primary fs-6">{milestone.year}</span>
                              </div>
                              <div className="flex-grow-1">
                                <Card.Title className="h5 mb-3">{milestone.title}</Card.Title>
                                <Card.Text>{milestone.description}</Card.Text>
                                {milestone.image && (
                                  <div className="mt-3">
                                    <OptimizedImage 
                                      src={milestone.image} 
                                      alt={milestone.title}
                                      context="History milestone"
                                      className="img-fluid rounded"
                                      style={{ maxHeight: '200px', objectFit: 'cover' }}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </div>
                    </div>
                  ))}
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      )}

      {/* Summary Section */}
      <section>
        <Container>
          <Row className="text-center">
            <Col>
              <div className="p-5">
                <h3 className="mb-4">Hành trình phát triển</h3>
                <p className="lead">
                  Từ những ngày đầu thành lập vào năm 1970, Viện Công nghệ đã trải qua một hành trình 
                  phát triển không ngừng với nhiều thành tựu đáng tự hào. Chúng tôi tiếp tục cam kết 
                  đổi mới và phát triển để đáp ứng nhu cầu ngày càng cao của xã hội.
                </p>
                <div className="mt-4">
                  <a href="/about/vision-mission" className="btn btn-primary me-3">
                    Tầm nhìn & Sứ mệnh
                  </a>
                  <a href="/organization" className="btn btn-outline-primary">
                    Cơ cấu tổ chức
                  </a>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <style jsx>{`
        .timeline {
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
        }

        .timeline::after {
          content: '';
          position: absolute;
          width: 6px;
          background-color: #007bff;
          top: 0;
          bottom: 0;
          left: 50%;
          margin-left: -3px;
        }

        .timeline-item {
          padding: 10px 40px;
          position: relative;
          background-color: inherit;
          width: 50%;
        }

        .timeline-item::after {
          content: '';
          position: absolute;
          width: 25px;
          height: 25px;
          right: -17px;
          background-color: white;
          border: 4px solid #007bff;
          top: 15px;
          border-radius: 50%;
          z-index: 1;
        }

        .timeline-item.left {
          left: 0;
        }

        .timeline-item.right {
          left: 50%;
        }

        .timeline-item.right::after {
          left: -16px;
        }

        .timeline-content {
          padding: 20px 30px;
          background-color: white;
          position: relative;
          border-radius: 6px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .timeline-year {
          flex-shrink: 0;
        }

        @media screen and (max-width: 768px) {
          .timeline::after {
            left: 31px;
          }
          
          .timeline-item {
            width: 100%;
            padding-left: 70px;
            padding-right: 25px;
          }
          
          .timeline-item.right {
            left: 0%;
          }
          
          .timeline-item.left::after,
          .timeline-item.right::after {
            left: 15px;
          }
        }
      `}</style>
    </>
  );
}
