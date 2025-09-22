'use client';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'next/navigation';
import { fetchProductBySlug, fetchProducts, Product } from '../../../src/utils/api';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const [productData, relatedData] = await Promise.all([
          fetchProductBySlug(slug, 'vi'),
          fetchProducts('vi', 1, 5) // Fetch 5 products for related products
        ]);
        
        setProduct(productData);
        setRelatedProducts(relatedData.products.filter(p => p.slug !== slug).slice(0, 5));
        setError(null);
      } catch (err) {
        console.error('Error fetching product data:', err);
        setError('Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProductData();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-theme" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: '3rem' }}></i>
          <h4 className="mt-3">Không tìm thấy sản phẩm</h4>
          <p className="text-muted">{error || 'Sản phẩm không tồn tại hoặc đã bị xóa.'}</p>
          <a href="/products" className="btn btn-theme">Quay lại danh sách sản phẩm</a>
        </div>
      </div>
    );
  }

  const allImages = [product.primary_image, ...product.gallery_images].filter(Boolean);

  return (
    <>
      <section className="page-title dark-bg">
        <Container>
          <Row>
            <Col>
              <h1>{product.name}</h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="/">Trang chủ</a>
                  </li>
                  <li className="breadcrumb-item">
                    <a href="/products">Sản phẩm & Dịch vụ</a>
                  </li>
                  <li className="breadcrumb-item">
                    <a href={`/products?category=${product.product_category.slug}`}>
                      {product.product_category.name}
                    </a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {product.name}
                  </li>
                </ol>
              </nav>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="py-5">
        <Container>
          <Row>
            {/* Main Content Area */}
            <Col lg={8}>
              {/* Product Image */}
              <div className="mb-4">
                <div className="position-relative">
                  <img 
                    src={allImages[currentImageIndex] || '/images/product/01.jpg'} 
                    className="img-fluid w-100" 
                    alt={product.name}
                    style={{ maxHeight: '500px', objectFit: 'cover' }}
                  />
                  {product.videos && product.videos.length > 0 && (
                    <div className="position-absolute bottom-0 start-0 m-3">
                      <i className="bi bi-play-circle-fill text-white" style={{ fontSize: '2rem' }}></i>
                    </div>
                  )}
                </div>
                
                {/* Image Gallery Thumbnails */}
                {allImages.length > 1 && (
                  <div className="d-flex gap-2 mt-3">
                    {allImages.map((image, index) => (
                      <img 
                        key={index}
                        src={image || '/images/product/01.jpg'} 
                        className={`img-thumbnail ${currentImageIndex === index ? 'border-theme' : ''}`}
                        alt={`${product.name} - ${index + 1}`}
                        style={{ width: '80px', height: '80px', objectFit: 'cover', cursor: 'pointer' }}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Product Title */}
              <h2 className="mb-3">{product.name}</h2>

              {/* Social Share Buttons */}
              <div className="mb-4">
                <div className="d-flex gap-2">
                  <a href="#" className="btn btn-outline-primary btn-sm">
                    <i className="bi bi-facebook"></i>
                  </a>
                  <a href="#" className="btn btn-outline-info btn-sm">
                    <i className="bi bi-twitter"></i>
                  </a>
                  <a href="#" className="btn btn-outline-secondary btn-sm">
                    <i className="bi bi-envelope"></i>
                  </a>
                  <a href="#" className="btn btn-outline-danger btn-sm">
                    <i className="bi bi-pinterest"></i>
                  </a>
                  <a href="#" className="btn btn-outline-primary btn-sm">
                    <i className="bi bi-linkedin"></i>
                  </a>
                </div>
              </div>

              {/* Product Description */}
              <div className="mb-4">
                <h4>Mô tả</h4>
                <div className="card">
                  <div className="card-body">
                    {product.description && (
                      <p className="mb-3">{product.description}</p>
                    )}
                    {product.content && (
                      <div dangerouslySetInnerHTML={{ __html: product.content }} />
                    )}
                  </div>
                </div>
              </div>

              {/* Product Specifications */}
              {(product.weight || product.dimensions || product.specifications) && (
                <div className="mb-4">
                  <h4>Thông số kỹ thuật</h4>
                  <div className="card">
                    <div className="card-body">
                      <Row>
                        {product.weight && (
                          <Col md={6}>
                            <p><strong>Trọng lượng:</strong> {product.weight}</p>
                          </Col>
                        )}
                        {product.dimensions && (
                          <Col md={6}>
                            <p><strong>Kích thước:</strong> {product.dimensions}</p>
                          </Col>
                        )}
                        {product.specifications && (
                          <Col md={12}>
                            <p><strong>Thông số:</strong></p>
                            <div dangerouslySetInnerHTML={{ __html: product.specifications }} />
                          </Col>
                        )}
                      </Row>
                    </div>
                  </div>
                </div>
              )}


            </Col>

            {/* Sidebar */}
            <Col lg={4}>
              {/* Contact Section */}
              <div className="card mb-4">
                <div className="card-header bg-theme text-white">
                  <h5 className="mb-0 text-white">LIÊN HỆ TƯ VẤN</h5>
                </div>
                <div className="card-body">
                  <div className="text-center mb-3">
                    <img src="/images/logo.png" alt="VIỆN CÔNG NGHỆ" style={{ maxHeight: '60px' }} />
                    <h6 className="mt-2">VIỆN CÔNG NGHỆ</h6>
                    <p className="text-muted small">INSTITUTE OF TECHNOLOGY</p>
                  </div>
                  
                  <div className="mb-3">
                    <p className="mb-1"><strong>Trụ sở chính:</strong></p>
                    <p className="small mb-1">Tòa nhà 8 tầng, số 25, Vũ Ngọc Phan, Hà Nội</p>
                    <p className="small mb-1">Lô 27B, khu Công nghiệp Quang Minh, Mê Linh, Hà Nội</p>
                  </div>
                  
                  <div className="mb-3">
                    <p className="mb-1"><strong>Email:</strong> viencongnghe@ritm.vn</p>
                    <p className="mb-1"><strong>Điện thoại:</strong> +84 243 776 3322</p>
                    <p className="mb-1"><strong>Fax:</strong> +84 243 835 9235</p>
                  </div>
                  
                  <div className="d-flex justify-content-around">
                    <div className="text-center">
                      <button className="btn btn-outline-theme rounded-circle mb-2 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                        <i className="bi bi-telephone"></i>
                      </button>
                      <p className="small mb-0">Gọi điện</p>
                    </div>
                    <div className="text-center">
                      <button className="btn btn-outline-theme rounded-circle mb-2 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                        <i className="bi bi-envelope"></i>
                      </button>
                      <p className="small mb-0">Gửi Email</p>
                    </div>
                    <div className="text-center">
                      <button className="btn btn-outline-theme rounded-circle mb-2 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                        <i className="bi bi-geo-alt"></i>
                      </button>
                      <p className="small mb-0">Chỉ đường</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Related Products */}
              <div className="card">
                <div className="card-header bg-theme text-white">
                  <h5 className="mb-0 text-white">CÁC SẢN PHẨM KHÁC</h5>
                </div>
                <div className="card-body">
                  {relatedProducts.map((relatedProduct) => (
                    <div key={relatedProduct.id} className="d-flex gap-3 mb-3">
                      <img 
                        src={relatedProduct.primary_image || relatedProduct.product_category.image_url || '/images/product/01.jpg'} 
                        alt={relatedProduct.name}
                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                      />
                      <div className="flex-grow-1">
                        <h6 className="mb-1">
                          <a href={`/products/${relatedProduct.slug}`} className="text-decoration-none text-dark">
                            {relatedProduct.name}
                          </a>
                        </h6>
                        <p className="text-muted small mb-0">
                          {new Date(relatedProduct.created_at).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  <div className="text-center mt-3">
                    <a href="/products" className="btn btn-outline-theme btn-sm">
                      Thư viện Hình ảnh hoạt động
                    </a>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <style jsx>{`
        .border-theme {
          border-color: var(--themeht-primary-color) !important;
        }
        
        .card-header.bg-theme {
          background-color: var(--themeht-primary-color) !important;
        }
        
        .btn-outline-theme {
          border-color: var(--themeht-primary-color);
          color: var(--themeht-primary-color);
        }
        
        .btn-outline-theme:hover {
          background-color: var(--themeht-primary-color);
          border-color: var(--themeht-primary-color);
          color: white;
        }
      `}</style>
    </>
  );
}
