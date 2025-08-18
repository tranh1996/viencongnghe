'use client';

import type { Metadata } from 'next';
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchLatestNews, fetchHighlightNews, News } from '@/utils/api';
import OptimizedImage from '@/components/OptimizedImage';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function BlogPage() {
  const { language, t } = useLanguage();
  const [latestNews, setLatestNews] = useState<News[]>([]);
  const [highlightNews, setHighlightNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [latestData, highlightData] = await Promise.all([
          fetchLatestNews(language, 10),
          fetchHighlightNews(language)
        ]);
        
        setLatestNews(latestData);
        setHighlightNews(highlightData);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch news');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
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
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <>
        <section className="page-title dark-bg">
          <Container>
            <Row>
              <Col>
                <h1>{t('blog.pageTitle')}</h1>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="/">{t('blog.breadcrumb.home')}</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      {t('blog.breadcrumb.news')}
                    </li>
                  </ol>
                </nav>
              </Col>
            </Row>
          </Container>
        </section>

        <section>
          <Container>
            <Row className="text-center">
              <Col>
                <Spinner animation="border" role="status" className="mb-3">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p>{t('organization.loading')}</p>
              </Col>
            </Row>
          </Container>
        </section>
      </>
    );
  }

  if (error) {
    return (
      <>
        <section className="page-title dark-bg">
          <Container>
            <Row>
              <Col>
                <h1>{t('blog.pageTitle')}</h1>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="/">{t('blog.breadcrumb.home')}</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      {t('blog.breadcrumb.news')}
                    </li>
                  </ol>
                </nav>
              </Col>
            </Row>
          </Container>
        </section>

        <section>
          <Container>
            <Row>
              <Col>
                <Alert variant="danger">
                  <Alert.Heading>{t('organization.error')}</Alert.Heading>
                  <p>{error}</p>
                </Alert>
              </Col>
            </Row>
          </Container>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="page-title dark-bg">
        <Container>
          <Row>
            <Col>
              <h1>{t('blog.pageTitle')}</h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="/">{t('blog.breadcrumb.home')}</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {t('blog.breadcrumb.news')}
                  </li>
                </ol>
              </nav>
            </Col>
          </Row>
        </Container>
      </section>

      <section>
        <Container>
          <Row className="text-center mb-5">
            <Col lg={8} className="mx-auto">
              <h6 className="text-theme mb-3">{t('blog.title')}</h6>
              <h2 className="mb-4">{t('blog.heading')}</h2>
              <p>
                {t('blog.description')}
              </p>
            </Col>
          </Row>

          {/* Featured News */}
          {highlightNews.length > 0 && (
            <Row className="mb-5">
              <Col lg={8} className="mb-4">
                <div className="card">
                  <OptimizedImage 
                    src={highlightNews[0]?.image_url || "/images/blog/01.jpg"} 
                    className="card-img-top" 
                    alt={highlightNews[0]?.title || "Tin tức nổi bật"}
                    width={800}
                    height={400}
                    context="blog-featured"
                  />
                  <div className="card-body">
                    <h6 className="text-muted mb-2">
                      {highlightNews[0]?.created_at ? formatDate(highlightNews[0].created_at) : t('common.recentlyUpdated')}
                    </h6>
                    <h3 className="card-title">{highlightNews[0]?.title}</h3>
                    <p className="card-text">
                      {highlightNews[0]?.description ? truncateText(highlightNews[0].description, 200) : ''}
                    </p>
                    <a href={`/news/${highlightNews[0]?.slug}`} className="text-theme text-decoration-none">
                      {t('blog.readMore')} <i className="bi bi-arrow-right ms-1"></i>
                    </a>
                  </div>
                </div>
              </Col>
              <Col lg={4} className="mb-4">
                {highlightNews[1] && (
                  <div className="card">
                    <img 
                      src={highlightNews[1]?.image_url || "/images/blog/02.jpg"} 
                      className="card-img-top" 
                      alt={highlightNews[1]?.title || "Tin tức"} 
                    />
                    <div className="card-body">
                      <h6 className="text-muted mb-2">
                        {highlightNews[1]?.created_at ? formatDate(highlightNews[1].created_at) : t('common.recentlyUpdated')}
                      </h6>
                      <h5 className="card-title">{highlightNews[1]?.title}</h5>
                      <p className="card-text">
                        {highlightNews[1]?.description ? truncateText(highlightNews[1].description, 150) : ''}
                      </p>
                      <a href={`/news/${highlightNews[1]?.slug}`} className="text-theme text-decoration-none">
                        {t('blog.readMore')} <i className="bi bi-arrow-right ms-1"></i>
                      </a>
                    </div>
                  </div>
                )}
              </Col>
            </Row>
          )}

          {/* News Categories */}
          <Row>
            <Col lg={4} md={6} className="mb-4">
              <div className="card h-100">
                <div className="card-header bg-theme text-white">
                  <h5 className="mb-0">{t('blog.categories.activities')}</h5>
                </div>
                <div className="card-body">
                  {latestNews.filter(news => news.categories.some(cat => cat.name === 'Tin tức')).length > 0 ? (
                    <ul className="list-unstyled">
                      {latestNews
                        .filter(news => news.categories.some(cat => cat.name === 'Tin tức'))
                        .slice(0, 3)
                        .map((news) => (
                          <li key={news.id} className="mb-3">
                            <a href={`/news/${news.slug}`} className="text-decoration-none">
                              <h6>{news.title}</h6>
                              <small className="text-muted">
                                {formatDate(news.created_at)}
                              </small>
                            </a>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p className="text-muted">{t('organization.noDataMessage')}</p>
                  )}
                </div>
              </div>
            </Col>

            <Col lg={4} md={6} className="mb-4">
              <div className="card h-100">
                <div className="card-header bg-theme text-white">
                  <h5 className="mb-0">{t('blog.categories.science')}</h5>
                </div>
                <div className="card-body">
                  {latestNews.filter(news => news.categories.some(cat => cat.name === 'Tin tức')).length > 0 ? (
                    <ul className="list-unstyled">
                      {latestNews
                        .filter(news => news.categories.some(cat => cat.name === 'Tin tức'))
                        .slice(0, 3)
                        .map((news) => (
                          <li key={news.id} className="mb-3">
                            <a href={`/news/${news.slug}`} className="text-decoration-none">
                              <h6>{news.title}</h6>
                              <small className="text-muted">
                                {formatDate(news.created_at)}
                              </small>
                            </a>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p className="text-muted">{t('organization.noDataMessage')}</p>
                  )}
                </div>
              </div>
            </Col>

            <Col lg={4} md={6} className="mb-4">
              <div className="card h-100">
                <div className="card-header bg-theme text-white">
                  <h5 className="mb-0">{t('blog.categories.training')}</h5>
                </div>
                <div className="card-body">
                  {latestNews.filter(news => news.categories.some(cat => cat.name === 'Tin tức')).length > 0 ? (
                    <ul className="list-unstyled">
                      {latestNews
                        .filter(news => news.categories.some(cat => cat.name === 'Tin tức'))
                        .slice(0, 3)
                        .map((news) => (
                          <li key={news.id} className="mb-3">
                            <a href={`/news/${news.slug}`} className="text-decoration-none">
                              <h6>{news.title}</h6>
                              <small className="text-muted">
                                {formatDate(news.created_at)}
                              </small>
                            </a>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p className="text-muted">{t('organization.noDataMessage')}</p>
                  )}
                </div>
              </div>
            </Col>
          </Row>

          {/* Professional Articles */}
          <section id="professional" className="mt-5">
            <Row className="text-center mb-4">
              <Col>
                <h3>{t('blog.professional.title')}</h3>
              </Col>
            </Row>
            <Row>
              {latestNews
                .filter(news => news.categories.some(cat => cat.name === 'Tin tức'))
                .slice(0, 3)
                .map((news) => (
                  <Col key={news.id} lg={4} md={6} className="mb-4">
                    <div className="card h-100">
                      <img 
                        src={news.image_url || "/images/blog/03.jpg"} 
                        className="card-img-top" 
                        alt={news.title} 
                      />
                      <div className="card-body">
                        <h5 className="card-title">{news.title}</h5>
                        <p className="card-text">
                          {news.description ? truncateText(news.description, 120) : ''}
                        </p>
                        <a href={`/news/${news.slug}`} className="text-theme text-decoration-none">
                          {t('blog.readMore')} <i className="bi bi-arrow-right ms-1"></i>
                        </a>
                      </div>
                    </div>
                  </Col>
                ))}
            </Row>
            {latestNews.filter(news => news.categories.some(cat => cat.name === 'Tin tức')).length === 0 && (
              <Row>
                <Col>
                  <p className="text-center text-muted">{t('organization.noDataMessage')}</p>
                </Col>
              </Row>
            )}
          </section>
        </Container>
      </section>
    </>
  );
}
