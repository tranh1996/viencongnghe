'use client';

import type { Metadata } from 'next';
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import OptimizedImage from '@/components/OptimizedImage';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function AboutPage() {
  return (
    <>
      {/* Page Title */}
      <section className="page-title dark-bg">
        <Container>
          <Row>
            <Col>
              <h1>Về chúng tôi</h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="/">Trang chủ</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Về chúng tôi
                  </li>
                </ol>
              </nav>
            </Col>
          </Row>
        </Container>
      </section>

      {/* About Content */}
      <section>
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <OptimizedImage 
                src="/images/about/01.jpg" 
                alt="Viện Công nghệ RITM - Hơn 50 năm hoạt động trong lĩnh vực cơ khí và luyện kim"
                context="Trang giới thiệu - Lịch sử phát triển"
                className="about-img-shape"
                style={{ backgroundImage: 'url(/images/about/01.jpg)' }}
              />
            </Col>
            <Col lg={6}>
              <div className="ps-lg-5">
                <h6 className="text-theme mb-3">Về Viện Công nghệ</h6>
                <h2 className="mb-4">Hơn 50 năm hoạt động trong lĩnh vực cơ khí và luyện kim</h2>
                <p className="mb-4">
                  Trong suốt hơn 50 năm hoạt động trong lĩnh vực cơ khí và luyện kim, Viện Công nghệ 
                  không ngừng đầu tư và phát triển các lĩnh vực thế mạnh của Viện nhằm đáp ứng được 
                  những yêu cầu khắt khe nhất của khách hàng trong nước và quốc tế.
                </p>
                <p className="mb-4">
                  Bên cạnh đó, Viện cũng triển khai nhiều nghiên cứu về lĩnh vực vật liệu mới, 
                  nhiệt luyện, cơ khí chế tạo khuôn mẫu với mục tiêu ứng dụng vào thực tế cũng như 
                  nội địa hóa các sản phẩm nhập khẩu.
                </p>
                <ul className="list-icon style-1">
                  <li>
                    <i className="bi bi-check-circle-fill"></i>
                    <span>Công nghệ đúc và vật liệu mới</span>
                  </li>
                  <li>
                    <i className="bi bi-check-circle-fill"></i>
                    <span>Công nghệ xử lý nhiệt</span>
                  </li>
                  <li>
                    <i className="bi bi-check-circle-fill"></i>
                    <span>Cơ khí chế tạo khuôn mẫu</span>
                  </li>
                  <li>
                    <i className="bi bi-check-circle-fill"></i>
                    <span>Kiểm định vật liệu</span>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Mission & Vision */}
      <section className="light-bg">
        <Container>
          <Row>
            <Col lg={6} className="mb-4">
              <div className="p-4">
                <h3 className="h4 mb-3">Sứ mệnh</h3>
                <p>
                  Nghiên cứu và phát triển công nghệ về lĩnh vực chế tạo vật liệu có tính chất đặc biệt, 
                  gia công cơ khí chế tạo khuôn mẫu, xử lý nhiệt và bề mặt với mục tiêu ứng dụng vào 
                  thực tế cũng như nội địa hóa các sản phẩm nhập khẩu.
                </p>
              </div>
            </Col>
            <Col lg={6} className="mb-4">
              <div className="p-4">
                <h3 className="h4 mb-3">Tầm nhìn</h3>
                <p>
                  Trở thành viện nghiên cứu hàng đầu trong lĩnh vực cơ khí và luyện kim, được công nhận 
                  về sự xuất sắc, đổi mới và cam kết thúc đẩy sự phát triển của khoa học công nghệ. 
                  Chúng tôi hướng tới tương lai nơi nghiên cứu của chúng tôi đóng góp vào những 
                  khám phá và giải pháp đột phá.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Values */}
      <section>
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="mb-4">Giá trị cốt lõi</h2>
            </Col>
          </Row>
          <Row>
            <Col lg={3} md={6} className="mb-4">
              <div className="text-center">
                <div className="mb-3">
                  <i className="bi bi-award text-theme" style={{ fontSize: '3rem' }}></i>
                </div>
                <h3 className="h5">Chất lượng</h3>
                <p>Chúng tôi duy trì tiêu chuẩn chất lượng cao nhất trong tất cả các nghiên cứu và dịch vụ.</p>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <div className="text-center">
                <div className="mb-3">
                  <i className="bi bi-lightbulb text-theme" style={{ fontSize: '3rem' }}></i>
                </div>
                <h3 className="h5">Đổi mới</h3>
                <p>Chúng tôi liên tục khám phá công nghệ và phương pháp mới để thúc đẩy nghiên cứu.</p>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <div className="text-center">
                <div className="mb-3">
                  <i className="bi bi-people text-theme" style={{ fontSize: '3rem' }}></i>
                </div>
                <h3 className="h5">Hợp tác</h3>
                <p>Chúng tôi tin vào sức mạnh của làm việc nhóm và đối tác để đạt được kết quả tốt.</p>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <div className="text-center">
                <div className="mb-3">
                  <i className="bi bi-shield-check text-theme" style={{ fontSize: '3rem' }}></i>
                </div>
                <h3 className="h5">Uy tín</h3>
                <p>Chúng tôi thực hiện nghiên cứu với sự trung thực, minh bạch và tiêu chuẩn đạo đức.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Resources Section */}
      <section className="light-bg" id="resources">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="mb-4">Nguồn lực</h2>
            </Col>
          </Row>
          <Row>
            <Col lg={4} md={6} className="mb-4">
              <div className="text-center p-4">
                <div className="mb-3">
                  <i className="bi bi-building text-theme" style={{ fontSize: '3rem' }}></i>
                </div>
                <h3 className="h5">Cơ sở vật chất</h3>
                <p>
                  Hệ thống phòng thí nghiệm hiện đại với các thiết bị tiên tiến phục vụ nghiên cứu 
                  và phát triển công nghệ.
                </p>
              </div>
            </Col>
            <Col lg={4} md={6} className="mb-4">
              <div className="text-center p-4">
                <div className="mb-3">
                  <i className="bi bi-person-badge text-theme" style={{ fontSize: '3rem' }}></i>
                </div>
                <h3 className="h5">Đội ngũ chuyên gia</h3>
                <p>
                  Đội ngũ cán bộ khoa học có trình độ cao, giàu kinh nghiệm trong các lĩnh vực 
                  chuyên môn khác nhau.
                </p>
              </div>
            </Col>
            <Col lg={4} md={6} className="mb-4">
              <div className="text-center p-4">
                <div className="mb-3">
                  <i className="bi bi-gear-wide-connected text-theme" style={{ fontSize: '3rem' }}></i>
                </div>
                <h3 className="h5">Công nghệ tiên tiến</h3>
                <p>
                  Áp dụng các công nghệ mới nhất trong nghiên cứu và phát triển sản phẩm, 
                  đảm bảo tính cạnh tranh cao.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}
