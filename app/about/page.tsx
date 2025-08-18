'use client';

import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useLanguage } from '@/contexts/LanguageContext';
import OptimizedImage from '@/components/OptimizedImage';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function AboutPage() {
  const { t } = useLanguage();

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

      {/* About Overview */}
      <section>
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <OptimizedImage 
                src="/images/about/01.jpg" 
                alt="Viện Công nghệ RITM - Hơn 50 năm hoạt động trong lĩnh vực cơ khí và luyện kim"
                context="Trang giới thiệu - Tổng quan"
                className="about-img-shape"
                style={{ backgroundImage: 'url(/images/about/01.jpg)' }}
              />
            </Col>
            <Col lg={6}>
              <div className="ps-lg-5">
                <h6 className="text-theme mb-3">{t('about.title')}</h6>
                <h2 className="mb-4">{t('about.heading')}</h2>
                <p className="mb-4">{t('about.description1')}</p>
                <p className="mb-4">{t('about.description2')}</p>
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
              </div>
            </Col>
          </Row>
        </Container>
      </section>

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
