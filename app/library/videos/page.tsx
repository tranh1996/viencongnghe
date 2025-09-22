'use client';

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useLanguage } from '@/contexts/LanguageContext';
import Breadcrumb from '@/components/Breadcrumb';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function LibraryVideosPage() {
  const { t } = useLanguage();

  const breadcrumbItems = [
    {
      label: { vi: 'Trang chủ', en: 'Home' },
      href: '/'
    },
    {
      label: { vi: 'Thư viện', en: 'Library' },
      href: '/library'
    },
    {
      label: { vi: 'Video hoạt động', en: 'Activity Videos' },
      active: true
    }
  ];

  return (
    <>
      <Breadcrumb
        title={{ vi: 'Video hoạt động', en: 'Activity Videos' }}
        items={breadcrumbItems}
      />

      <section>
        <Container>
          <Row className="text-center mb-5">
            <Col lg={8} className="mx-auto">
              <h6 className="text-theme mb-3">{t('nav.library')}</h6>
              <h2 className="mb-4">{t('nav.library.videos')}</h2>
              <p>
                {t('library.description')} - Xem các video giới thiệu về hoạt động và quy trình làm việc của Viện Công nghệ.
              </p>
            </Col>
          </Row>

          {/* Video Section */}
          <Row>
            <Col lg={6} className="mb-4">
              <div className="card">
                <div className="card-body text-center">
                  <div className="mb-3">
                    <i className="bi bi-play-circle text-theme" style={{ fontSize: '4rem' }}></i>
                  </div>
                  <h5 className="card-title">{t('library.video.introduction')}</h5>
                  <p className="card-text">
                    Video giới thiệu tổng quan về Viện Công nghệ, các hoạt động nghiên cứu và phát triển công nghệ.
                  </p>
                  <a href="#" className="themeht-btn primary-btn">
                    {t('library.video.watch')}
                  </a>
                </div>
              </div>
            </Col>

            <Col lg={6} className="mb-4">
              <div className="card">
                <div className="card-body text-center">
                  <div className="mb-3">
                    <i className="bi bi-play-circle text-theme" style={{ fontSize: '4rem' }}></i>
                  </div>
                  <h5 className="card-title">{t('library.video.production')}</h5>
                  <p className="card-text">
                    Video giới thiệu quy trình sản xuất và chế tạo các sản phẩm cơ khí tại Viện Công nghệ.
                  </p>
                  <a href="#" className="themeht-btn primary-btn">
                    {t('library.video.watch')}
                  </a>
                </div>
              </div>
            </Col>

            <Col lg={6} className="mb-4">
              <div className="card">
                <div className="card-body text-center">
                  <div className="mb-3">
                    <i className="bi bi-play-circle text-theme" style={{ fontSize: '4rem' }}></i>
                  </div>
                  <h5 className="card-title">Hoạt động nghiên cứu</h5>
                  <p className="card-text">
                    Video về các hoạt động nghiên cứu khoa học và phát triển công nghệ mới.
                  </p>
                  <a href="#" className="themeht-btn primary-btn">
                    {t('library.video.watch')}
                  </a>
                </div>
              </div>
            </Col>

            <Col lg={6} className="mb-4">
              <div className="card">
                <div className="card-body text-center">
                  <div className="mb-3">
                    <i className="bi bi-play-circle text-theme" style={{ fontSize: '4rem' }}></i>
                  </div>
                  <h5 className="card-title">Phòng thí nghiệm</h5>
                  <p className="card-text">
                    Video giới thiệu hệ thống phòng thí nghiệm hiện đại với các thiết bị tiên tiến.
                  </p>
                  <a href="#" className="themeht-btn primary-btn">
                    {t('library.video.watch')}
                  </a>
                </div>
              </div>
            </Col>

            <Col lg={6} className="mb-4">
              <div className="card">
                <div className="card-body text-center">
                  <div className="mb-3">
                    <i className="bi bi-play-circle text-theme" style={{ fontSize: '4rem' }}></i>
                  </div>
                  <h5 className="card-title">Đào tạo và chuyển giao</h5>
                  <p className="card-text">
                    Video về các hoạt động đào tạo và chuyển giao công nghệ cho doanh nghiệp.
                  </p>
                  <a href="#" className="themeht-btn primary-btn">
                    {t('library.video.watch')}
                  </a>
                </div>
              </div>
            </Col>

            <Col lg={6} className="mb-4">
              <div className="card">
                <div className="card-body text-center">
                  <div className="mb-3">
                    <i className="bi bi-play-circle text-theme" style={{ fontSize: '4rem' }}></i>
                  </div>
                  <h5 className="card-title">Hội thảo khoa học</h5>
                  <p className="card-text">
                    Video các hội thảo khoa học và sự kiện chuyên môn của Viện Công nghệ.
                  </p>
                  <a href="#" className="themeht-btn primary-btn">
                    {t('library.video.watch')}
                  </a>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}