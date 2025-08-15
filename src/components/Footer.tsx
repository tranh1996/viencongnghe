'use client';

import React from 'react';
import Link from 'next/link';
import { Container, Row, Col } from 'react-bootstrap';

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
const ContactInfo: React.FC = () => (
  <ul className="media-icon">
    <li>
      <i className="bi bi-geo-alt-fill"></i>
      <span>Trụ sở chính</span>
      <p>Tòa nhà 8 tầng, số 25, Vũ Ngọc Phan, Hà Nội</p>
    </li>
    <li>
      <i className="bi bi-geo-alt-fill"></i>
      <span>Cơ sở 2</span>
      <p>Lô 27B, khu Công nghiệp Quang Minh, Mê Linh, Hà Nội</p>
    </li>
    <li>
      <i className="bi bi-telephone-fill"></i>
      <span>Điện thoại</span>
      <p>
        <a href="tel:+842437763322">+84 243 776 3322</a>
      </p>
    </li>
    <li>
      <i className="bi bi-envelope-fill"></i>
      <span>Email</span>
      <p>
        <a href="mailto:viencongnghe@ritm.vn">viencongnghe@ritm.vn</a>
      </p>
    </li>
    <li>
      <i className="bi bi-clock-fill"></i>
      <span>Giờ làm việc</span>
      <p>Thứ 2 - Thứ 6: 8:00 - 17:00</p>
    </li>
  </ul>
);

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
  // Navigation links data
  const aboutLinks = [
    { to: '/about', text: 'Về chúng tôi' },
    { to: '/organization', text: 'Cơ cấu tổ chức' },
    { to: '/products', text: 'Sản phẩm & Dịch vụ' },
    { to: '/library', text: 'Hình ảnh hoạt động' }
  ];

  const newsLinks = [
    { to: '/blog', text: 'Tin hoạt động' },
    { to: '/blog#science', text: 'Tin khoa học công nghệ' },
    { to: '/blog#training', text: 'Hoạt động đào tạo và tư vấn' },
    { to: '/blog#professional', text: 'Bài viết chuyên môn' }
  ];

  const legalLinks = [
    { to: '/privacy-policy', text: 'Chính sách bảo mật' },
    { to: '/terms-conditions', text: 'Điều khoản sử dụng' },
    { to: '/sitemap', text: 'Sơ đồ trang' }
  ];

  return (
    <footer className="footer">
      {/* Primary Footer Section */}
      <div className="primary-footer">
        <Container fluid>
          <Row>
            {/* Company Information */}
            <Col lg={4} md={6}>
              <FooterWidget 
                title="VIỆN CÔNG NGHỆ"
                subtitle="Research Institute of Technology for Machinery"
              >
                <p>
                  Viện công nghệ (RITM) là một tổ chức nghiên cứu và phát triển công nghệ về lĩnh vực 
                  chế tạo vật liệu có tính chất đặc biệt, gia công cơ khí chế tạo khuôn mẫu, xử lý nhiệt 
                  và bề mặt với mục tiêu ứng dụng vào thực tế.
                </p>
                <SocialIcons />
              </FooterWidget>
            </Col>

            {/* About Links */}
            <Col lg={2} md={6}>
              <FooterWidget title="GIỚI THIỆU">
                <FooterLinks links={aboutLinks} />
              </FooterWidget>
            </Col>

            {/* News Links */}
            <Col lg={3} md={6}>
              <FooterWidget title="TIN TỨC">
                <FooterLinks links={newsLinks} />
              </FooterWidget>
            </Col>

            {/* Contact Information */}
            <Col lg={3} md={6}>
              <FooterWidget title="THÔNG TIN CÔNG TY">
                <ContactInfo />
              </FooterWidget>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Secondary Footer Section */}
      <div className="secondary-footer">
        <Container fluid>
          <Row className="align-items-center">
            <Col md={6}>
              <div className="copyright">
                © Copyright 2024 viencongnghe.vn - All rights reserved. Designed by{' '}
                <a 
                  href="https://themeht.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="ThemeHt Website"
                >
                  ThemeHt
                </a>
              </div>
            </Col>
            <Col md={6}>
              <ul className="footer-menu list-inline text-md-end">
                {legalLinks.map((link, index) => (
                  <li key={index}>
                    <Link href={link.to}>{link.text}</Link>
                  </li>
                ))}
              </ul>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
};

export default Footer; 