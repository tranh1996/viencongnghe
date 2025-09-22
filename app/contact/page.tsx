'use client';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchContactSettingsCached, ContactSettings } from '@/utils/api';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function ContactPage() {
  const { t, language } = useLanguage();
  const [contactSettings, setContactSettings] = useState<ContactSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  useEffect(() => {
    const loadContactSettings = async () => {
      const abortController = new AbortController();

      try {
        const data = await fetchContactSettingsCached(language, abortController.signal);
        setContactSettings(data);
      } catch (error) {
        // Don't log AbortError as it's expected when component unmounts
        if (!(error instanceof Error && error.name === 'AbortError')) {
          console.error('Error fetching contact settings:', error);
        }
      } finally {
        setLoading(false);
      }

      return () => {
        abortController.abort();
      };
    };

    loadContactSettings();
  }, [language]);

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
          message: t('contact.form.successMessage')
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        });
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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-page">
      {/* Main Contact Section */}
      <section className="contact-section">
        <Container>
          <Row className="justify-content-center">
            <Col lg={6} md={8}>
              <div className="contact-form-wrapper">
                <div className="contact-card">
                  <h2 className="form-title">{t('contact.form.cooperationTitle')}</h2>
                  <p className="form-description">
                    {t('contact.form.cooperationDescription')}
                  </p>

                  {/* Success/Error Messages */}
                  {submitStatus.type && (
                    <div className={`alert alert-${submitStatus.type === 'success' ? 'success' : 'danger'} mb-4`} role="alert">
                      {submitStatus.message}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="contact-form">
                    <div className="form-group">
                      <label>{t('contact.form.fullName')}</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>{t('contact.form.email')}</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>{t('contact.form.phone')}</label>
                      <input
                        type="tel"
                        name="phone"
                        className="form-control"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>{t('contact.form.message')}</label>
                      <textarea
                        name="message"
                        className="form-control"
                        rows={4}
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <button type="submit" className="btn-submit">
                      {t('contact.form.submitButton')}
                    </button>
                  </form>
                </div>
              </div>
            </Col>

            <Col lg={6} md={4} className="contact-info-col">
              <div className="contact-info-sidebar">
                {/* Logo moved to right side */}
                <div className="contact-info-item logo-item">
                  <div className="institute-logo-sidebar">
                    <img src="/images/logo.png" alt="VIỆN CÔNG NGHỆ" className="logo-img-sidebar" />
                    <div className="logo-text">
                      <h3 className="contact-title-sidebar">{t('contact.sidebar.instituteName')}</h3>
                      <p className="contact-subtitle-sidebar">{t('contact.sidebar.instituteSubtitle')}</p>
                    </div>
                  </div>
                </div>

                <div className="contact-info-item">
                  <i className="bi bi-geo-alt-fill"></i>
                  <div>
                    <span>{t('contact.info.mainOffice')}:</span>
                    <p>{contactSettings?.company_info.address_main || 'Tòa nhà 8 tầng, số 25, Vũ Ngọc Phan, Hà Nội'}</p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <i className="bi bi-envelope-fill"></i>
                  <div>
                    <span>{t('contact.info.email')}:</span>
                    <p>{contactSettings?.company_info.email || 'vcn-hn@vnn.vn'}</p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <i className="bi bi-telephone-fill"></i>
                  <div>
                    <span>{t('contact.info.phone')}:</span>
                    <p>{contactSettings?.company_info.phone || '04.38389758'}</p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <i className="bi bi-printer-fill"></i>
                  <div>
                    <span>{t('contact.info.fax')}:</span>
                    <p>{contactSettings?.company_info.fax || '04.38387123'}</p>
                  </div>
                </div>

                {/* Google Map */}
                <div className="map-container mt-4">
                  <iframe
                    src={contactSettings?.map_settings.google_map_embed || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.473206778654!2d105.77275837504162!3d21.077490480607654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31345531420b86dd%3A0x966a144cd31a7767!2sP.%20V%C4%83n%20H%E1%BB%99i%2C%20%C4%90%C3%B4ng%20Ng%E1%BA%A1c%2C%20B%E1%BA%AFc%20T%E1%BB%AB%20Li%C3%AAm%2C%20H%C3%A0%20N%E1%BB%99i%2C%20Vietnam!5e0!3m2!1sen!2s!4v1672045678901!5m2!1sen!2s'}
                    width="100%"
                    height="300"
                    style={{ border: 0, borderRadius: '8px' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="VIỆN CÔNG NGHỆ Location"
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <style jsx>{`
        .contact-page {
          background: url('/images/image-64.webp');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-attachment: fixed;
          min-height: 100vh;
          padding: 40px 0;
        }

        .contact-section {
          padding: 60px 0;
        }

        .contact-header {
          margin-bottom: 3rem;
        }

        .institute-logo {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .logo-img {
          width: 80px;
          height: 80px;
          object-fit: contain;
        }

        .contact-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--themeht-primary-color);
          margin-bottom: 0.5rem;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }

        .contact-subtitle {
          font-size: 1rem;
          color: #6c757d;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 0;
        }

        .contact-card {
          background: white;
          border-radius: 15px;
          padding: 2.5rem;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          border: 1px solid #e9ecef;
        }

        .form-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #212529;
          margin-bottom: 1rem;
          text-align: center;
        }

        .form-description {
          color: #6c757d;
          text-align: center;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .contact-form .form-group {
          margin-bottom: 1.5rem;
        }

        .contact-form label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #212529;
          font-size: 0.9rem;
        }

        .contact-form .form-control {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-size: 0.9rem;
          transition: border-color 0.3s ease;
          background-color: #f8f9fa;
        }

        .contact-form .form-control:focus {
          outline: none;
          border-color: var(--themeht-primary-color);
          background-color: white;
          box-shadow: 0 0 0 3px rgba(var(--themeht-primary-color), 0.1);
        }

        .btn-submit {
          width: 100%;
          background: var(--themeht-primary-color);
          color: white;
          border: none;
          padding: 1rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .btn-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(var(--themeht-primary-color), 0.3);
        }

        .contact-info-col {
          display: flex;
          align-items: flex-start;
          padding-top: 2rem;
        }

        .contact-info-sidebar {
          width: 100%;
        }

        .contact-info-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          border-left: 4px solid var(--themeht-primary-color);
        }

        .contact-info-item i {
          font-size: 1.2rem;
          color: var(--themeht-primary-color);
          margin-right: 1rem;
          margin-top: 0.25rem;
          min-width: 20px;
        }

        .contact-info-item span {
          font-weight: 600;
          color: #212529;
          display: block;
          margin-bottom: 0.25rem;
          font-size: 0.9rem;
        }

        .contact-info-item p {
          margin: 0;
          color: #6c757d;
          font-size: 0.85rem;
          line-height: 1.4;
        }

        /* Logo section in sidebar */
        .logo-item {
          background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
          margin-bottom: 2rem;
          border-left: none;
        }

        .institute-logo-sidebar {
          display: flex;
          align-items: center;
          width: 100%;
        }

        .logo-img-sidebar {
          width: 60px;
          height: 60px;
          object-fit: contain;
          margin-right: 1rem;
          flex-shrink: 0;
        }

        .logo-text {
          flex: 1;
        }

        .contact-title-sidebar {
          font-size: 1.5rem;
          font-weight: 700;
          color: #dc3545;
          margin: 0 0 0.25rem 0;
          line-height: 1.2;
        }

        .contact-subtitle-sidebar {
          font-size: 0.75rem;
          color: #6c757d;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          line-height: 1.3;
        }

        .map-container {
          margin-top: 1rem;
          overflow: hidden;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .map-container iframe {
          width: 100%;
          border: 0;
        }

        .alert {
          border-radius: 8px;
          border: none;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }

        .alert-success {
          background-color: #d1edff;
          color: #0c5460;
        }

        .alert-danger {
          background-color: #f8d7da;
          color: #721c24;
        }

        @media (max-width: 992px) {
          .contact-info-col {
            margin-top: 3rem;
            padding-top: 0;
          }

          .contact-form-wrapper {
            margin-bottom: 2rem;
          }
        }

        @media (max-width: 768px) {
          .contact-page {
            padding: 20px 0;
          }

          .contact-section {
            padding: 30px 0;
          }

          .contact-title {
            font-size: 2rem;
          }

          .contact-card {
            padding: 1.5rem;
            margin: 0 15px;
          }

          .form-title {
            font-size: 1.2rem;
            margin-bottom: 0.8rem;
          }

          .form-description {
            font-size: 0.9rem;
            margin-bottom: 1.5rem;
          }

          .contact-info-item {
            flex-direction: row;
            text-align: left;
            padding: 0.8rem;
            margin-bottom: 1rem;
          }

          .contact-info-item i {
            margin-right: 0.8rem;
            margin-bottom: 0;
            font-size: 1.1rem;
            margin-top: 0.1rem;
          }

          .logo-item {
            margin-bottom: 1.5rem;
          }

          .logo-img-sidebar {
            width: 50px;
            height: 50px;
          }

          .contact-title-sidebar {
            font-size: 1.2rem;
          }

          .contact-subtitle-sidebar {
            font-size: 0.7rem;
          }

          .map-container {
            height: 250px;
            margin-top: 1.5rem;
          }

          .contact-info-sidebar {
            padding: 0 15px;
          }
        }

        @media (max-width: 576px) {
          .contact-section {
            padding: 20px 0;
          }

          .contact-card {
            padding: 1.2rem;
            margin: 0 10px;
          }

          .form-title {
            font-size: 1.1rem;
            line-height: 1.3;
          }

          .form-description {
            font-size: 0.85rem;
            line-height: 1.4;
          }

          .contact-title {
            font-size: 1.8rem;
          }

          .contact-form .form-control {
            padding: 0.6rem 0.8rem;
            font-size: 0.85rem;
          }

          .contact-form label {
            font-size: 0.85rem;
            margin-bottom: 0.4rem;
          }

          .contact-form .form-group {
            margin-bottom: 1.2rem;
          }

          .btn-submit {
            padding: 0.8rem;
            font-size: 0.9rem;
          }

          .contact-info-item {
            padding: 0.6rem;
            margin-bottom: 0.8rem;
          }

          .contact-info-item span {
            font-size: 0.8rem;
          }

          .contact-info-item p {
            font-size: 0.8rem;
          }

          .logo-item {
            padding: 0.8rem;
          }

          .institute-logo-sidebar {
            flex-direction: column;
            text-align: center;
          }

          .logo-img-sidebar {
            width: 45px;
            height: 45px;
            margin-right: 0;
            margin-bottom: 0.5rem;
          }

          .contact-title-sidebar {
            font-size: 1rem;
            margin-bottom: 0.2rem;
          }

          .contact-subtitle-sidebar {
            font-size: 0.65rem;
          }

          .map-container {
            height: 200px;
            margin-top: 1rem;
          }

          .contact-info-sidebar {
            padding: 0 10px;
          }
        }

        @media (max-width: 480px) {
          .contact-card {
            margin: 0 5px;
            padding: 1rem;
          }

          .form-title {
            font-size: 1rem;
          }

          .contact-info-sidebar {
            padding: 0 5px;
          }

          .contact-info-item {
            padding: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}
