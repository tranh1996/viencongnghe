'use client';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useLanguage } from '@/contexts/LanguageContext';
import Breadcrumb from '@/components/Breadcrumb';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface ContactSettings {
  company_info: {
    company_name: string;
    company_subtitle: string;
    address_main: string;
    address_branch: string;
    email: string;
    phone: string;
    fax: string;
  };
  social_media: {
    facebook_link: string;
    instagram_link: string;
    linkedin_link: string;
  };
  map_settings: {
    google_map_embed: string;
  };
}

export default function ContactPage() {
  const { t, language } = useLanguage();
  const [contactSettings, setContactSettings] = useState<ContactSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    subject: '',
    message: '',
    department: ''
  });
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  useEffect(() => {
    fetchContactSettings();
  }, []);

  const fetchContactSettings = async () => {
    try {
      const response = await fetch('/api/contact-settings');
      const data = await response.json();
      if (data.success) {
        setContactSettings(data.data);
      }
    } catch (error) {
      console.error('Error fetching contact settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus({ type: null, message: '' });
    
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        setSubmitStatus({
          type: 'success',
          message: t('contact.form.successMessage')
        });
        handleReset();
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.message || t('contact.form.errorMessage')
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({
        type: 'error',
        message: t('contact.form.errorMessage')
      });
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      subject: '',
      message: '',
      department: ''
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    {
      label: { vi: t('nav.home'), en: t('nav.home') },
      href: '/'
    },
    {
      label: { vi: t('nav.contact'), en: t('nav.contact') },
      active: true
    }
  ];

  return (
    <>
      <Breadcrumb
        title={{ vi: t('nav.contact'), en: t('nav.contact') }}
        items={breadcrumbItems}
      />
      <div className="page-content">
        {/* Contact Info Section */}
        <section className="py-5">
          <Container>
            <Row className="g-4">
              {/* Main Office */}
              <Col lg={4} md={6}>
                <div className="contact-info-card h-100">
                  <div className="contact-info-header">
                    <div className="contact-icon">
                      <i className="bi bi-building"></i>
                    </div>
                    <h4>{t('contact.info.mainOffice')}</h4>
                  </div>
                  <div className="contact-details">
                    <div className="contact-item">
                      <i className="bi bi-geo-alt text-primary"></i>
                      <div>
                        <span className="contact-label">{t('contact.info.address')}</span>
                        <p className="contact-text">{contactSettings?.company_info.address_main || 'Tòa nhà 8 tầng, số 25, Vũ Ngọc Phan, Hà Nội'}</p>
                      </div>
                    </div>
                    <div className="contact-item">
                      <i className="bi bi-envelope text-primary"></i>
                      <div>
                        <span className="contact-label">{t('contact.info.email')}</span>
                        <a href={`mailto:${contactSettings?.company_info.email || 'viencongnghe@ritm.vn'}`} className="contact-link">
                          {contactSettings?.company_info.email || 'viencongnghe@ritm.vn'}
                        </a>
                      </div>
                    </div>
                    <div className="contact-item">
                      <i className="bi bi-telephone text-primary"></i>
                      <div>
                        <span className="contact-label">{t('contact.info.phone')}</span>
                        <a href={`tel:${contactSettings?.company_info.phone || '+84243776332'}`} className="contact-link">
                          {contactSettings?.company_info.phone || '+84 243 776 3322'}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>

              {/* Branch Office */}
              <Col lg={4} md={6}>
                <div className="contact-info-card h-100">
                  <div className="contact-info-header">
                    <div className="contact-icon">
                      <i className="bi bi-buildings"></i>
                    </div>
                    <h4>{t('contact.info.branchOffice')}</h4>
                  </div>
                  <div className="contact-details">
                    <div className="contact-item">
                      <i className="bi bi-geo-alt text-primary"></i>
                      <div>
                        <span className="contact-label">{t('contact.info.address')}</span>
                        <p className="contact-text">{contactSettings?.company_info.address_branch || 'Lô 27B, khu Công nghiệp Quang Minh, Mê Linh, Hà Nội'}</p>
                      </div>
                    </div>
                    <div className="contact-item">
                      <i className="bi bi-envelope text-primary"></i>
                      <div>
                        <span className="contact-label">{t('contact.info.email')}</span>
                        <a href={`mailto:${contactSettings?.company_info.email || 'viencongnghe@ritm.vn'}`} className="contact-link">
                          {contactSettings?.company_info.email || 'viencongnghe@ritm.vn'}
                        </a>
                      </div>
                    </div>
                    <div className="contact-item">
                      <i className="bi bi-telephone text-primary"></i>
                      <div>
                        <span className="contact-label">{t('contact.info.phone')}</span>
                        <a href={`tel:${contactSettings?.company_info.phone || '+84243776332'}`} className="contact-link">
                          {contactSettings?.company_info.phone || '+84 243 776 3322'}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>

              {/* Additional Information */}
              <Col lg={4} md={12}>
                <div className="contact-info-card h-100">
                  <div className="contact-info-header">
                    <div className="contact-icon">
                      <i className="bi bi-info-circle"></i>
                    </div>
                    <h4>{t('contact.info.additional')}</h4>
                  </div>
                  <div className="contact-details">
                    <div className="contact-item">
                      <i className="bi bi-globe text-primary"></i>
                      <div>
                        <span className="contact-label">{t('contact.info.website')}</span>
                        <div className="contact-text">
                          <a href="https://www.viencongnghe.vn" target="_blank" rel="noopener noreferrer" className="contact-link d-block">
                            www.viencongnghe.vn
                          </a>
                          <a href="https://www.ritm.vn" target="_blank" rel="noopener noreferrer" className="contact-link d-block">
                            www.ritm.vn
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="contact-item">
                      <i className="bi bi-printer text-primary"></i>
                      <div>
                        <span className="contact-label">Fax</span>
                        <a href={`tel:${contactSettings?.company_info.fax || '+84243835923'}`} className="contact-link">
                          {contactSettings?.company_info.fax || '+84 243 835 9235'}
                        </a>
                      </div>
                    </div>
                    <div className="contact-item">
                      <i className="bi bi-clock text-primary"></i>
                      <div>
                        <span className="contact-label">{t('contact.info.workingHoursTitle')}</span>
                        <div className="contact-text">
                          <p className="mb-1">Thứ 2 - Thứ 6: 8:00 - 17:00</p>
                          <p className="mb-0">Thứ 7: 8:00 - 12:00</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Contact Form Section */}
        <section className="pt-0">
          <Container>
            <Row className="align-items-center">
              <Col lg={6} md={12} className="order-lg-1">
                <img className="img-fluid topBottom" src="/images/appointment-img.png" alt="Contact Us" />
              </Col>
              <Col lg={6} md={12} className="mt-10 mt-lg-0 pe-lg-10">
                <div className="box-shadow rounded p-5">
                  <div className="theme-title">
                    <h6>{t('contact.form.title')}</h6>
                  </div>

                  {/* Success/Error Messages */}
                  {submitStatus.type && (
                    <div className={`alert alert-${submitStatus.type === 'success' ? 'success' : 'danger'} mb-4`} role="alert">
                      <i className={`bi bi-${submitStatus.type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2`}></i>
                      {submitStatus.message}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="messages"></div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>{t('contact.form.fullName')}</label>
                          <input
                            type="text"
                            name="name"
                            className="form-control"
                            placeholder="Enter Your Name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>{t('contact.form.email')}</label>
                          <input
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="Enter Email Address"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>{t('contact.form.phone')}</label>
                          <input
                            type="tel"
                            name="phone"
                            className="form-control"
                            placeholder="Enter Phone number"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>{t('contact.form.subject')}</label>
                          <input
                            type="text"
                            name="subject"
                            className="form-control"
                            placeholder="Enter Subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-group">
                          <label>{t('contact.form.department')}</label>
                          <select
                            name="department"
                            className="form-control"
                            value={formData.department}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">{t('contact.form.departmentPlaceholder')}</option>
                            <option value="Phòng Nghiên cứu Vật liệu, Xử lý nhiệt và bề mặt">Phòng Nghiên cứu Vật liệu, Xử lý nhiệt và bề mặt</option>
                            <option value="Phòng Nghiên cứu Cơ khí">Phòng Nghiên cứu Cơ khí</option>
                            <option value="Phòng Nghiên cứu Tự động hóa">Phòng Nghiên cứu Tự động hóa</option>
                            <option value="Phòng Kỹ thuật Công nghệ">Phòng Kỹ thuật Công nghệ</option>
                            <option value="Phòng Thí nghiệm">Phòng Thí nghiệm</option>
                            <option value="Phòng Hành chính - Nhân sự">Phòng Hành chính - Nhân sự</option>
                            <option value="Phòng Kế toán - Tài chính">Phòng Kế toán - Tài chính</option>
                            <option value="Phòng Kinh doanh">Phòng Kinh doanh</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-group">
                          <label>{t('contact.form.message')}</label>
                          <textarea
                            name="message"
                            className="form-control"
                            placeholder="Write Your Message Here..."
                            rows={4}
                            value={formData.message}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-12 mt-3">
                        <button className="themeht-btn primary-btn" type="submit">
                          {t('contact.form.sendMessage')}
                        </button>
                        <button className="themeht-btn secondary-btn ms-3" type="button" onClick={handleReset}>
                          {t('contact.form.reset')}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Full-width Map Section */}
        <section className="overflow-hidden p-0">
          <div className="container-fluid px-0">
            <div className="row">
              <div className="col-md-12">
                <div className="map-container">
                  {contactSettings?.map_settings.google_map_embed ? (
                    <iframe
                      src={contactSettings.map_settings.google_map_embed}
                      width="100%"
                      height="450"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="VIỆN CÔNG NGHỆ - Bản đồ"
                    />
                  ) : (
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.0969470394357!2d105.82391631543307!3d21.028511593316544!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab9bd9861ca1%3A0xe7887f7b72ca17a9!2sHanoi%2C%20Vietnam!5e0!3m2!1sen!2s!4v1703845234567"
                      width="100%"
                      height="450"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="VIỆN CÔNG NGHỆ - Bản đồ"
                    />
                  )}
                  
                  {/* Map Overlay with Contact Info */}
                  <div className="map-overlay">
                    <div className="map-info-card">
                      <div className="map-info-header">
                        <h5><i className="bi bi-geo-alt-fill text-primary me-2"></i>{t('contact.location.title')}</h5>
                      </div>
                      <div className="map-info-content">
                        <div className="map-address mb-3">
                          <strong>{t('contact.info.mainOffice')}:</strong><br />
                          <span>{contactSettings?.company_info.address_main || 'Tòa nhà 8 tầng, số 25, Vũ Ngọc Phan, Hà Nội'}</span>
                        </div>
                        <div className="map-address mb-3">
                          <strong>{t('contact.info.branchOffice')}:</strong><br />
                          <span>{contactSettings?.company_info.address_branch || 'Lô 27B, khu Công nghiệp Quang Minh, Mê Linh, Hà Nội'}</span>
                        </div>
                        <div className="map-contact">
                          <a href={`tel:${contactSettings?.company_info.phone || '+84243776332'}`} className="btn btn-primary btn-sm me-2">
                            <i className="bi bi-telephone me-1"></i>{t('contact.form.phone')}
                          </a>
                          <a href={`mailto:${contactSettings?.company_info.email || 'viencongnghe@ritm.vn'}`} className="btn btn-outline-primary btn-sm">
                            <i className="bi bi-envelope me-1"></i>{t('contact.info.email')}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .contact-info-card {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          border: 1px solid #f0f0f0;
        }
        
        .contact-info-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }
        
        .contact-info-header {
          text-align: center;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid #f8f9fa;
        }
        
        .contact-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, var(--themeht-primary-color), #007bff);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          box-shadow: 0 4px 15px rgba(var(--themeht-primary-color), 0.3);
        }
        
        .contact-icon i {
          font-size: 1.5rem;
          color: white;
        }
        
        .contact-info-header h4 {
          margin: 0;
          color: #212529;
          font-weight: 700;
          font-size: 1.25rem;
        }
        
        .contact-details {
          space-y: 1.5rem;
        }
        
        .contact-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        
        .contact-item:hover {
          background: #e9ecef;
          transform: translateX(5px);
        }
        
        .contact-item i {
          font-size: 1.25rem;
          margin-right: 1rem;
          margin-top: 0.25rem;
          flex-shrink: 0;
          width: 24px;
          text-align: center;
        }
        
        .contact-item > div {
          flex: 1;
        }
        
        .contact-label {
          display: block;
          font-weight: 600;
          color: #495057;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .contact-text {
          margin: 0;
          color: #6c757d;
          line-height: 1.6;
          font-size: 0.95rem;
        }
        
        .contact-link {
          color: #495057;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .contact-link:hover {
          color: var(--themeht-primary-color);
          text-decoration: underline;
        }
        
        .theme-title h6 {
          color: var(--themeht-primary-color);
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        
        .theme-title h2 {
          margin-bottom: 1.5rem;
          color: #212529;
        }
        
        .theme-title h2 span {
          color: var(--themeht-primary-color);
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #212529;
        }
        
        .form-control {
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 0.75rem;
          font-size: 0.9rem;
        }
        
        .form-control:focus {
          border-color: var(--themeht-primary-color);
          box-shadow: 0 0 0 0.2rem rgba(var(--themeht-primary-color), 0.25);
        }
        
        .themeht-btn {
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          text-decoration: none;
          display: inline-block;
          border: 1px solid transparent;
          transition: all 0.3s ease;
          font-weight: 500;
        }
        
        .themeht-btn.primary-btn {
          background-color: var(--themeht-primary-color);
          border-color: var(--themeht-primary-color);
          color: white;
        }
        
        .themeht-btn.primary-btn:hover {
          background-color: transparent;
          border-color: var(--themeht-primary-color);
          color: var(--themeht-primary-color);
        }
        
        .themeht-btn.secondary-btn {
          background-color: #6c757d;
          border-color: #6c757d;
          color: white;
        }
        
        .themeht-btn.secondary-btn:hover {
          background-color: transparent;
          border-color: #6c757d;
          color: #6c757d;
        }
        
        .box-shadow {
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
        }
        
        .topBottom {
          animation: topBottom 3s ease-in-out infinite;
        }
        
        @keyframes topBottom {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        .map-container {
          position: relative;
          height: 450px;
          overflow: hidden;
        }
        
        .map-container iframe {
          width: 100%;
          height: 100%;
          border: 0;
        }
        
        .map-overlay {
          position: absolute;
          top: 20px;
          right: 20px;
          z-index: 10;
          max-width: 350px;
        }
        
        .map-info-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.2);
          overflow: hidden;
        }
        
        .map-info-header {
          background: linear-gradient(135deg, var(--themeht-primary-color), #007bff);
          padding: 1rem;
          color: white;
        }
        
        .map-info-header h5 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          display: flex;
          align-items: center;
        }
        
        .map-info-content {
          padding: 1.5rem;
        }
        
        .map-address {
          font-size: 0.9rem;
          line-height: 1.5;
        }
        
        .map-address strong {
          color: #495057;
        }
        
        .map-address span {
          color: #6c757d;
        }
        
        .map-contact {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        
        @media (max-width: 768px) {
          .map-overlay {
            position: static;
            max-width: none;
            margin: 0;
            border-radius: 0;
          }
          
          .map-container {
            height: 300px;
          }
          
          .map-info-card {
            border-radius: 0;
            background: white;
          }
        }
      `}</style>
    </>
  );
}
