import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Products: React.FC = () => {
  return (
    <>
      <section className="page-title dark-bg">
        <Container>
          <Row>
            <Col>
              <h1>Sản phẩm & Dịch vụ</h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="/">Trang chủ</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Sản phẩm & Dịch vụ
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
              <h6 className="text-theme mb-3">SẢN PHẨM & DỊCH VỤ</h6>
              <h2 className="mb-4">Các sản phẩm và dịch vụ của chúng tôi</h2>
              <p>
                Viện Công nghệ cung cấp đa dạng các sản phẩm và dịch vụ trong lĩnh vực 
                cơ khí, luyện kim và công nghệ vật liệu.
              </p>
            </Col>
          </Row>

          <Row>
            <Col lg={4} md={6} className="mb-4">
              <div className="card h-100">
                <img src="/images/product/01.jpg" className="card-img-top" alt="Bộ dưỡng kiểm trục" />
                <div className="card-body">
                  <h6 className="text-muted mb-2">Khoa học công nghệ</h6>
                  <h5 className="card-title">Bộ dưỡng kiểm trục và kiểm lỗ</h5>
                  <p className="card-text">
                    + dưỡng Ø162-No Go dung sai (-0,02) – (-0,025) mm + dưỡng Ø162-Go: dung...
                  </p>
                  <a href="#" className="text-theme text-decoration-none">
                    Xem chi tiết <i className="bi bi-arrow-right ms-1"></i>
                  </a>
                </div>
              </div>
            </Col>

            <Col lg={4} md={6} className="mb-4">
              <div className="card h-100">
                <img src="/images/product/02.jpg" className="card-img-top" alt="Lò Ram" />
                <div className="card-body">
                  <h6 className="text-muted mb-2">Khoa học công nghệ</h6>
                  <h5 className="card-title">Lò Ram</h5>
                  <p className="card-text">
                    – Công suất 65kW; Điều khiển PID; Nhiệt độ làm việc tối đa 650oC;...
                  </p>
                  <a href="#" className="text-theme text-decoration-none">
                    Xem chi tiết <i className="bi bi-arrow-right ms-1"></i>
                  </a>
                </div>
              </div>
            </Col>

            <Col lg={4} md={6} className="mb-4">
              <div className="card h-100">
                <img src="/images/product/03.jpg" className="card-img-top" alt="Thiết bị gia công lạnh" />
                <div className="card-body">
                  <h6 className="text-muted mb-2">Khoa học công nghệ</h6>
                  <h5 className="card-title">Thiết bị gia công lạnh</h5>
                  <p className="card-text">
                    – Kích thước không gian làm việc: 400 x 400 x 600 (mm) –...
                  </p>
                  <a href="#" className="text-theme text-decoration-none">
                    Xem chi tiết <i className="bi bi-arrow-right ms-1"></i>
                  </a>
                </div>
              </div>
            </Col>

            <Col lg={4} md={6} className="mb-4">
              <div className="card h-100">
                <img src="/images/product/04.jpg" className="card-img-top" alt="Lò gas" />
                <div className="card-body">
                  <h6 className="text-muted mb-2">Khoa học công nghệ</h6>
                  <h5 className="card-title">Lò gas</h5>
                  <p className="card-text">
                    – Điều khiển tự động, kỹ thuật số – Nhiệt độ tối đa 1.300...
                  </p>
                  <a href="#" className="text-theme text-decoration-none">
                    Xem chi tiết <i className="bi bi-arrow-right ms-1"></i>
                  </a>
                </div>
              </div>
            </Col>

            <Col lg={4} md={6} className="mb-4">
              <div className="card h-100">
                <img src="/images/product/05.jpg" className="card-img-top" alt="Lò sấy tầng sôi" />
                <div className="card-body">
                  <h6 className="text-muted mb-2">Khoa học công nghệ</h6>
                  <h5 className="card-title">Lò sấy tầng sôi</h5>
                  <p className="card-text">
                    – Công suất 8-15 tấn/h – Dùng trong khai thác các loại khoáng sản...
                  </p>
                  <a href="#" className="text-theme text-decoration-none">
                    Xem chi tiết <i className="bi bi-arrow-right ms-1"></i>
                  </a>
                </div>
              </div>
            </Col>

            <Col lg={4} md={6} className="mb-4">
              <div className="card h-100">
                <img src="/images/product/06.jpg" className="card-img-top" alt="Cần máy 235" />
                <div className="card-body">
                  <h6 className="text-muted mb-2">Đúc</h6>
                  <h5 className="card-title">Cần máy 235 – Cụm lắp máy cưa Pilouse</h5>
                  <p className="card-text">
                    – Vật liệu: Gang xám FC200. – Khách hàng: Pilouse- Tiệp.
                  </p>
                  <a href="#" className="text-theme text-decoration-none">
                    Xem chi tiết <i className="bi bi-arrow-right ms-1"></i>
                  </a>
                </div>
              </div>
            </Col>
          </Row>

          {/* Special Products */}
          <section className="mt-5">
            <Row className="text-center mb-4">
              <Col>
                <h3>Sản phẩm đặc biệt</h3>
              </Col>
            </Row>
            <Row>
              <Col lg={6} className="mb-4">
                <div className="card">
                  <img src="/images/product/01.jpg" className="card-img-top" alt="Hợp kim Titan" />
                  <div className="card-body">
                    <h6 className="text-muted mb-2">Khoa học công nghệ</h6>
                    <h4 className="card-title">Hợp kim Titan ứng dụng trong lĩnh vực y tế (Ti-6Al-7Nb và Ti-5Al-2.5Fe)</h4>
                    <p className="card-text">
                      Vật liệu do Viện Công nghệ chế tạo và hợp tác với Đại học...
                    </p>
                    <a href="#" className="text-theme text-decoration-none">
                      Xem chi tiết <i className="bi bi-arrow-right ms-1"></i>
                    </a>
                  </div>
                </div>
              </Col>
              <Col lg={6} className="mb-4">
                <div className="card">
                  <img src="/images/product/02.jpg" className="card-img-top" alt="Khuôn rèn kìm" />
                  <div className="card-body">
                    <h6 className="text-muted mb-2">Gia công cơ khí</h6>
                    <h4 className="card-title">Khuôn rèn kìm</h4>
                    <p className="card-text">
                      Gia công theo đơn đặt hàng
                    </p>
                    <a href="#" className="text-theme text-decoration-none">
                      Xem chi tiết <i className="bi bi-arrow-right ms-1"></i>
                    </a>
                  </div>
                </div>
              </Col>
            </Row>
          </section>

          {/* Services Section */}
          <section className="light-bg mt-5">
            <Row className="text-center mb-4">
              <Col>
                <h3>Dịch vụ của chúng tôi</h3>
              </Col>
            </Row>
            <Row>
              <Col lg={4} md={6} className="mb-4">
                <div className="text-center p-4">
                  <div className="mb-3">
                    <i className="bi bi-gear text-theme" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <h5>Công nghệ đúc và vật liệu mới</h5>
                  <p>
                    Nghiên cứu, phát triển các nhóm hợp kim đặc biệt dùng trong quốc phòng, y sinh.
                  </p>
                </div>
              </Col>
              <Col lg={4} md={6} className="mb-4">
                <div className="text-center p-4">
                  <div className="mb-3">
                    <i className="bi bi-thermometer-half text-theme" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <h5>Công nghệ xử lý nhiệt</h5>
                  <p>
                    Nghiên cứu, dịch vụ nhiệt luyện chân không, nhiệt luyện truyền thống.
                  </p>
                </div>
              </Col>
              <Col lg={4} md={6} className="mb-4">
                <div className="text-center p-4">
                  <div className="mb-3">
                    <i className="bi bi-tools text-theme" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <h5>Cơ khí chế tạo khuôn mẫu</h5>
                  <p>
                    Thiết kế, chế tạo hoàn chỉnh các loại khuôn kim loại.
                  </p>
                </div>
              </Col>
            </Row>
          </section>
        </Container>
      </section>
    </>
  );
};

export default Products;
