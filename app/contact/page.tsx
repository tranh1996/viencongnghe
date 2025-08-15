'use client';

import type { Metadata } from 'next';
import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function ContactPage() {
  return (
    <>
      <section className="page-title dark-bg">
        <Container>
          <Row>
            <Col>
              <h1>Liên hệ</h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="/">Trang chủ</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Liên hệ
                  </li>
                </ol>
              </nav>
            </Col>
          </Row>
        </Container>
      </section>

      <section>
        <Container>
          <Row className="text-center mb-5">
            <Col lg={8} className="mx-auto">
              <h6 className="text-theme mb-3">Liên hệ với chúng tôi</h6>
              <h2 className="mb-4">Thông tin liên hệ</h2>
              <p>
                Sẵn sàng hợp tác với chúng tôi? Liên hệ với đội ngũ chuyên gia ngay hôm nay 
                để thảo luận về nhu cầu và khám phá cách chúng tôi có thể giúp bạn đạt được mục tiêu.
              </p>
            </Col>
          </Row>
          <Row>
            <Col lg={8} className="mb-4">
              <div className="contact-form p-4 rounded">
                <h4 className="mb-4">Gửi tin nhắn cho chúng tôi</h4>
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Họ và tên</Form.Label>
                        <Form.Control type="text" placeholder="Nhập họ và tên của bạn" />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Công ty</Form.Label>
                        <Form.Control type="text" placeholder="Nhập tên công ty" />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="Nhập email của bạn" />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Điện thoại</Form.Label>
                        <Form.Control type="tel" placeholder="Nhập số điện thoại" />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label>Tiêu đề</Form.Label>
                    <Form.Control type="text" placeholder="Nhập tiêu đề" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Nội dung</Form.Label>
                    <Form.Control as="textarea" rows={5} placeholder="Nhập nội dung tin nhắn" />
                  </Form.Group>
                  <Button variant="primary" className="themeht-btn primary-btn">
                    Gửi tin nhắn
                  </Button>
                </Form>
              </div>
            </Col>
            <Col lg={4}>
              <div className="contact-info p-4 rounded">
                <h4 className="mb-4">Thông tin liên hệ</h4>
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
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Map Section */}
      <section className="light-bg">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="mb-4">Vị trí của chúng tôi</h2>
            </Col>
          </Row>
          <Row>
            <Col lg={6} className="mb-4">
              <div className="p-4">
                <h4 className="mb-3">Trụ sở chính</h4>
                <p>
                  <strong>Địa chỉ:</strong> Tòa nhà 8 tầng, số 25, Vũ Ngọc Phan, Hà Nội<br />
                  <strong>Điện thoại:</strong> +84 243 776 3322<br />
                  <strong>Email:</strong> viencongnghe@ritm.vn
                </p>
                <div className="mt-3">
                  <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="themeht-btn primary-btn">
                    Chỉ đường
                  </a>
                </div>
              </div>
            </Col>
            <Col lg={6} className="mb-4">
              <div className="p-4">
                <h4 className="mb-3">Cơ sở 2</h4>
                <p>
                  <strong>Địa chỉ:</strong> Lô 27B, khu Công nghiệp Quang Minh, Mê Linh, Hà Nội<br />
                  <strong>Điện thoại:</strong> +84 243 776 3322<br />
                  <strong>Email:</strong> viencongnghe@ritm.vn
                </p>
                <div className="mt-3">
                  <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="themeht-btn primary-btn">
                    Chỉ đường
                  </a>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}
