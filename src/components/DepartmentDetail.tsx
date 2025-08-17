'use client';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { Department, fetchDepartmentById, fetchDepartments } from '../utils/api';
import OptimizedImage from './OptimizedImage';
import { useLanguage } from '../contexts/LanguageContext';

interface DepartmentDetailProps {
  departmentId: string;
}

const DepartmentDetail: React.FC<DepartmentDetailProps> = ({ departmentId }) => {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [department, setDepartment] = useState<Department | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        setLoading(true);
        setError(null);
        const abortController = new AbortController();
        
        const departmentData = await fetchDepartmentById(parseInt(departmentId), language, abortController.signal);
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
  }, [departmentId, language]);

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

  // Loading state
  if (loading) {
    return (
      <section className="primary-bg text-white py-5">
        <Container>
          <Row>
            <Col>
              <Button 
                variant="outline-light" 
                onClick={() => router.push('/')}
                className="mb-3"
              >
                <i className="bi bi-arrow-left me-2"></i>
                Quay lại Trang chủ
              </Button>
              
              <div className="text-center py-5">
                <Spinner animation="border" role="status" className="mb-3">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p>{t('organization.loading')}</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    );
  }

  // Error state
  if (error || !department) {
    return (
      <section className="primary-bg text-white py-5">
        <Container>
          <Row>
            <Col>
              <Button 
                variant="outline-light" 
                onClick={() => router.push('/')}
                className="mb-3"
              >
                <i className="bi bi-arrow-left me-2"></i>
                Quay lại Trang chủ
              </Button>
              
              <Alert variant="danger">
                <Alert.Heading>{t('organization.error')}</Alert.Heading>
                <p>{error || t('organization.departmentNotFound')}</p>
              </Alert>
            </Col>
          </Row>
        </Container>
      </section>
    );
  }

  return (
    <>
      {/* Header Section */}
      <section className="primary-bg text-white py-5">
        <Container>
          <Row>
            <Col>
              <Button 
                variant="outline-light" 
                onClick={() => router.push('/')}
                className="mb-3"
              >
                <i className="bi bi-arrow-left me-2"></i>
                Quay lại Trang chủ
              </Button>
              
              <div className="d-flex align-items-center">
                <div className="me-4">
                  <i className="bi bi-building" style={{ fontSize: '3rem' }}></i>
                </div>
                <div>
                  <h2 className="mb-2 department-title">{department.name}</h2>
                  {department.code && (
                    <Badge bg="light" text="dark" className="mb-2">
                      {department.code}
                    </Badge>
                  )}
                  {department.description && (
                    <p className="mb-0 opacity-75">{department.description}</p>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Main Content */}
      <section className="py-5">
        <Container>
          <Row>
            {/* Left Sidebar - Department Navigation */}
            <Col lg={3} md={4} className="mb-4">
              <div className="department-sidebar">
                <Card>
                  <Card.Header>
                    <h5>
                      <i className="bi bi-building me-2"></i>
                      {t('organization.departmentList')}
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    {departmentsLoading ? (
                      <div className="loading-state">
                        <Spinner animation="border" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </Spinner>
                        <p className="small text-muted mt-2">{t('organization.loading')}</p>
                      </div>
                    ) : departments.length > 0 ? (
                      <div className="list-group list-group-flush">
                        {departments.map((dept) => (
                          <button
                            key={dept.id}
                            className={`list-group-item list-group-item-action d-flex align-items-center ${
                              dept.id === parseInt(departmentId) ? 'active' : ''
                            }`}
                            onClick={() => {
                              if (dept.id !== parseInt(departmentId)) {
                                router.push(`/organization/${dept.id}`);
                              }
                            }}
                            disabled={dept.id === parseInt(departmentId)}
                          >
                            <div className="department-icon">
                              <i className="bi bi-building"></i>
                            </div>
                            <div className="department-info">
                              <h6>{dept.name}</h6>
                              {dept.code && (
                                <small>{dept.code}</small>
                              )}
                            </div>
                            <div className="department-status">
                              {dept.id === parseInt(departmentId) && (
                                <i className="bi bi-check-circle"></i>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-state">
                        <i className="bi bi-exclamation-triangle"></i>
                        <p>{t('organization.noData')}</p>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </div>
            </Col>

            {/* Center Content - Department Information */}
            <Col lg={9} md={8} className="department-main-content">
              {/* Department Introduction */}
              {department.content && (
                <Card className="mb-4">
                  <Card.Body>
                    <h3 className="mb-3">
                      {t('organization.departmentIntro')}
                    </h3>
                    <div 
                      dangerouslySetInnerHTML={{ __html: department.content }}
                      className="department-content"
                      style={{ 
                        maxWidth: '100%', 
                        overflowWrap: 'break-word',
                        wordWrap: 'break-word'
                      }}
                    />
                  </Card.Body>
                </Card>
              )}

              {/* Media Section */}
              {(department.image || department.video_url) && (
                <Card className="mb-4">
                  <Card.Body>
                    <h3 className="mb-3">
                      {t('organization.imagesVideos')}
                    </h3>
                    
                    {/* Image */}
                    {department.image && (
                      <div className="mb-4">
                        <h5 className="mb-3">
                          {t('organization.image')}
                        </h5>
                        <OptimizedImage
                          src={department.image}
                          alt={department.name}
                          className="img-fluid rounded"
                          style={{ maxHeight: '400px', objectFit: 'cover' }}
                        />
                      </div>
                    )}

                    {/* Video */}
                    {department.video_url && (
                      <div>
                        <h5 className="mb-3">
                          {t('organization.video')}
                        </h5>
                        <div className="ratio ratio-16x9">
                          <iframe
                            src={department.video_url}
                            title={department.name}
                            allowFullScreen
                            className="rounded"
                          ></iframe>
                        </div>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              )}

              {/* Contact Information Section */}
              <Card className="mb-5" style={{ position: 'relative', zIndex: 2 }}>
                <Card.Body>
                  <h4 className="mb-3">
                    {t('organization.contactInformation')}
                  </h4>
                  
                  <Row>
                    <Col md={6}>
                      {(department.contact_email || department.contact_phone || department.contact_address) ? (
                        <div>
                          {department.contact_email && (
                            <div className="mb-3">
                              <h6 className="text-theme mb-2">
                                <i className="bi bi-envelope me-2"></i>
                                {t('organization.email')}
                              </h6>
                              <a 
                                href={`mailto:${department.contact_email}`}
                                className="text-decoration-none"
                              >
                                {department.contact_email}
                              </a>
                            </div>
                          )}

                          {department.contact_phone && (
                            <div className="mb-3">
                              <h6 className="text-theme mb-2">
                                <i className="bi bi-telephone me-2"></i>
                                {t('organization.phone')}
                              </h6>
                              <a 
                                href={`tel:${department.contact_phone}`}
                                className="text-decoration-none"
                              >
                                {department.contact_phone}
                              </a>
                            </div>
                          )}

                          {department.contact_address && (
                            <div className="mb-3">
                              <h6 className="text-theme mb-2">
                                <i className="bi bi-geo-alt me-2"></i>
                                {t('organization.address')}
                              </h6>
                              <p className="mb-0">{department.contact_address}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-muted">
                          {t('organization.contactNotAvailable')}
                        </p>
                      )}
                    </Col>
                    
                    <Col md={6}>
                      {/* General Contact */}
                      <div>
                        <h6 className="text-theme mb-2">
                          {t('organization.generalContact')}
                        </h6>
                        <p className="small text-muted mb-2">
                          {t('organization.generalContactDesc')}
                        </p>
                        <div className="small">
                          <div className="mb-1">
                            <strong>Email:</strong> viencongnghe@ritm.vn
                          </div>
                          <div className="mb-1">
                            <strong>Phone:</strong> +84 243 776 3322
                          </div>
                          <div>
                            <strong>Address:</strong> Tòa nhà 8 tầng, số 25, Vũ Ngọc Phan, Hà Nội
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Additional Information */}
      <section className="light-bg py-5" style={{ marginTop: '2rem', marginBottom: '3rem', position: 'relative', zIndex: 1 }}>
        <Container>
          <Row className="text-center">
            <Col lg={8} className="mx-auto">
              <h3 className="mb-4">
                {t('organization.haveQuestions')}
              </h3>
              <p className="mb-4">
                {t('organization.haveQuestionsDesc')}
              </p>
              <div>
                <Button 
                  variant="primary" 
                  href="/contact" 
                  className="me-3"
                >
                  {t('contact.form.sendMessage')}
                </Button>
                <Button 
                  variant="outline-primary" 
                  onClick={() => router.back()}
                >
                  {t('organization.backToDepartments')}
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default DepartmentDetail;
