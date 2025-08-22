'use client';

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useLanguage } from '@/contexts/LanguageContext';
import Breadcrumb from '@/components/Breadcrumb';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function LibraryPage() {
  const { t } = useLanguage();

  const breadcrumbItems = [
    {
      label: { vi: 'Trang chủ', en: 'Home' },
      href: '/'
    },
    {
      label: { vi: 'Thư viện', en: 'Library' },
      active: true
    }
  ];

  return (
    <>
      <Breadcrumb
        title={{ vi: 'Thư viện', en: 'Library' }}
        items={breadcrumbItems}
      />

      <section>
        <Container>
          <Row className="text-center mb-5">
            <Col lg={8} className="mx-auto">
              <h6 className="text-theme mb-3">Thư viện</h6>
              <h2 className="mb-4">Hình ảnh hoạt động</h2>
              <p>
                Khám phá những hình ảnh về các hoạt động, dự án và sự kiện của Viện Công nghệ 
                trong suốt quá trình hoạt động và phát triển.
              </p>
            </Col>
          </Row>

          {/* Activity Images */}
          <Row>
            <Col lg={4} md={6} className="mb-4">
              <div className="card">
                <img src="/images/about/01.jpg" className="card-img-top" alt="Hoạt động nghiên cứu" />
                <div className="card-body">
                  <h5 className="card-title">Hoạt động nghiên cứu</h5>
                  <p className="card-text">
                    Các hoạt động nghiên cứu và phát triển công nghệ tại Viện Công nghệ.
                  </p>
                </div>
              </div>
            </Col>

            <Col lg={4} md={6} className="mb-4">
              <div className="card">
                <img src="/images/about/02.jpg" className="card-img-top" alt="Phòng thí nghiệm" />
                <div className="card-body">
                  <h5 className="card-title">Phòng thí nghiệm</h5>
                  <p className="card-text">
                    Hệ thống phòng thí nghiệm hiện đại với các thiết bị tiên tiến.
                  </p>
                </div>
              </div>
            </Col>

            <Col lg={4} md={6} className="mb-4">
              <div className="card">
                <img src="/images/about/03.jpg" className="card-img-top" alt="Sản xuất" />
                <div className="card-body">
                  <h5 className="card-title">Sản xuất</h5>
                  <p className="card-text">
                    Quy trình sản xuất và chế tạo các sản phẩm cơ khí.
                  </p>
                </div>
              </div>
            </Col>

            <Col lg={4} md={6} className="mb-4">
              <div className="card">
                <img src="/images/about/04.jpg" className="card-img-top" alt="Đào tạo" />
                <div className="card-body">
                  <h5 className="card-title">Đào tạo</h5>
                  <p className="card-text">
                    Các khóa đào tạo và chuyển giao công nghệ cho doanh nghiệp.
                  </p>
                </div>
              </div>
            </Col>

            <Col lg={4} md={6} className="mb-4">
              <div className="card">
                <img src="/images/about/05.jpg" className="card-img-top" alt="Hội thảo" />
                <div className="card-body">
                  <h5 className="card-title">Hội thảo</h5>
                  <p className="card-text">
                    Các hội thảo khoa học và sự kiện chuyên môn.
                  </p>
                </div>
              </div>
            </Col>

            <Col lg={4} md={6} className="mb-4">
              <div className="card">
                <img src="/images/about/06.jpg" className="card-img-top" alt="Triển lãm" />
                <div className="card-body">
                  <h5 className="card-title">Triển lãm</h5>
                  <p className="card-text">
                    Tham gia các triển lãm công nghệ và giới thiệu sản phẩm.
                  </p>
                </div>
              </div>
            </Col>
          </Row>

          {/* Video Section */}
          <section className="mt-5">
            <Row className="text-center mb-4">
              <Col>
                <h3>{t('library.video.title')}</h3>
              </Col>
            </Row>
            <Row>
              <Col lg={6} className="mb-4">
                <div className="card">
                  <div className="card-body text-center">
                    <div className="mb-3">
                      <i className="bi bi-play-circle text-theme" style={{ fontSize: '4rem' }}></i>
                    </div>
                    <h5 className="card-title">{t('library.video.introduction')}</h5>
                    <p className="card-text">
                      {t('library.video.introduction')} - {t('library.description')}
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
                      {t('library.video.production')} - {t('library.description')}
                    </p>
                    <a href="#" className="themeht-btn primary-btn">
                      {t('library.video.watch')}
                    </a>
                  </div>
                </div>
              </Col>
            </Row>
          </section>

          {/* Gallery Section */}
          <section className="light-bg mt-5">
            <Row className="text-center mb-4">
              <Col>
                <h3>{t('library.gallery.title')}</h3>
              </Col>
            </Row>
            <Row>
              <Col lg={3} md={4} sm={6} className="mb-3">
                <img src="/images/team/01.jpg" className="img-fluid rounded" alt="Hoạt động 1" />
              </Col>
              <Col lg={3} md={4} sm={6} className="mb-3">
                <img src="/images/team/02.jpg" className="img-fluid rounded" alt="Hoạt động 2" />
              </Col>
              <Col lg={3} md={4} sm={6} className="mb-3">
                <img src="/images/team/03.jpg" className="img-fluid rounded" alt="Hoạt động 3" />
              </Col>
              <Col lg={3} md={4} sm={6} className="mb-3">
                <img src="/images/team/04.jpg" className="img-fluid rounded" alt="Hoạt động 4" />
              </Col>
              <Col lg={3} md={4} sm={6} className="mb-3">
                <img src="/images/team/05.jpg" className="img-fluid rounded" alt="Hoạt động 5" />
              </Col>
              <Col lg={3} md={4} sm={6} className="mb-3">
                <img src="/images/team/06.jpg" className="img-fluid rounded" alt="Hoạt động 6" />
              </Col>
              <Col lg={3} md={4} sm={6} className="mb-3">
                <img src="/images/team/07.jpg" className="img-fluid rounded" alt="Hoạt động 7" />
              </Col>
              <Col lg={3} md={4} sm={6} className="mb-3">
                <img src="/images/team/08.jpg" className="img-fluid rounded" alt="Hoạt động 8" />
              </Col>
            </Row>
          </section>
        </Container>
      </section>
    </>
  );
}
