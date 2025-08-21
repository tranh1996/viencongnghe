'use client';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { contactTranslations, getCurrentLanguage } from '../../src/config/languages';
import LanguageSwitcher from '../../src/components/LanguageSwitcher';

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
  const [currentLanguage, setCurrentLanguage] = useState<string>('vi');
  const [contactSettings, setContactSettings] = useState<ContactSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    subject: '',
    message: '',
    department: currentLanguage === 'vi' 
      ? 'Phòng Nghiên cứu Vật liệu, Xử lý nhiệt và bề mặt'
      : 'Materials Research, Heat Treatment and Surface Processing Department'
  });
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // Get translations for current language
  const t = contactTranslations[currentLanguage] || contactTranslations['vi'];

  useEffect(() => {
    const lang = getCurrentLanguage();
    setCurrentLanguage(lang);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
          message: t.successMessage
        });
        handleReset();
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.message || t.errorMessage
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({
        type: 'error',
        message: t.errorMessage
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
      department: currentLanguage === 'vi' 
        ? 'Phòng Nghiên cứu Vật liệu, Xử lý nhiệt và bề mặt'
        : 'Materials Research, Heat Treatment and Surface Processing Department'
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

  return (
    <>
      {/* Header Section */}
      <section className="page-title dark-bg">
        <Container>
          <Row>
            <Col>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h1>{t.pageTitle}</h1>
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <a href="/">{t.breadcrumbHome}</a>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                        {t.breadcrumbContact}
                      </li>
                    </ol>
                  </nav>
                </div>
                <LanguageSwitcher onLanguageChange={setCurrentLanguage} />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Form Section */}
      <section className="py-5">
        <Container>
          <Row>
            <Col lg={6}>
              <div>
                <h1 className="display-6 fw-bold text-dark mb-4">{t.contactTitle}</h1>
              </div>
            </Col>
            <Col lg={6}>
              <div className="p-4 rounded" style={{ backgroundColor: 'var(--themeht-primary-color)', color: 'white' }}>
                <h5 className="mb-3 text-white">{t.welcomeTitle}</h5>
                <p className="mb-0">
                  {t.welcomeMessage}
                </p>
              </div>
            </Col>
          </Row>

          {/* Contact Form */}
          <Row className="mt-5">
            <Col lg={12}>
              <div className="contact-form-container p-4 border rounded">
                {/* Success/Error Messages */}
                {submitStatus.type && (
                  <div className={`alert alert-${submitStatus.type === 'success' ? 'success' : 'danger'} mb-4`} role="alert">
                    <i className={`bi bi-${submitStatus.type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2`}></i>
                    {submitStatus.message}
                  </div>
                )}
                
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">{t.nameLabel}</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">{t.emailLabel}</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">{t.phoneLabel}</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">{t.addressLabel}</Form.Label>
                        <Form.Control
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">{t.subjectLabel}</Form.Label>
                        <Form.Control
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">{t.messageLabel}</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={5}
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12}>
                      <div className="d-flex gap-3">
                        <Button type="submit" variant="secondary" className="px-4">
                          {t.sendButton}
                        </Button>
                        <Button type="button" variant="secondary" className="px-4" onClick={handleReset}>
                          {t.resetButton}
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Company Information Sections */}
      <section className="py-5 bg-light">
        <Container>
          <Row>
            {/* Main Office Section */}
            <Col lg={6} className="mb-4">
              <div className="text-white p-3 rounded-top" style={{ backgroundColor: 'var(--themeht-primary-color)'}}>
                <h5 className="text-white mb-0 fw-bold">{t.mainOfficeTitle}</h5>
              </div>
              <div className="bg-white p-4 border rounded-bottom">
                <div>
                  <h6 className="fw-bold mb-3">{contactSettings?.company_info.company_name || 'VIỆN CÔNG NGHỆ'}</h6>
                  <p className="mb-2">
                    <strong>{t.companyAddressLabel}</strong><br />
                    {contactSettings?.company_info.address_main || 'Trụ sở chính: Tòa nhà 8 tầng, số 25, Vũ Ngọc Phan, Hà Nội'}
                  </p>
                  <p className="mb-2">
                    <strong>{t.companyPhoneLabel}</strong> {contactSettings?.company_info.phone || '+84 243 776 3322'}
                  </p>
                  <p className="mb-2">
                    <strong>{t.faxLabel}</strong> {contactSettings?.company_info.fax || '+84 243 835 9235'}
                  </p>
                  <p className="mb-2">
                    <strong>{t.companyEmailLabel}</strong> {contactSettings?.company_info.email || 'viencongnghe@ritm.vn'}
                  </p>
                  <p className="mb-0">
                    <strong>{t.websiteLabel}</strong><br />
                    www.viencongnghe.vn - www.ritm.vn
                  </p>
                </div>
              </div>
            </Col>

            {/* Branch Office Section */}
            <Col lg={6} className="mb-4">
              <div className="text-white p-3 rounded-top" style={{ backgroundColor: 'var(--themeht-primary-color)'}}>
                <h5 className="text-white mb-0 fw-bold">{t.branchOfficeTitle}</h5>
              </div>
              <div className="bg-white p-4 border rounded-bottom">
                <div>
                  <h6 className="fw-bold mb-3">{contactSettings?.company_info.company_name || 'VIỆN CÔNG NGHỆ'}</h6>
                    <p className="mb-2">
                      <strong>{t.companyAddressLabel}</strong><br />
                      {contactSettings?.company_info.address_branch || 'Cơ sở 2: Lô 27B, khu Công nghiệp Quang Minh, Mê Linh, Hà Nội'}
                    </p>
                    <p className="mb-2">
                      <strong>{t.companyPhoneLabel}</strong> {contactSettings?.company_info.phone || '+84 243 776 3322'}
                    </p>
                    <p className="mb-2">
                      <strong>{t.faxLabel}</strong> {contactSettings?.company_info.fax || '+84 243 835 9235'}
                    </p>
                    <p className="mb-2">
                      <strong>{t.companyEmailLabel}</strong> {contactSettings?.company_info.email || 'viencongnghe@ritm.vn'}
                    </p>
                    <p className="mb-0">
                      <strong>{t.websiteLabel}</strong><br />
                      www.viencongnghe.vn - www.ritm.vn
                    </p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Map Section */}
      <section className="py-5">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="d-flex align-items-center mb-4">
                <h3 className="fw-bold text-dark mb-0 me-3">{t.branchTitle}</h3>
                <div className="ms-auto">
                  <i className="bi bi-plus-circle-fill text-primary" style={{ fontSize: '1.5rem' }}></i>
                </div>
              </div>
              
              {/* Branch Tabs */}
              <div className="branch-tabs mb-4">
                <div className="d-flex flex-wrap gap-2">
                  <button className="btn btn-outline-primary active">{t.mainOfficeTab}</button>
                  <button className="btn btn-outline-primary">{t.branchTab}</button>
                  <button className="btn btn-outline-primary">{t.hanoiTab}</button>
                  <button className="btn btn-outline-primary">{t.hcmTab}</button>
                  <button className="btn btn-outline-primary">{t.danangTab}</button>
                  <button className="btn btn-outline-primary">{t.canthoTab}</button>
                </div>
              </div>

              {/* Map */}
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
                  ></iframe>
                ) : (
                  <div className="bg-light d-flex justify-content-center align-items-center" style={{ height: '450px' }}>
                    <p className="text-muted">{t.mapLoadingText}</p>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Social Media Icons */}
      {contactSettings?.social_media && (
        <section className="py-3 bg-light">
          <Container>
            <Row>
              <Col lg={12} className="text-center">
                <div className="social-media-icons">
                  {contactSettings.social_media.facebook_link && (
                    <a href={contactSettings.social_media.facebook_link} target="_blank" rel="noopener noreferrer" className="mx-2">
                      <div className="social-icon bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                        <i className="bi bi-facebook"></i>
                      </div>
                    </a>
                  )}
                  {contactSettings.social_media.instagram_link && (
                    <a href={contactSettings.social_media.instagram_link} target="_blank" rel="noopener noreferrer" className="mx-2">
                      <div className="social-icon bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                        <i className="bi bi-instagram"></i>
                      </div>
                    </a>
                  )}
                  {contactSettings.social_media.linkedin_link && (
                    <a href={contactSettings.social_media.linkedin_link} target="_blank" rel="noopener noreferrer" className="mx-2">
                      <div className="social-icon bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                        <i className="bi bi-linkedin"></i>
                      </div>
                    </a>
                  )}
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      )}
    </>
  );
}
