import React from 'react';
import Link from 'next/link';
import { Container, Row, Col, Button } from 'react-bootstrap';

export default function NotFound() {
  return (
    <section className="py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} className="text-center">
            <div className="error-page">
              <h1 className="display-1 text-muted">404</h1>
              <h2 className="mb-4">Không tìm thấy trang</h2>
              <p className="lead mb-4">
                Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Link href="/" className="btn btn-primary">
                  Về trang chủ
                </Link>
                <Link href="/contact" className="btn btn-outline-primary">
                  Liên hệ
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
