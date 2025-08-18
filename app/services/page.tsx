'use client';

import type { Metadata } from 'next';
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function ServicesPage() {
  return (
    <>
      {/* Page Title */}
      <section className="page-title dark-bg">
        <Container>
          <Row>
            <Col>
              <h1>Lĩnh vực hoạt động</h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="/">Trang chủ</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Lĩnh vực hoạt động
                  </li>
                </ol>
              </nav>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Services Content */}
      <section>
        <Container>
          <Row className="text-center mb-5">
            <Col lg={8} className="mx-auto">
              <h6 className="text-theme mb-3">Lĩnh vực hoạt động</h6>
              <h2 className="mb-4">Chuyên môn và dịch vụ của chúng tôi</h2>
              <p>
                Viện cũng triển khai nhiều nghiên cứu về lĩnh vực vật liệu mới, nhiệt luyện, 
                cơ khí chế tạo khuôn mẫu với mục tiêu ứng dụng vào thực tế cũng như nội địa hóa 
                các sản phẩm nhập khẩu.
              </p>
            </Col>
          </Row>
          <Row>
            <Col lg={4} md={6} className="mb-4">
              <div className="service-item text-center p-4 rounded">
                <div className="service-icon mb-4">
                  <i className="bi bi-gear text-theme" style={{ fontSize: '3rem' }}></i>
                </div>
                <h5 className="mb-3">Công nghệ đúc và vật liệu mới</h5>
                <p>
                  Nghiên cứu, phát triển các nhóm hợp kim đặc biệt dùng trong quốc phòng, y sinh. 
                  Mô phỏng thiết kế đúc bằng phần mềm MAGMASoft.
                </p>
                <a href="#" className="text-theme text-decoration-none">
                  Xem chi tiết <i className="bi bi-arrow-right ms-1"></i>
                </a>
              </div>
            </Col>
            <Col lg={4} md={6} className="mb-4">
              <div className="service-item text-center p-4 rounded">
                <div className="service-icon mb-4">
                  <i className="bi bi-thermometer-half text-theme" style={{ fontSize: '3rem' }}></i>
                </div>
                <h5 className="mb-3">Công nghệ xử lý nhiệt</h5>
                <p>
                  Nghiên cứu, dịch vụ nhiệt luyện chân không, nhiệt luyện truyền thống và hóa nhiệt luyện 
                  (thấm C, C-N, N) các loại khuôn và các sản phẩm cơ khí.
                </p>
                <a href="#" className="text-theme text-decoration-none">
                  Xem chi tiết <i className="bi bi-arrow-right ms-1"></i>
                </a>
              </div>
            </Col>
            <Col lg={4} md={6} className="mb-4">
              <div className="service-item text-center p-4 rounded">
                <div className="service-icon mb-4">
                  <i className="bi bi-tools text-theme" style={{ fontSize: '3rem' }}></i>
                </div>
                <h5 className="mb-3">Cơ khí chế tạo khuôn mẫu</h5>
                <p>
                  Thiết kế, chế tạo hoàn chỉnh các loại khuôn kim loại dùng trong các lĩnh vực 
                  rèn, dập, ép và đúc áp lực.
                </p>
                <a href="#" className="text-theme text-decoration-none">
                  Xem chi tiết <i className="bi bi-arrow-right ms-1"></i>
                </a>
              </div>
            </Col>
            <Col lg={4} md={6} className="mb-4">
              <div className="service-item text-center p-4 rounded">
                <div className="service-icon mb-4">
                  <i className="bi bi-clipboard-check text-theme" style={{ fontSize: '3rem' }}></i>
                </div>
                <h5 className="mb-3">Kiểm định vật liệu</h5>
                <p>
                  Thử nghiệm, kiểm định trong lĩnh vực hóa, cơ, không phá huỷ các loại vật liệu, 
                  kết cấu hàn và chi tiết máy.
                </p>
                <a href="#" className="text-theme text-decoration-none">
                  Xem chi tiết <i className="bi bi-arrow-right ms-1"></i>
                </a>
              </div>
            </Col>
            <Col lg={4} md={6} className="mb-4">
              <div className="service-item text-center p-4 rounded">
                <div className="service-icon mb-4">
                  <i className="bi bi-arrow-repeat text-theme" style={{ fontSize: '3rem' }}></i>
                </div>
                <h5 className="mb-3">Chuyển giao thiết bị/công nghệ</h5>
                <p>
                  Cung cấp và chuyển giao công nghệ các thiết bị về xử lý nhiệt, Các dây chuyền/ 
                  hệ thống kết cấu cơ khí.
                </p>
                <a href="#" className="text-theme text-decoration-none">
                  Xem chi tiết <i className="bi bi-arrow-right ms-1"></i>
                </a>
              </div>
            </Col>
            <Col lg={4} md={6} className="mb-4">
              <div className="service-item text-center p-4 rounded">
                <div className="service-icon mb-4">
                  <i className="bi bi-mortarboard text-theme" style={{ fontSize: '3rem' }}></i>
                </div>
                <h5 className="mb-3">Đào tạo, tư vấn công nghệ</h5>
                <p>
                  Đào tạo, tư vấn trong lĩnh vực như Công nghệ Đúc; Xử lý nhiệt; Kiểm định vật liệu; 
                  và các lĩnh vực khác.
                </p>
                <a href="#" className="text-theme text-decoration-none">
                  Xem chi tiết <i className="bi bi-arrow-right ms-1"></i>
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Additional Services Section */}
      <section className="light-bg">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="mb-4">Dịch vụ bổ sung</h2>
            </Col>
          </Row>
          <Row>
            <Col lg={6} className="mb-4">
              <div className="p-4">
                <h4 className="mb-3">Nghiên cứu và phát triển</h4>
                <p>
                  Thực hiện các dự án nghiên cứu khoa học, phát triển công nghệ mới và ứng dụng 
                  vào thực tế sản xuất. Hợp tác với các đối tác trong và ngoài nước để thúc đẩy 
                  sự phát triển của ngành cơ khí và luyện kim.
                </p>
                <ul className="list-icon style-1">
                  <li>
                    <i className="bi bi-check-circle-fill"></i>
                    <span>Nghiên cứu vật liệu mới</span>
                  </li>
                  <li>
                    <i className="bi bi-check-circle-fill"></i>
                    <span>Phát triển công nghệ đúc</span>
                  </li>
                  <li>
                    <i className="bi bi-check-circle-fill"></i>
                    <span>Ứng dụng công nghệ xử lý nhiệt</span>
                  </li>
                </ul>
              </div>
            </Col>
            <Col lg={6} className="mb-4">
              <div className="p-4">
                <h4 className="mb-3">Đào tạo và chuyển giao</h4>
                <p>
                  Cung cấp các khóa đào tạo chuyên sâu về công nghệ đúc, xử lý nhiệt, kiểm định 
                  vật liệu. Chuyển giao công nghệ và thiết bị cho các doanh nghiệp trong nước.
                </p>
                <ul className="list-icon style-1">
                  <li>
                    <i className="bi bi-check-circle-fill"></i>
                    <span>Đào tạo kỹ thuật viên</span>
                  </li>
                  <li>
                    <i className="bi bi-check-circle-fill"></i>
                    <span>Chuyển giao công nghệ</span>
                  </li>
                  <li>
                    <i className="bi bi-check-circle-fill"></i>
                    <span>Tư vấn kỹ thuật</span>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}
