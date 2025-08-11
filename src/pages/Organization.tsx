import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useLanguage } from '../contexts/LanguageContext';
import BannerSlider from '../components/BannerSlider';

const Organization: React.FC = () => {
  const { t } = useLanguage();

  // Banner slides for organizational structure
  const bannerSlides = [
    {
      id: 1,
      image: '/images/banner/01.jpg',
      title: 'Cơ cấu tổ chức',
      subtitle: 'Viện Công nghệ',
      description: 'Tổ chức khoa học, hiện đại với các phòng ban chuyên môn cao',
      primaryButton: {
        text: 'Tìm hiểu thêm',
        link: '/about'
      },
      secondaryButton: {
        text: 'Liên hệ',
        link: '/contact'
      }
    },
    {
      id: 2,
      image: '/images/banner/02.jpg',
      title: 'Ban Lãnh đạo',
      subtitle: 'Đội ngũ quản lý',
      description: 'Ban lãnh đạo giàu kinh nghiệm, tầm nhìn chiến lược',
      primaryButton: {
        text: 'Xem chi tiết',
        link: '#admin'
      }
    },
    {
      id: 3,
      image: '/images/banner/03.jpg',
      title: 'Các Phòng Ban',
      subtitle: 'Chuyên môn hóa',
      description: 'Các phòng ban chuyên môn với đội ngũ kỹ sư, chuyên gia hàng đầu',
      primaryButton: {
        text: 'Khám phá',
        link: '#units'
      }
    },
    {
      id: 4,
      image: '/images/banner/04.jpg',
      title: 'Nghiên cứu & Phát triển',
      subtitle: 'Đổi mới sáng tạo',
      description: 'Trung tâm nghiên cứu và phát triển công nghệ tiên tiến',
      primaryButton: {
        text: 'Dự án R&D',
        link: '/research'
      }
    }
  ];

  // Organizational structure data
  const organizationalUnits = [
    {
      id: 'admin',
      title: 'Ban Lãnh đạo',
      description: 'Ban lãnh đạo Viện Công nghệ với nhiều năm kinh nghiệm trong lĩnh vực công nghệ và quản lý',
      members: [
        { name: 'TS. Nguyễn Văn A', position: 'Viện trưởng' },
        { name: 'PGS.TS. Trần Thị B', position: 'Phó Viện trưởng' },
        { name: 'TS. Lê Văn C', position: 'Phó Viện trưởng' }
      ],
      icon: 'bi bi-person-badge'
    },
    {
      id: 'accounting',
      title: 'Phòng Kế toán - Tài chính',
      description: 'Quản lý tài chính, kế toán và ngân sách của Viện',
      functions: [
        'Quản lý tài chính và ngân sách',
        'Kế toán và báo cáo tài chính',
        'Quản lý tài sản và cơ sở vật chất',
        'Tư vấn tài chính cho các dự án'
      ],
      icon: 'bi bi-calculator'
    },
    {
      id: 'testing',
      title: 'Phòng Thử nghiệm - Kiểm định',
      description: 'Thực hiện các thử nghiệm, kiểm định chất lượng vật liệu và sản phẩm',
      functions: [
        'Thử nghiệm cơ học vật liệu',
        'Kiểm định không phá hủy',
        'Phân tích hóa học',
        'Kiểm tra chất lượng sản phẩm'
      ],
      icon: 'bi bi-clipboard-check'
    },
    {
      id: 'technology',
      title: 'Phòng Công nghệ',
      description: 'Nghiên cứu và phát triển các công nghệ mới trong lĩnh vực cơ khí',
      functions: [
        'Nghiên cứu công nghệ đúc',
        'Phát triển vật liệu mới',
        'Tối ưu hóa quy trình sản xuất',
        'Chuyển giao công nghệ'
      ],
      icon: 'bi bi-gear-wide-connected'
    },
    {
      id: 'quality',
      title: 'Phòng Quản lý chất lượng',
      description: 'Đảm bảo chất lượng sản phẩm và quy trình sản xuất',
      functions: [
        'Xây dựng hệ thống quản lý chất lượng',
        'Kiểm soát chất lượng sản xuất',
        'Đánh giá và cải tiến quy trình',
        'Đào tạo về chất lượng'
      ],
      icon: 'bi bi-award'
    },
    {
      id: 'mold',
      title: 'Phòng Khuôn mẫu',
      description: 'Thiết kế và chế tạo các loại khuôn kim loại',
      functions: [
        'Thiết kế khuôn đúc',
        'Chế tạo khuôn kim loại',
        'Bảo trì và sửa chữa khuôn',
        'Tư vấn kỹ thuật khuôn mẫu'
      ],
      icon: 'bi bi-box'
    },
    {
      id: 'research',
      title: 'Phòng Nghiên cứu',
      description: 'Thực hiện các nghiên cứu khoa học và phát triển sản phẩm mới',
      functions: [
        'Nghiên cứu cơ bản và ứng dụng',
        'Phát triển sản phẩm mới',
        'Hợp tác nghiên cứu quốc tế',
        'Xuất bản công trình khoa học'
      ],
      icon: 'bi bi-microscope'
    },
    {
      id: 'company',
      title: 'Công ty TNHH MTV',
      description: 'Đơn vị sự nghiệp có thu trực thuộc Viện Công nghệ',
      functions: [
        'Sản xuất và kinh doanh',
        'Dịch vụ kỹ thuật',
        'Tư vấn công nghệ',
        'Đào tạo và chuyển giao'
      ],
      icon: 'bi bi-building'
    }
  ];

  return (
    <>
      {/* Banner Slider */}
      <BannerSlider slides={bannerSlides} />

      {/* Organizational Structure Overview */}
      <section className="light-bg py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col lg={8} className="mx-auto">
              <h6 className="text-theme mb-3">Cơ cấu tổ chức</h6>
              <h2 className="mb-4">Tổ chức và Quản lý</h2>
              <p>
                Viện Công nghệ được tổ chức theo mô hình hiện đại với các phòng ban chuyên môn, 
                đảm bảo hiệu quả hoạt động và phát triển bền vững.
              </p>
            </Col>
          </Row>

          {/* Organizational Chart */}
          <Row className="mb-5">
            <Col lg={12}>
              <div className="org-chart-container text-center">
                <div className="org-chart">
                  <div className="org-level-1">
                    <div className="org-item">
                      <i className="bi bi-building"></i>
                      <h5>Viện Công nghệ</h5>
                    </div>
                  </div>
                  <div className="org-level-2">
                    <div className="org-item">
                      <i className="bi bi-person-badge"></i>
                      <h6>Ban Lãnh đạo</h6>
                    </div>
                    <div className="org-item">
                      <i className="bi bi-gear-wide-connected"></i>
                      <h6>Phòng Công nghệ</h6>
                    </div>
                    <div className="org-item">
                      <i className="bi bi-clipboard-check"></i>
                      <h6>Phòng Thử nghiệm</h6>
                    </div>
                    <div className="org-item">
                      <i className="bi bi-award"></i>
                      <h6>Phòng Chất lượng</h6>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          {/* Detailed Units */}
          <Row>
            {organizationalUnits.map((unit) => (
              <Col lg={6} md={6} className="mb-4" key={unit.id}>
                <Card className="h-100 org-unit-card">
                  <Card.Body>
                    <div className="d-flex align-items-center mb-3">
                      <div className="org-icon me-3">
                        <i className={unit.icon}></i>
                      </div>
                      <div>
                        <h5 className="card-title mb-1">{unit.title}</h5>
                        <p className="card-text text-muted">{unit.description}</p>
                      </div>
                    </div>
                    
                    {unit.members && (
                      <div className="mb-3">
                        <h6 className="text-theme">Thành viên:</h6>
                        <ul className="list-unstyled">
                          {unit.members.map((member, index) => (
                            <li key={index} className="mb-1">
                              <strong>{member.name}</strong> - {member.position}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {unit.functions && (
                      <div>
                        <h6 className="text-theme">Chức năng chính:</h6>
                        <ul className="list-unstyled">
                          {unit.functions.map((func, index) => (
                            <li key={index} className="mb-1">
                              <i className="bi bi-check-circle-fill text-success me-2"></i>
                              {func}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Contact CTA */}
      <section className="primary-bg text-white">
        <Container>
          <Row className="text-center">
            <Col lg={8} className="mx-auto">
              <h2 className="mb-4">Liên hệ với chúng tôi</h2>
              <p className="mb-4">
                Để biết thêm thông tin về cơ cấu tổ chức hoặc hợp tác với các phòng ban, 
                vui lòng liên hệ với chúng tôi.
              </p>
              <a href="/contact" className="themeht-btn secondary-btn me-3">
                Liên hệ ngay
              </a>
              <a href="/about" className="themeht-btn primary-btn">
                Tìm hiểu thêm
              </a>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Organization;
