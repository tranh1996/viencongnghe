'use client';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { Department, fetchDepartmentBySlug, fetchDepartments } from '../utils/api';
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
      label: { vi: 'Trang chủ', en: 'Home' },
      href: '/'
    },
    {
      label: { vi: 'Cơ cấu tổ chức', en: 'Organization' },
      href: '/organization'
    },
    {
      label: { vi: department?.name || '', en: department?.name || '' },
      active: true
    }
  ];

  return (
    <>
      <Breadcrumb
        title={{ vi: department?.name || '', en: department?.name || '' }}
        items={breadcrumbItems}
      />

      {/* Main Content */}
      <section className="py-5">
        <Container>
          <Row>
            {/* Left Sidebar - Organizational Structure */}
            <Col lg={3} md={4} className="mb-4">
              <div className="widget widget-categories">
                <h4 className="widget-title mb-3">CƠ CẤU TỔ CHỨC</h4>
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
                            fontWeight: dept.slug === departmentSlug ? '600' : '400'
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
              <div className="mt-4">
                <a href="/library" className="text-decoration-none">
                  <div className="page-title dark-bg text-white p-3 mb-3">
                    <h6 className="mb-0 text-white">Thư viện</h6>
                  </div>
                </a>
                
                <div className="row g-2">
                  <div className="col-6">
                    <div className="text-center">
                      <img 
                        src="/images/product/01.jpg" 
                        alt="Hình ảnh hoạt động"
                        className="img-fluid rounded mb-2"
                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                      />
                      <div className="small">Hình ảnh hoạt động</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-center">
                      <img 
                        src="/images/product/02.jpg" 
                        alt="Sản phẩm & Dịch vụ"
                        className="img-fluid rounded mb-2"
                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                      />
                      <div className="small">Sản phẩm & Dịch vụ</div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>

            {/* Right Main Content */}
            <Col lg={9} md={8}>
              {/* Department Header with Contact Button */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">{department.name}</h2>
                <Button 
                  variant="primary" 
                  href="/contact" 
                  className="px-4 py-2" 
                  style={{ 
                    minWidth: '120px',
                    backgroundColor: '#1253be',
                    borderColor: '#1253be'
                  }}
                >
                  Liên hệ
                </Button>
              </div>

              {/* Department Image */}
              {department.image && (
                <div className="mb-4">
                  <OptimizedImage
                    src={department.image}
                    alt={department.name}
                    className="img-fluid rounded"
                    style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
                  />
                </div>
              )}

              {/* Department Content */}
              {department.content && (
                <div className="mb-4">
                  <div 
                    dangerouslySetInnerHTML={{ __html: department.content }}
                    className="department-content"
                  />
                </div>
              )}

              {/* Achievements Section */}
              <div className="mb-4">
                <h5 className="mb-3">
                  Ghi nhận những nỗ lực và cố gắng đó, trong những năm gần đây, Phòng đã được tặng các danh hiệu thi đua khen thưởng
                </h5>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <i className="bi bi-check-circle text-success me-2"></i>
                    Danh hiệu &ldquo;Tập thể lao động tiên tiến&rdquo; các năm 2016, 2017, 2019.
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle text-success me-2"></i>
                    Bằng khen của TGĐ Tổng Công ty VEAM: &ldquo;Đơn vị hoàn thành xuất sắc nhiệm vụ&rdquo; năm 2018.
                  </li>
                </ul>
              </div>

              {/* Activity Images Section */}
              <div className="mb-4">
                <h5 className="mb-3">Một số hình ảnh hoạt động của chúng tôi</h5>
                <Row className="g-3">
                  <Col md={4}>
                    <img 
                      src="/images/service/01.jpg" 
                      alt="Hoạt động 1"
                      className="img-fluid rounded"
                      style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                    />
                  </Col>
                  <Col md={4}>
                    <img 
                      src="/images/service/02.jpg" 
                      alt="Hoạt động 2"
                      className="img-fluid rounded"
                      style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                    />
                  </Col>
                  <Col md={4}>
                    <img 
                      src="/images/service/03.jpg" 
                      alt="Hoạt động 3"
                      className="img-fluid rounded"
                      style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                    />
                  </Col>
                </Row>
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
                <h5 className="mb-3 fw-bold">Thông tin liên hệ</h5>
                <Row>
                  <Col md={6} lg={3}>
                    <div className="d-flex align-items-start mb-3">
                      <i className="bi bi-geo-alt text-primary me-3 mt-1"></i>
                      <div>
                        <strong>Địa chỉ:</strong><br />
                        <span className="text-muted">Tòa nhà 8 tầng, số 25, Vũ Ngọc Phan, Hà Nội</span>
                      </div>
                    </div>
                  </Col>
                  <Col md={6} lg={3}>
                    <div className="d-flex align-items-start mb-3">
                      <i className="bi bi-envelope text-primary me-3 mt-1"></i>
                      <div>
                        <strong>Email:</strong><br />
                        <span className="text-muted">viencongnghe@ritm.vn</span>
                      </div>
                    </div>
                  </Col>
                  <Col md={6} lg={3}>
                    <div className="d-flex align-items-start mb-3">
                      <i className="bi bi-telephone text-primary me-3 mt-1"></i>
                      <div>
                        <strong>Điện thoại:</strong><br />
                        <span className="text-muted">+84 243 776 3322</span>
                      </div>
                    </div>
                  </Col>
                  <Col md={6} lg={3}>
                    <div className="d-flex align-items-start mb-3">
                      <i className="bi bi-printer text-primary me-3 mt-1"></i>
                      <div>
                        <strong>Fax:</strong><br />
                        <span className="text-muted">+84 243 835 9235</span>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default DepartmentDetail;
