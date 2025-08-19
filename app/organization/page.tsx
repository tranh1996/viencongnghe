'use client';

import type { Metadata } from 'next';
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert } from 'react-bootstrap';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import BannerSlider from '@/components/BannerSlider';
import { fetchDepartments, Department } from '@/utils/api';
import DepartmentDetail from '@/components/DepartmentDetail';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function OrganizationPage() {
  const { t, language } = useLanguage();
  const params = useParams<{ departmentSlug?: string }>();
  const departmentSlug = params?.departmentSlug;
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDepartmentSlug, setSelectedDepartmentSlug] = useState<string | null>(null);

  // Banner slides for organizational structure
  const bannerSlides = [
    {
      id: 1,
      image: '/images/banner/01.jpg',
      title: {
        vi: 'Cơ cấu tổ chức',
        en: 'Organizational Structure'
      },
      subtitle: {
        vi: 'Viện Công nghệ',
        en: 'Technology Institute'
      },
      description: {
        vi: 'Tổ chức khoa học, hiện đại với các phòng ban chuyên môn cao',
        en: 'Scientific and modern organization with highly specialized departments'
      },
      primaryButton: {
        text: {
          vi: 'Tìm hiểu thêm',
          en: 'Learn More'
        },
        link: '/about'
      },
      secondaryButton: {
        text: {
          vi: 'Liên hệ',
          en: 'Contact'
        },
        link: '/contact'
      }
    }
  ];

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchDepartments(language);
        setDepartments(data);
      } catch (err) {
        console.error('Error loading departments:', err);
        setError(err instanceof Error ? err.message : 'Failed to load departments');
      } finally {
        setLoading(false);
      }
    };

    loadDepartments();
  }, [language]);

  // Handle department slug from URL
  useEffect(() => {
    if (departmentSlug) {
      setSelectedDepartmentSlug(departmentSlug);
    } else {
      setSelectedDepartmentSlug(null);
    }
  }, [departmentSlug]);

  const handleDepartmentClick = (department: Department) => {
    router.push(`/organization/${department.slug}`);
  };

  const handleBackToList = () => {
    router.push('/organization');
  };

  // If a department is selected, show its detail view
  if (selectedDepartmentSlug) {
    return (
      <DepartmentDetail 
        departmentSlug={selectedDepartmentSlug} 
      />
    );
  }

  return (
    <>
      {/* Banner Slider */}
      <BannerSlider slides={bannerSlides} />

      {/* Organizational Structure Overview */}
      <section className="light-bg py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col lg={8} className="mx-auto">
              <h6 className="text-theme mb-3">{t('nav.organization')}</h6>
              <h2 className="mb-4">
                {t('organization.title')}
              </h2>
              <p>
                {t('organization.description')}
              </p>
            </Col>
          </Row>

          {/* Loading State */}
          {loading && (
            <Row className="text-center">
              <Col>
                <Spinner animation="border" role="status" className="mb-3">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p>{t('organization.loading')}</p>
              </Col>
            </Row>
          )}

          {/* Error State */}
          {error && (
            <Row>
              <Col>
                <Alert variant="danger">
                  <Alert.Heading>
                    {t('organization.error')}
                  </Alert.Heading>
                  <p>{error}</p>
                </Alert>
              </Col>
            </Row>
          )}

          {/* Departments List */}
          {!loading && !error && departments.length > 0 && (
            <Row>
              {departments.map((department) => (
                <Col lg={6} md={6} className="mb-4" key={department.id}>
                  <Card 
                    className="h-100 org-unit-card department-card"
                    onClick={() => handleDepartmentClick(department)}
                    style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <Card.Body>
                      <div className="d-flex align-items-start mb-3">
                        <div className="org-icon me-3">
                          <i className="bi bi-building"></i>
                        </div>
                        <div className="flex-grow-1">
                          <h5 className="card-title mb-2">{department.name}</h5>
                          {department.code && (
                            <Badge bg="secondary" className="mb-2">
                              {department.code}
                            </Badge>
                          )}
                          {department.description && (
                            <p className="card-text text-muted mb-3">
                              {department.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Contact Information Preview */}
                      {(department.contact_email || department.contact_phone || department.contact_address) && (
                        <div className="contact-preview">
                          <h6 className="text-theme mb-2">
                            {t('organization.contactInfo')}
                          </h6>
                          <div className="small text-muted">
                            {department.contact_email && (
                              <div className="mb-1">
                                <i className="bi bi-envelope me-2"></i>
                                {department.contact_email}
                              </div>
                            )}
                            {department.contact_phone && (
                              <div className="mb-1">
                                <i className="bi bi-telephone me-2"></i>
                                {department.contact_phone}
                              </div>
                            )}
                            {department.contact_address && (
                              <div className="mb-1">
                                <i className="bi bi-geo-alt me-2"></i>
                                {department.contact_address}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* View Details Button */}
                      <div className="text-center mt-3">
                        <Badge bg="primary" className="px-3 py-2">
                          {t('organization.viewDetails')}
                          <i className="bi bi-arrow-right ms-2"></i>
                        </Badge>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          {/* No Departments Found */}
          {!loading && !error && departments.length === 0 && (
            <Row className="text-center">
              <Col>
                <Alert variant="info">
                  <Alert.Heading>
                    {t('organization.noData')}
                  </Alert.Heading>
                  <p>
                    {t('organization.noDataMessage')}
                  </p>
                </Alert>
              </Col>
            </Row>
          )}
        </Container>
      </section>

      {/* Contact CTA */}
      <section className="primary-bg text-white">
        <Container>
          <Row className="text-center">
            <Col lg={8} className="mx-auto">
              <h2 className="mb-4">
                {t('contact.title')}
              </h2>
              <p className="mb-4">
                {t('contact.description')}
              </p>
              <a href="/contact" className="themeht-btn secondary-btn me-3">
                {t('contact.form.sendMessage')}
              </a>
              <a href="/about" className="themeht-btn primary-btn">
                {t('home.about.readMore')}
              </a>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}
