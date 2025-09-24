'use client';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { Department, fetchDepartmentBySlug, fetchDepartments, fetchContactSettingsCached, ContactSettings } from '../utils/api';
import OptimizedImage from './OptimizedImage';
import { useLanguage } from '../contexts/LanguageContext';
import Breadcrumb from './Breadcrumb';

interface DepartmentDetailProps {
  departmentSlug: string;
}

const DepartmentDetail: React.FC<DepartmentDetailProps> = ({ departmentSlug }) => {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [department, setDepartment] = useState<Department | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [contactSettings, setContactSettings] = useState<ContactSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        setLoading(true);
        setError(null);
        const abortController = new AbortController();
        
        const departmentData = await fetchDepartmentBySlug(departmentSlug, language, abortController.signal);
        setDepartment(departmentData);
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDepartment();
  }, [departmentSlug, language]);

  // Fetch all departments for sidebar
  useEffect(() => {
    const fetchAllDepartments = async () => {
      try {
        setDepartmentsLoading(true);
        const abortController = new AbortController();
        
        const departmentsData = await fetchDepartments(language, abortController.signal);
        setDepartments(departmentsData);
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('Error fetching departments:', err);
        }
      } finally {
        setDepartmentsLoading(false);
      }
    };

    fetchAllDepartments();
  }, [language]);

  // Fetch contact settings
  useEffect(() => {
    const loadContactSettings = async () => {
      try {
        const contactData = await fetchContactSettingsCached(language);
        setContactSettings(contactData);
      } catch (error) {
        console.error('Error fetching contact settings:', error);
        // Set fallback data if API fails
        setContactSettings({
          company_info: {
            company_name: "VIỆN CÔNG NGHỆ",
            company_subtitle: "Institute of Technology",
            address_main: "Tòa nhà 8 tầng, số 25, Vũ Ngọc Phan, Hà Nội",
            address_branch: "Lô 27B, khu Công nghiệp Quang Minh, Mê Linh, Hà Nội",
            email: "viencongnghe@ritm.vn",
            phone: "+84 243 776 3322",
            fax: "+84 243 835 9235",
            website: "www.viencongnghe.vn",
            tax_code: "",
            business_license: ""
          },
          social_media: {
            facebook_link: "",
            instagram_link: "",
            linkedin_link: ""
          },
          map_settings: {
            google_map_embed: ""
          }
        });
      }
    };

    loadContactSettings();
  }, [language]);

  // Loading state
  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status" className="mb-3">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>{t('organization.loading')}</p>
      </div>
    );
  }

  // Error state
  if (error || !department) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>{t('organization.error')}</Alert.Heading>
          <p>{error || t('organization.departmentNotFound')}</p>
        </Alert>
      </Container>
    );
  }

  const breadcrumbItems = [
    {
      label: { vi: t('nav.home'), en: t('nav.home') },
      href: '/'
    },
    {
      label: { vi: t('nav.organization'), en: t('nav.organization') },
      href: '/organization'
    },
    {
      label: { vi: department?.name || '', en: department?.name || '' },
      active: true
    }
  ];

  return (
    <>
      <style jsx>{`
        .animated-widget {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .animated-widget:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px 10px rgba(115, 113, 255, .15) !important;
        }
        .widget {
            background: white;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 1.5rem;
            align-items: center;
        }
      `}</style>
      <Breadcrumb
        title={{ vi: department?.name || '', en: department?.name || '' }}
        backgroundImage="/images/bg/bg__banner-02.webp"
        items={breadcrumbItems}
      />

      {/* Main Content */}
      <section className="py-5">
        <Container>
          <Row>
            {/* Left Sidebar - Organizational Structure */}
            <Col lg={3} md={4} className="mb-4">
              <div 
                className="widget widget-categories"
                style={{
                  boxShadow: '0 10px 30px 5px rgba(115, 113, 255, .06)',
                  padding: '10px',
                  borderRadius: '24px',
                  marginBottom: '50px',
                  background: 'var(--themeht-white-color)'
                }}
              >
                <h4 className="widget-title mb-3 fw-bold">{t('organization.title')}</h4>
                  <hr/>
                {departmentsLoading ? (
                  <div className="text-center py-3">
                    <Spinner animation="border" size="sm" />
                  </div>
                ) : (
                  <ul className="widget-categories list-unstyled">
                    {departments.map((dept) => (
                      <li key={dept.id}>
                        <a
                          href={`/organization/${dept.slug}`}
                          className={`d-flex align-items-center justify-content-between text-decoration-none py-2 ${
                            dept.slug === departmentSlug ? 'active' : ''
                          }`}
                          style={{
                            borderBottom: '1px dashed #e0e0e0',
                            color: dept.slug === departmentSlug ? '#1253be' : '#6c757d',
                            transition: 'all 0.3s ease',
                            fontWeight: dept.slug === departmentSlug ? '700' : '600'
                          }}
                          onMouseEnter={(e) => {
                            if (dept.slug !== departmentSlug) {
                              const linkElement = e.currentTarget as HTMLElement;
                              linkElement.style.color = '#1253be';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (dept.slug !== departmentSlug) {
                              const linkElement = e.currentTarget as HTMLElement;
                              linkElement.style.color = '#6c757d';
                            }
                          }}
                        >
                          <div className="d-flex align-items-center">
                            <span 
                              style={{ 
                                width: '6px', 
                                height: '6px', 
                                borderRadius: '50%', 
                                backgroundColor: '#1253be',
                                marginRight: '10px',
                                flexShrink: 0
                              }}
                            ></span>
                            <span>{dept.name}</span>
                          </div>
                          <i className="bi bi-chevron-right ms-1" style={{ fontSize: '14px', color: '#1253be' }}></i>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Library Sections */}
              <div
                  className="widget animated-widget clickable-widget"
                  style={{
                    boxShadow: '0 10px 30px 5px rgba(115, 113, 255, .06)',
                    borderRadius: '24px',
                    marginBottom: '10px',
                    background: 'linear-gradient(135deg, rgba(0,0,0,0.1), rgba(0,0,0,0.5)), url("/images/blog/bg-01.webp")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer'
                  }}
                  onClick={() => window.location.href = '/library'}
              >
                <div
                    className="animated-bg"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                      animation: 'pulse 3s ease-in-out infinite'
                    }}
                />
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <h6 className="widget-title fw-bold text-white mb-0">
                    <i className="bi bi-images me-2"></i>
                    {language === 'vi' ? 'Hình ảnh hoạt động' : 'Activity Gallery'}
                  </h6>
                </div>
              </div>

              {/* Animated Products & Services Widget */}
              <div
                  className="widget animated-widget clickable-widget"
                  style={{
                    boxShadow: '0 10px 30px 5px rgba(115, 113, 255, .06)',
                    borderRadius: '24px',
                    marginBottom: '50px',
                    background: 'linear-gradient(135deg, rgba(0,0,0,0.1), rgba(0,0,0,0.5)), url("/images/blog/bg-02.webp")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer'
                  }}
                  onClick={() => window.location.href = '/products'}
              >
                <div
                    className="animated-bg"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                      animation: 'pulse 3s ease-in-out infinite'
                    }}
                />
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <h6 className="widget-title fw-bold text-white mb-0">
                    <i className="bi bi-box-seam me-2"></i>
                    {language === 'vi' ? 'Sản phẩm & Dịch vụ' : 'Products & Services'}
                  </h6>
                  <p className="text-white-50 mb-0">
                  </p>
                </div>
              </div>
            </Col>

            {/* Right Main Content */}
            <Col lg={9} md={8}>
              <div className="bg-white border rounded p-4 shadow-sm h-100">
                {/* Department Header with Contact Button */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="mb-0 fw-bold text-uppercase">{department.name}</h4>
                </div>

                {/* Department Image */}
                {department.image_url && (
                    <div className="mb-4">
                      <OptimizedImage
                          src={department.image_url}
                          alt={department.name}
                          className="img-fluid rounded"
                          style={{width: '100%', maxHeight: '400px', objectFit: 'cover'}}
                      />
                    </div>
                )}

                {/* Department Content */}
                {department.content && (
                    <div className="mb-4">
                      <div
                          dangerouslySetInnerHTML={{__html: department.content}}
                          className="department-content"
                      />
                    </div>
                )}

                {/* Achievements Section */}
                <div className="mb-4">
                  <h5 className="mb-3">
                    {t('organization.achievements.title')}
                  </h5>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      {t('organization.achievements.award1')}
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      {t('organization.achievements.award2')}
                    </li>
                  </ul>
                </div>

                {/* Activity Images Section */}
                {department.gallery_images && department.gallery_images.length > 0 && (
                    <div className="mb-4">
                      <h5 className="mb-3">{t('organization.activityImages.title')}</h5>
                      <Row className="g-3">
                        {department.gallery_images.map((image: string, index: number) => (
                            <Col md={4} key={index}>
                              <OptimizedImage
                                  src={image}
                                  alt={`${department.name} ${t('organization.activityImages.title')} ${index + 1}`}
                                  className="img-fluid rounded"
                                  style={{width: '100%', height: '150px', objectFit: 'cover'}}
                              />
                            </Col>
                        ))}
                      </Row>
                    </div>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      {/* Footer Contact Information */}
      <section className="py-4">
        <Container>
          <Row>
            <Col lg={3} md={4}></Col>
            <Col lg={9} md={8}>
              <div className="bg-white border rounded p-4 shadow-sm">
                <h5 className="mb-3 fw-bold">{t('contact.info.title')}</h5>
                <div>
                  <div className="d-flex align-items-start mb-3">
                    <i className="bi bi-geo-alt text-primary me-3 mt-1"></i>
                    <div>
                    <strong>{t('contact.info.address')}:</strong>
                      <span className="text-muted ms-2">{contactSettings?.company_info.address_main || 'Tòa nhà 8 tầng, số 25, Vũ Ngọc Phan, Hà Nội'}</span>
                    </div>
                  </div>

                  <div className="d-flex align-items-start mb-3">
                    <i className="bi bi-envelope text-primary me-3 mt-1"></i>
                    <div>
                      <strong>{t('contact.info.email')}:</strong>
                      <span className="text-muted ms-2">{contactSettings?.company_info.email || 'viencongnghe@ritm.vn'}</span>
                    </div>
                  </div>

                  <div className="d-flex align-items-start mb-3">
                    <i className="bi bi-telephone text-primary me-3 mt-1"></i>
                    <div>
                      <strong>{t('contact.info.phone')}:</strong>
                      <span className="text-muted ms-2">{contactSettings?.company_info.phone || '+84 243 776 3322'}</span>
                    </div>
                  </div>

                  <div className="d-flex align-items-start mb-0">
                    <i className="bi bi-printer text-primary me-3 mt-1"></i>
                    <div>
                      <strong>{t('contact.info.fax')}:</strong>
                      <span className="text-muted ms-2">{contactSettings?.company_info.fax || '+84 243 835 9235'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default DepartmentDetail;
