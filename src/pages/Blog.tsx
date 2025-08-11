import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Blog: React.FC = () => {
  return (
    <>
      <section className="page-title dark-bg">
        <Container>
          <Row>
            <Col>
              <h1>Tin tức</h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="/">Trang chủ</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Tin tức
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
              <h6 className="text-theme mb-3">Tin tức</h6>
              <h2 className="mb-4">Tin tức mới nhất</h2>
              <p>
                Cập nhật những tin tức mới nhất về hoạt động, nghiên cứu và phát triển 
                của Viện Công nghệ.
              </p>
            </Col>
          </Row>

          {/* Featured News */}
          <Row className="mb-5">
            <Col lg={8} className="mb-4">
              <div className="card">
                <img src="/images/blog/01.jpg" className="card-img-top" alt="Tin tức nổi bật" />
                <div className="card-body">
                  <h6 className="text-muted mb-2">27/05/25</h6>
                  <h3 className="card-title">Tháng công nhân – Lan tỏa yêu thương, chia sẻ khó khăn</h3>
                  <p className="card-text">
                    Hoạt động ý nghĩa trong tháng công nhân với nhiều hoạt động thiết thực, 
                    thể hiện sự quan tâm và chia sẻ của Viện Công nghệ đối với người lao động.
                  </p>
                  <a href="#" className="text-theme text-decoration-none">
                    Đọc thêm <i className="bi bi-arrow-right ms-1"></i>
                  </a>
                </div>
              </div>
            </Col>
            <Col lg={4} className="mb-4">
              <div className="card">
                <img src="/images/blog/02.jpg" className="card-img-top" alt="Tin tức" />
                <div className="card-body">
                  <h6 className="text-muted mb-2">20/12/24</h6>
                  <h5 className="card-title">Hoạt động hướng tới kỷ niệm 80 năm ngày thành lập Quân đội nhân dân Việt Nam</h5>
                  <p className="card-text">
                    Các hoạt động kỷ niệm 80 năm ngày thành lập Quân đội nhân dân Việt Nam...
                  </p>
                  <a href="#" className="text-theme text-decoration-none">
                    Đọc thêm <i className="bi bi-arrow-right ms-1"></i>
                  </a>
                </div>
              </div>
            </Col>
          </Row>

          {/* News Categories */}
          <Row>
            <Col lg={4} md={6} className="mb-4">
              <div className="card h-100">
                <div className="card-header bg-theme text-white">
                  <h5 className="mb-0">Tin hoạt động</h5>
                </div>
                <div className="card-body">
                  <ul className="list-unstyled">
                    <li className="mb-3">
                      <a href="#" className="text-decoration-none">
                        <h6>Báo giá may trang phục nhân viên năm 2025</h6>
                        <small className="text-muted">11/04/25</small>
                      </a>
                    </li>
                    <li className="mb-3">
                      <a href="#" className="text-decoration-none">
                        <h6>Viện công nghệ trao kinh phí hỗ trợ bão Yagi</h6>
                        <small className="text-muted">23/09/24</small>
                      </a>
                    </li>
                    <li className="mb-3">
                      <a href="#" className="text-decoration-none">
                        <h6>Triển lãm Quốc tế về công nghiệp hỗ trợ VIMEXPO 2022</h6>
                        <small className="text-muted">21/11/22</small>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </Col>

            <Col lg={4} md={6} className="mb-4">
              <div className="card h-100">
                <div className="card-header bg-theme text-white">
                  <h5 className="mb-0">Tin khoa học công nghệ</h5>
                </div>
                <div className="card-body">
                  <ul className="list-unstyled">
                    <li className="mb-3">
                      <a href="#" className="text-decoration-none">
                        <h6>Giới thiệu kí hiệu mác thép theo tiêu chuẩn Nhật Bản</h6>
                        <small className="text-muted">15/03/24</small>
                      </a>
                    </li>
                    <li className="mb-3">
                      <a href="#" className="text-decoration-none">
                        <h6>Tiêu chuẩn thử kéo Việt Nam</h6>
                        <small className="text-muted">10/02/24</small>
                      </a>
                    </li>
                    <li className="mb-3">
                      <a href="#" className="text-decoration-none">
                        <h6>Sản phẩm tiêu biểu Viện Công Nghệ</h6>
                        <small className="text-muted">05/01/24</small>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </Col>

            <Col lg={4} md={6} className="mb-4">
              <div className="card h-100">
                <div className="card-header bg-theme text-white">
                  <h5 className="mb-0">Hoạt động đào tạo</h5>
                </div>
                <div className="card-body">
                  <ul className="list-unstyled">
                    <li className="mb-3">
                      <a href="#" className="text-decoration-none">
                        <h6>Chương trình huấn luyện nghiệp vụ thực tập phương án PCCC & CNCH</h6>
                        <small className="text-muted">20/06/23</small>
                      </a>
                    </li>
                    <li className="mb-3">
                      <a href="#" className="text-decoration-none">
                        <h6>Huấn luyện Nghiệp vụ thực tập phương án PCCC&CHCN</h6>
                        <small className="text-muted">15/05/22</small>
                      </a>
                    </li>
                    <li className="mb-3">
                      <a href="#" className="text-decoration-none">
                        <h6>Chương trình huấn luyện an toàn vệ sinh lao động năm 2022</h6>
                        <small className="text-muted">10/03/22</small>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </Col>
          </Row>

          {/* Professional Articles */}
          <section id="professional" className="mt-5">
            <Row className="text-center mb-4">
              <Col>
                <h3>Bài viết chuyên môn</h3>
              </Col>
            </Row>
            <Row>
              <Col lg={4} md={6} className="mb-4">
                <div className="card h-100">
                  <img src="/images/blog/03.jpg" className="card-img-top" alt="Bài viết chuyên môn" />
                  <div className="card-body">
                    <h5 className="card-title">Chuyện kể về Kim Loại Quyển 1</h5>
                    <p className="card-text">
                      Bài viết chuyên sâu về các loại kim loại và ứng dụng trong công nghiệp...
                    </p>
                    <a href="#" className="text-theme text-decoration-none">
                      Đọc thêm <i className="bi bi-arrow-right ms-1"></i>
                    </a>
                  </div>
                </div>
              </Col>
              <Col lg={4} md={6} className="mb-4">
                <div className="card h-100">
                  <img src="/images/blog/04.jpg" className="card-img-top" alt="Bài viết chuyên môn" />
                  <div className="card-body">
                    <h5 className="card-title">Thiết kế, lắp đặt và chuyển giao trong lĩnh vực nhiệt luyện</h5>
                    <p className="card-text">
                      Hướng dẫn chi tiết về quy trình thiết kế và lắp đặt hệ thống nhiệt luyện...
                    </p>
                    <a href="#" className="text-theme text-decoration-none">
                      Đọc thêm <i className="bi bi-arrow-right ms-1"></i>
                    </a>
                  </div>
                </div>
              </Col>
              <Col lg={4} md={6} className="mb-4">
                <div className="card h-100">
                  <img src="/images/blog/05.jpg" className="card-img-top" alt="Bài viết chuyên môn" />
                  <div className="card-body">
                    <h5 className="card-title">Nguyên lý tôi phân cấp, tôi phân cấp trong lò chân không đơn buồng</h5>
                    <p className="card-text">
                      Nghiên cứu về nguyên lý và ứng dụng của công nghệ tôi phân cấp...
                    </p>
                    <a href="#" className="text-theme text-decoration-none">
                      Đọc thêm <i className="bi bi-arrow-right ms-1"></i>
                    </a>
                  </div>
                </div>
              </Col>
            </Row>
          </section>
        </Container>
      </section>
    </>
  );
};

export default Blog; 