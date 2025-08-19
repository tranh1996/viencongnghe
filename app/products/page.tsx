'use client';

import type { Metadata } from 'next';
import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { fetchProducts, fetchProductCategories, Product, ProductCategory } from '../../src/utils/api';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts('vi', 1, 20),
          fetchProductCategories('vi')
        ]);
        
        setProducts(productsData);
        setCategories(categoriesData);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = selectedCategory 
    ? products.filter(product => product.product_category.slug === selectedCategory)
    : products;

  const featuredProducts = products.filter(product => product.is_featured);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-theme" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: '3rem' }}></i>
          <p className="mt-3">{error}</p>
        </div>
      </div>
    );
  }

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

          {/* Category Filter */}
          {categories.length > 0 && (
            <Row className="mb-4">
              <Col>
                <div className="d-flex flex-wrap gap-2 justify-content-center">
                  <button
                    className={`btn ${!selectedCategory ? 'btn-theme' : 'btn-outline-theme'}`}
                    onClick={() => setSelectedCategory(null)}
                  >
                    Tất cả
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      className={`btn ${selectedCategory === category.slug ? 'btn-theme' : 'btn-outline-theme'}`}
                      onClick={() => setSelectedCategory(category.slug)}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </Col>
            </Row>
          )}

          {/* Products Grid */}
          <Row>
            {filteredProducts.map((product) => (
              <Col lg={4} md={6} className="mb-4" key={product.id}>
                <div className="card h-100">
                                     <img 
                     src={product.primary_image || product.product_category.image_url || '/images/product/01.jpg'} 
                     className="card-img-top" 
                     alt={product.name}
                     style={{ height: '200px', objectFit: 'cover' }}
                   />
                  <div className="card-body">
                    <h6 className="text-muted mb-2">{product.product_category.name}</h6>
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">
                      {product.description || product.content?.substring(0, 100) + '...' || 'Không có mô tả'}
                    </p>
                    <a href={`/products/${product.slug}`} className="text-theme text-decoration-none">
                      Xem chi tiết <i className="bi bi-arrow-right ms-1"></i>
                    </a>
                  </div>
                </div>
              </Col>
            ))}
          </Row>

          {/* Featured Products */}
          {featuredProducts.length > 0 && (
            <section className="mt-5">
              <Row className="text-center mb-4">
                <Col>
                  <h3>Sản phẩm đặc biệt</h3>
                </Col>
              </Row>
              <Row>
                {featuredProducts.slice(0, 2).map((product) => (
                  <Col lg={6} className="mb-4" key={product.id}>
                    <div className="card">
                                             <img 
                         src={product.primary_image || product.product_category.image_url || '/images/product/01.jpg'} 
                         className="card-img-top" 
                         alt={product.name}
                         style={{ height: '250px', objectFit: 'cover' }}
                       />
                      <div className="card-body">
                        <h6 className="text-muted mb-2">{product.product_category.name}</h6>
                        <h4 className="card-title">{product.name}</h4>
                        <p className="card-text">
                          {product.description || product.content?.substring(0, 150) + '...' || 'Không có mô tả'}
                        </p>
                        <a href={`/products/${product.slug}`} className="text-theme text-decoration-none">
                          Xem chi tiết <i className="bi bi-arrow-right ms-1"></i>
                        </a>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </section>
          )}

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
}
