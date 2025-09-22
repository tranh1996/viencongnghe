'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container, Row, Col } from 'react-bootstrap';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchContactSettingsCached, ContactSettings } from '@/utils/api';

// Footer Widget Component
interface FooterWidgetProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const FooterWidget: React.FC<FooterWidgetProps> = ({ title, subtitle, children }) => (
  <div className="footer-widget">
    <div className="widget-title">
      <h5>{title}</h5>
      {subtitle && <h6>{subtitle}</h6>}
    </div>
    {children}
  </div>
);

// Social Icons Component
const SocialIcons: React.FC = () => (
  <div className="social-icons footer-social">
    <ul className="list-inline">
      <li>
        <button 
          className="btn btn-link p-0 border-0 bg-transparent"
          aria-label="Facebook"
          onClick={() => {
            // TODO: Add Facebook URL when available
            console.log('Facebook clicked');
          }}
        >
          <i className="bi bi-facebook"></i>
        </button>
      </li>
      <li>
        <button 
          className="btn btn-link p-0 border-0 bg-transparent"
          aria-label="YouTube"
          onClick={() => {
            // TODO: Add YouTube URL when available
            console.log('YouTube clicked');
          }}
        >
          <i className="bi bi-youtube"></i>
        </button>
      </li>
      <li>
        <button 
          className="btn btn-link p-0 border-0 bg-transparent"
          aria-label="LinkedIn"
          onClick={() => {
            // TODO: Add LinkedIn URL when available
            console.log('LinkedIn clicked');
          }}
        >
          <i className="bi bi-linkedin"></i>
        </button>
      </li>
    </ul>
  </div>
);

// Contact Info Component
const ContactInfo: React.FC = () => {
  const { t, language } = useLanguage();
  const [contactSettings, setContactSettings] = useState<ContactSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadContactSettings = async () => {
      try {
        const data = await fetchContactSettingsCached(language, controller.signal);
        if (isMounted) {
          setContactSettings(data);
        }
      } catch (error) {
        if (isMounted && !(error instanceof Error && error.name === 'AbortError')) {
          console.error('Error loading contact settings:', error);
          // Fallback to default data if API fails
          setContactSettings({
            company_info: {
              company_name: "INSTITUTE OF TECHNOLOGY",
              company_subtitle: "Institute of Technology",
              address_main: "Head Office: 8-story building, 25 Vu Ngoc Phan, Hanoi",
              address_branch: "Lot 27B, Quang Minh Industrial Park, Me Linh, Hanoi",
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
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadContactSettings();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [language]);

  if (loading) {
    return (
      <ul className="media-icon">
        <li>
          <div className="loading-text">Loading contact information...</div>
        </li>
      </ul>
    );
  }

  return (
    <ul className="media-icon">
      <li>
        <i className="bi bi-geo-alt-fill"></i>
        <span>{t('contact.info.mainOffice')}</span>
        <p>{contactSettings?.company_info.address_main || 'Head Office: 8-story building, 25 Vu Ngoc Phan, Hanoi'}</p>
      </li>
      <li>
        <i className="bi bi-telephone-fill"></i>
        <span>{t('contact.info.phone')}</span>
        <p>
          <a href={`tel:${contactSettings?.company_info.phone?.replace(/\s/g, '') || '+842437763322'}`}>
            {contactSettings?.company_info.phone || '+84 243 776 3322'}
          </a>
        </p>
      </li>
      <li>
        <i className="bi bi-envelope-fill"></i>
        <span>{t('contact.info.email')}</span>
        <p>
          <a href={`mailto:${contactSettings?.company_info.email || 'viencongnghe@ritm.vn'}`}>
            {contactSettings?.company_info.email || 'viencongnghe@ritm.vn'}
          </a>
        </p>
      </li>
      <li>
        <i className="bi bi-clock-fill"></i>
        <span>{t('contact.info.workingHours')}</span>
        <p>{t('header.workingHours')}</p>
      </li>
    </ul>
  );
};

// Footer Links Component
interface FooterLinksProps {
  links: Array<{ to: string; text: string }>;
}

const FooterLinks: React.FC<FooterLinksProps> = ({ links }) => (
  <ul className="footer-menu">
    {links.map((link, index) => (
      <li key={index}>
        <Link href={link.to}>{link.text}</Link>
      </li>
    ))}
  </ul>
);

// Main Footer Component
const Footer: React.FC = () => {
  const { t } = useLanguage();

  // Navigation links data
  const aboutLinks = [
    { to: '/about', text: t('nav.about') },
    { to: '/about/vision-mission', text: t('nav.about.visionMission') },
    { to: '/about/history', text: t('nav.about.history') },
    { to: '/organization', text: t('nav.organization') }
  ];

  const servicesLinks = [
    { to: '/products', text: t('nav.products') },
    { to: '/services', text: t('footer.services') },
    { to: '/library', text: t('nav.library') },
    { to: '/contact', text: t('nav.contact') }
  ];

  const newsLinks = [
    { to: '/blog', text: t('nav.news.activities') },
    { to: '/blog', text: t('nav.news.science') },
    { to: '/blog', text: t('nav.news.training') },
    { to: '/blog', text: t('nav.news.professional') }
  ];

  return (
    <footer className="footer">
      {/* Primary Footer Section */}
      <div className="primary-footer">
        <Container>
          <Row>
            {/* Company Information */}
            <Col lg={4} md={6}>
              <FooterWidget 
                title={t('footer.company.name') || 'VIỆN CÔNG NGHỆ'}
                subtitle={t('footer.company.subtitle') || 'Institute of Technology'}
              >
                <p>
                  {t('footer.about.description')}
                </p>
                <SocialIcons />
              </FooterWidget>
            </Col>

            {/* About Links */}
            <Col lg={2} md={6}>
              <FooterWidget title={t('footer.about.title').toUpperCase()}>
                <FooterLinks links={aboutLinks} />
              </FooterWidget>
            </Col>

            {/* Services Links */}
            <Col lg={2} md={6}>
              <FooterWidget title={t('footer.services').toUpperCase()}>
                <FooterLinks links={servicesLinks} />
              </FooterWidget>
            </Col>

            {/* Contact Information */}
            <Col lg={4} md={6}>
              <FooterWidget title={t('contact.info.title').toUpperCase()}>
                <ContactInfo />
              </FooterWidget>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Secondary Footer Section */}
      <div className="secondary-footer">
        <Container>
          <Row className="align-items-center">
            <Col md={12} className="text-center">
              <div className="copyright">
                {t('footer.copyright')}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
};

export default Footer; 