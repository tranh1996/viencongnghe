'use client';

import Timeline from '@/components/Timeline';
import Breadcrumb from '@/components/Breadcrumb';
import { Container, Row, Col } from 'react-bootstrap';
import { fetchAboutHistory, HistoryMilestone } from '@/utils/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useState } from 'react';

function HistoryPageContent() {
  const { language, t } = useLanguage();
  const [historyData, setHistoryData] = useState<HistoryMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    
    const loadHistory = async () => {
      try {
        setLoading(true);
        const data = await fetchAboutHistory(language, controller.signal);
        setHistoryData(data);
        setError(null);
      } catch (err) {
        if (!(err instanceof Error && err.name === 'AbortError')) {
          console.error('Error loading history:', err);
          setError('Không thể tải dữ liệu lịch sử');
        }
      } finally {
        setLoading(false);
      }
    };

    loadHistory();

    return () => {
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

      {/* Introduction Section */}
      <section className="py-5">
        <Container>
          <Row className="justify-content-center text-center mb-5">
            <Col xl={8} lg={10}>
              <h2 className="mb-4">
                {language === 'vi' ? 'Hành trình phát triển' : 'Development Journey'}
              </h2>
              <p className="text-muted lead">
                {language === 'vi' 
                  ? 'Lịch sử hình thành và phát triển qua các mốc quan trọng của Viện Nghiên cứu Công nghệ Máy.'
                  : 'The history of formation and development through important milestones of the Research Institute of Technology for Machinery.'
                }
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Timeline Section */}
      {historyData.length > 0 && <Timeline items={historyData} />}
      </div>
    </>
  );
}

export default function HistoryPage() {
  return <HistoryPageContent />;
}