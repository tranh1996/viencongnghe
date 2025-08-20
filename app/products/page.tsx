'use client';

import type { Metadata } from 'next';
import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { fetchProducts, fetchProductCategories, Product, ProductCategory } from '../../src/utils/api';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<string>('default');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20
  });

  useEffect(() => {
    // Get URL parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category') || null;
    const sort = searchParams.get('sort') || 'default';

    setSelectedCategory(category);
    setSortOrder(sort);
    setPagination(prev => ({ ...prev, currentPage: page, itemsPerPage: limit }));

    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsResponse, categoriesData] = await Promise.all([
          fetchProducts('vi', page, limit),
          fetchProductCategories('vi')
        ]);
        
        setProducts(productsResponse.products);
        setCategories(categoriesData);
        
        // Update pagination info from API response
        if (productsResponse.pagination) {
          setPagination({
            currentPage: productsResponse.pagination.current_page,
            totalPages: productsResponse.pagination.last_page,
            totalItems: productsResponse.pagination.total,
            itemsPerPage: productsResponse.pagination.per_page
          });
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  // Function to update URL parameters
  const updateURL = (params: { page?: number; category?: string | null; sort?: string }) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    
    if (params.page !== undefined) {
      newSearchParams.set('page', params.page.toString());
    }
    if (params.category !== undefined) {
      if (params.category) {
        newSearchParams.set('category', params.category);
      } else {
        newSearchParams.delete('category');
      }
    }
    if (params.sort !== undefined) {
      newSearchParams.set('sort', params.sort);
    }
    
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  // Handle category selection
  const handleCategorySelect = (categorySlug: string | null) => {
    updateURL({ category: categorySlug, page: 1 }); // Reset to page 1 when changing category
  };

  // Handle sorting
  const handleSortChange = (sort: string) => {
    updateURL({ sort, page: 1 }); // Reset to page 1 when changing sort
  };

  const filteredProducts = selectedCategory 
    ? products.filter(product => product.product_category.slug === selectedCategory)
    : products;

  // Apply sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOrder) {
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      default:
        return 0;
    }
  });

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

      <section className="py-5">
        <Container>
          {/* Category Filter Cards */}
          {categories.length > 0 && (
            <Row className="mb-5">
              <Col>
                <h2 className="text-center mb-4">Danh mục sản phẩm</h2>
                <Row>
                  {/* Category Cards */}
                  {categories.slice(0, 4).map((category) => (
                    <Col lg={3} md={6} className="mb-4" key={category.id}>
                      <div 
                        className={`card category-card h-100 ${selectedCategory === category.slug ? 'active' : ''}`}
                        onClick={() => handleCategorySelect(category.slug === selectedCategory ? null : category.slug)}
                        style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                      >
                        <div className="card-img-top position-relative" style={{ height: '200px', overflow: 'hidden' }}>
                          <img 
                            src={category.image_url || '/images/product/01.jpg'} 
                            className="w-100 h-100" 
                            alt={category.name}
                            style={{ objectFit: 'cover' }}
                          />
                          <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark" style={{ opacity: 0.7 }}></div>
                        </div>
                        <div className="card-body text-center">
                          <h5 className="card-title position-relative" style={{ zIndex: 2, color: '#fff', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                            {category.name}
                          </h5>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          )}

          {/* Results Counter and Sorting */}
          <Row className="mb-4 align-items-center">
            <Col md={6}>
              <div className="d-flex align-items-center gap-3">
                <p className="mb-0">
                  Hiển thị {pagination.currentPage === 1 ? 1 : ((pagination.currentPage - 1) * pagination.itemsPerPage) + 1}-{Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} của {pagination.totalItems} kết quả
                </p>
                {selectedCategory && (
                  <button 
                    className="btn btn-outline-theme btn-sm"
                    onClick={() => handleCategorySelect(null)}
                  >
                    Hiển thị tất cả
                  </button>
                )}
              </div>
            </Col>
            <Col md={6} className="text-md-end">
              <select 
                className="form-select d-inline-block w-auto"
                value={sortOrder}
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <option value="default">Thứ tự mặc định</option>
                <option value="name-asc">Tên A-Z</option>
                <option value="name-desc">Tên Z-A</option>
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
              </select>
            </Col>
          </Row>

          {/* Products Grid */}
          <Row>
            {sortedProducts.map((product) => (
              <Col lg={3} md={6} className="mb-4" key={product.id}>
                <div className="card product-card h-100">
                  <div className="position-relative">
                    <img 
                      src={product.primary_image || product.product_category.image_url || '/images/product/01.jpg'} 
                      className="card-img-top" 
                      alt={product.name}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <div className="position-absolute top-0 start-0 m-2">
                      <span className="badge" style={{ backgroundColor: 'var(--themeht-primary-color)', color: 'white', fontWeight: 'bold' }}>
                        {product.product_category.name}
                      </span>
                    </div>
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h6 className="card-title">{product.name}</h6>
                    <p className="card-text flex-grow-1">
                      {product.description || product.content?.substring(0, 100) + '...' || 'Sản phẩm của Viện Công Nghệ'}
                    </p>
                    <a href={`/products/${product.slug}`} className="btn btn-outline-theme btn-sm">
                      Xem chi tiết
                    </a>
                  </div>
                </div>
              </Col>
            ))}
          </Row>

          {/* No Products Message */}
          {sortedProducts.length === 0 && (
            <Row>
              <Col className="text-center py-5">
                <i className="bi bi-box text-muted" style={{ fontSize: '4rem' }}></i>
                <h4 className="mt-3">Không có sản phẩm nào</h4>
                <p className="text-muted">Không tìm thấy sản phẩm nào trong danh mục này.</p>
              </Col>
            </Row>
          )}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <Row className="mt-5">
              <Col className="text-center">
                <nav aria-label="Product pagination">
                  <ul className="pagination justify-content-center">
                    {/* Previous Page */}
                    <li className={`page-item ${pagination.currentPage === 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => updateURL({ page: pagination.currentPage - 1 })}
                        disabled={pagination.currentPage === 1}
                      >
                        <i className="bi bi-chevron-left"></i>
                      </button>
                    </li>
                    
                    {/* Page Numbers */}
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.currentPage >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.currentPage - 2 + i;
                      }
                      
                      return (
                        <li key={pageNum} className={`page-item ${pagination.currentPage === pageNum ? 'active' : ''}`}>
                          <button 
                            className="page-link"
                            onClick={() => updateURL({ page: pageNum })}
                          >
                            {pageNum}
                          </button>
                        </li>
                      );
                    })}
                    
                    {/* Next Page */}
                    <li className={`page-item ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => updateURL({ page: pagination.currentPage + 1 })}
                        disabled={pagination.currentPage === pagination.totalPages}
                      >
                        <i className="bi bi-chevron-right"></i>
                      </button>
                    </li>
                  </ul>
                </nav>
              </Col>
            </Row>
          )}
        </Container>
      </section>

                   <style jsx>{`
        .category-card {
          border: 2px solid transparent;
          transition: all 0.3s ease;
        }
        
        .category-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }
        
        .category-card.active {
          border-color: var(--themeht-primary-color);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .product-card {
          transition: all 0.3s ease;
          border: 1px solid #e9ecef;
        }
        
        .product-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }
        
        .card-img-top {
          transition: transform 0.3s ease;
        }
        
        .product-card:hover .card-img-top {
          transform: scale(1.05);
        }
      `}</style>
    </>
  );
}
