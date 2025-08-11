import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="primary-footer">
        <Container fluid>
          <Row>
            <Col lg={4} md={6} className="footer-widget">
              <div className="widget-title">
                <h5>VIỆN CÔNG NGHỆ</h5>
                <h6>Research Institute of Technology for Machinery</h6>
              </div>
              <p>
                Viện công nghệ (RITM) là một tổ chức nghiên cứu và phát triển công nghệ về lĩnh vực 
                chế tạo vật liệu có tính chất đặc biệt, gia công cơ khí chế tạo khuôn mẫu, xử lý nhiệt 
                và bề mặt với mục tiêu ứng dụng vào thực tế.
              </p>
              <div className="social-icons footer-social">
                <ul className="list-inline">
                  <li>
                    <a href="#">
                      <i className="bi bi-facebook"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="bi bi-youtube"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="bi bi-linkedin"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </Col>

            <Col lg={2} md={6} className="footer-widget">
              <div className="widget-title">
                <h5>GIỚI THIỆU</h5>
              </div>
              <ul className="footer-menu">
                <li>
                  <Link to="/about">Về chúng tôi</Link>
                </li>
                <li>
                  <Link to="/organization">Cơ cấu tổ chức</Link>
                </li>
                <li>
                  <Link to="/products">Sản phẩm & Dịch vụ</Link>
                </li>
                <li>
                  <Link to="/library">Hình ảnh hoạt động</Link>
                </li>
              </ul>
            </Col>

            <Col lg={3} md={6} className="footer-widget">
              <div className="widget-title">
                <h5>TIN TỨC</h5>
              </div>
              <ul className="footer-menu">
                <li>
                  <Link to="/blog">Tin hoạt động</Link>
                </li>
                <li>
                  <Link to="/blog#science">Tin khoa học công nghệ</Link>
                </li>
                <li>
                  <Link to="/blog#training">Hoạt động đào tạo và tư vấn</Link>
                </li>
                <li>
                  <Link to="/blog#professional">Bài viết chuyên môn</Link>
                </li>
              </ul>
            </Col>

            <Col lg={3} md={6} className="footer-widget">
              <div className="widget-title">
                <h5>THÔNG TIN CÔNG TY</h5>
              </div>
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
            </Col>
          </Row>
        </Container>
      </div>

      <div className="secondary-footer">
        <Container fluid>
          <Row className="align-items-center">
            <Col md={6}>
              <div className="copyright">
                © Copyright 2024 viencongnghe.vn - All rights reserved. Designed by{' '}
                <a href="https://themeht.com" target="_blank" rel="noopener noreferrer">
                  ThemeHt
                </a>
              </div>
            </Col>
            <Col md={6}>
              <ul className="footer-menu list-inline text-md-end">
                <li>
                  <Link to="/privacy-policy">Chính sách bảo mật</Link>
                </li>
                <li>
                  <Link to="/terms-conditions">Điều khoản sử dụng</Link>
                </li>
                <li>
                  <Link to="/sitemap">Sơ đồ trang</Link>
                </li>
              </ul>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
};

export default Footer; 