'use client';

import type { Metadata } from 'next';
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert, Pagination, Form } from 'react-bootstrap';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchPosts, fetchBlogCategories, searchPosts, News, NewsCategory } from '@/utils/api';
import OptimizedImage from '@/components/OptimizedImage';
import { useSearchParams, useRouter } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function BlogPage() {
  const { language, t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [posts, setPosts] = useState<News[]>([]);
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<News[]>([]);
  const [searchTotal, setSearchTotal] = useState<number>(0);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isSearchMode, setIsSearchMode] = useState<boolean>(false);
  
  const currentPage = parseInt(searchParams.get('page') || '1');
  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (currentSearch) {
          // Search mode
          setIsSearchMode(true);
          setSearchQuery(currentSearch);
          const searchData = await searchPosts(currentSearch, language);
          setSearchResults(searchData.posts);
          setSearchTotal(searchData.total);
        } else {
          // Normal mode
          setIsSearchMode(false);
          const [postsData, categoriesData] = await Promise.all([
            fetchPosts(language, currentPage, 10, currentCategory || undefined),
            fetchBlogCategories(language)
          ]);
          
          setPosts(postsData.posts);
          setPagination(postsData.pagination);
          setCategories(categoriesData);
          setSelectedCategory(currentCategory);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [language, currentPage, currentCategory, currentSearch]);

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams();
    if (category) {
      params.set('category', category);
    }
    params.set('page', '1');
    router.push(`/blog?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams();
    if (currentCategory) {
      params.set('category', currentCategory);
    }
    if (currentSearch) {
      params.set('search', currentSearch);
    }
    params.set('page', page.toString());
    router.push(`/blog?${params.toString()}`);
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      // Clear search and return to normal mode
      const params = new URLSearchParams();
      if (currentCategory) {
        params.set('category', currentCategory);
      }
      router.push(`/blog?${params.toString()}`);
      return;
    }

    const params = new URLSearchParams();
    params.set('search', query);
    params.set('page', '1');
    router.push(`/blog?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery('');
    const params = new URLSearchParams();
    if (currentCategory) {
      params.set('category', currentCategory);
    }
    router.push(`/blog?${params.toString()}`);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) {
      return '';
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return '';
    }
    return date.toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const renderPagination = () => {
    if (!pagination || pagination.last_page <= 1) return null;

    const items = [];
    const startPage = Math.max(1, pagination.current_page - 2);
    const endPage = Math.min(pagination.last_page, pagination.current_page + 2);

    // Previous button
    if (pagination.current_page > 1) {
      items.push(
        <Pagination.Prev 
          key="prev" 
          onClick={() => handlePageChange(pagination.current_page - 1)}
        />
      );
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === pagination.current_page}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    // Next button
    if (pagination.current_page < pagination.last_page) {
      items.push(
        <Pagination.Next 
          key="next" 
          onClick={() => handlePageChange(pagination.current_page + 1)}
        />
      );
    }

    return <Pagination className="justify-content-center mt-4">{items}</Pagination>;
  };

  if (loading) {
    return (
      <>
        <section className="page-title dark-bg">
          <Container>
            <Row>
              <Col>
                <h1>{t('blog.pageTitle')}</h1>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="/">{t('blog.breadcrumb.home')}</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      {t('blog.breadcrumb.news')}
                    </li>
                  </ol>
                </nav>
              </Col>
            </Row>
          </Container>
        </section>

        <section>
          <Container>
            <Row className="text-center">
              <Col>
                <Spinner animation="border" role="status" className="mb-3">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p>{t('organization.loading')}</p>
              </Col>
            </Row>
          </Container>
        </section>
      </>
    );
  }

  if (error) {
    return (
      <>
        <section className="page-title dark-bg">
          <Container>
            <Row>
              <Col>
                <h1>{t('blog.pageTitle')}</h1>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="/">{t('blog.breadcrumb.home')}</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      {t('blog.breadcrumb.news')}
                    </li>
                  </ol>
                </nav>
              </Col>
            </Row>
          </Container>
        </section>

        <section>
          <Container>
            <Row>
              <Col>
                <Alert variant="danger">
                  <Alert.Heading>{t('organization.error')}</Alert.Heading>
                  <p>{error}</p>
                </Alert>
              </Col>
            </Row>
          </Container>
        </section>
      </>
    );
  }

  const breadcrumbItems = [
    {
      label: { vi: 'Trang chủ', en: 'Home' },
      href: '/'
    },
    {
      label: { vi: 'Tin tức - Sự kiện', en: 'News & Events' },
      active: true
    }
  ];

  return (
    <>
      <Breadcrumb
        title={{ vi: 'Tin tức - Sự kiện', en: 'News & Events' }}
        items={breadcrumbItems}
      />
      
      <div className="page-content">
        <section className="themeht-blogs">
          <Container>
            <Row>
              {/* Main Content - Posts List */}
              <Col lg={8} md={12}>
                {(isSearchMode ? searchResults : posts).length > 0 ? (
                  <>
                    {(isSearchMode ? searchResults : posts).map((post) => (
                      <div key={post.id} className="post-card post-horizontal">
                        <div className="row g-3 align-items-center">
                          <div className="col-md-4">
                            <div className="post-image">
                              <OptimizedImage
                                src={post.image_url || "/images/blog/01.jpg"}
                                className="img-fluid w-100"
                                alt={post.title}
                                width={300}
                                height={200}
                                context="blog-thumb"
                                style={{
                                  borderRadius: '8px',
                                  objectFit: 'cover',
                                  height: '180px'
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-md-8">
                            <div className="post-content">
                              <div className="post-title mb-2">
                                <h4 className="mb-2">
                                  <a href={`/blog/${post.slug}`} className="text-decoration-none">{post.title}</a>
                                </h4>
                              </div>
                              <div className="post-meta mb-2">
                                <ul className="list-inline mb-0 text-muted small">
                                  <li className="list-inline-item">
                                    <i className="bi bi-person-circle me-1"></i>
                                    <span>{t('blog.admin')}</span>
                                  </li>
                                  <li className="list-inline-item">
                                    <i className="bi bi-calendar3 me-1"></i>
                                    <span>{formatDate(post.created_at)}</span>
                                  </li>
                                  <li className="list-inline-item">
                                    <span className="badge bg-primary">
                                      {post.categories && post.categories.length > 0 ? (
                                         post.categories[0].name
                                      ) : (
                                        t('blog.noCategory')
                                      )}
                                    </span>
                                  </li>
                                </ul>
                              </div>
                              <p className="post-excerpt mb-2 text-muted">
                                {post.description ? truncateText(post.description, 120) : ''}
                              </p>
                              <a href={`/blog/${post.slug}`} className="read-more-link text-primary text-decoration-none fw-semibold">
                                {t('blog.readMore')} <i className="bi bi-arrow-right ms-1"></i>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Pagination - only show in normal mode */}
                    {!isSearchMode && pagination && pagination.last_page > 1 && (
                      <nav aria-label="Page navigation" className="mt-8">
                        <ul className="pagination">
                          {pagination.current_page > 1 && (
                            <li className="page-item">
                              <button 
                                className="page-link"
                                onClick={() => handlePageChange(pagination.current_page - 1)}
                              >
                                <i className="bi bi-arrow-left"></i>
                              </button>
                            </li>
                          )}
                          
                          {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                            const startPage = Math.max(1, pagination.current_page - 2);
                            const pageNum = startPage + i;
                            if (pageNum <= pagination.last_page) {
                              return (
                                <li key={pageNum} className={`page-item ${pageNum === pagination.current_page ? 'active' : ''}`}>
                                  <button 
                                    className="page-link"
                                    onClick={() => handlePageChange(pageNum)}
                                  >
                                    {pageNum}
                                  </button>
                                </li>
                              );
                            }
                            return null;
                          })}
                          
                          {pagination.current_page < pagination.last_page && (
                            <li className="page-item">
                              <button 
                                className="page-link"
                                onClick={() => handlePageChange(pagination.current_page + 1)}
                              >
                                <i className="bi bi-arrow-right"></i>
                              </button>
                            </li>
                          )}
                        </ul>
                      </nav>
                    )}
                  </>
                ) : (
                  <div className="text-center py-5">
                    {isSearchMode ? (
                      <>
                        <i className="bi bi-search display-4 text-muted"></i>
                        <h4 className="text-muted mt-3">{t('blog.search.noResults')}</h4>
                        <p className="text-muted">{t('blog.search.noResultsDescription')} &ldquo;{currentSearch}&rdquo;</p>
                        <button className="btn btn-outline-theme" onClick={clearSearch}>
                          {t('blog.search.clearSearch')}
                        </button>
                      </>
                    ) : (
                      <>
                        <h4 className="text-muted">{t('blog.noPosts')}</h4>
                        <p className="text-muted">{t('blog.noPostsDescription')}</p>
                      </>
                    )}
                  </div>
                )}
              </Col>

              {/* Right Sidebar */}
              <Col lg={4} md={12} className="mt-4 mt-lg-0 ps-lg-4">
                <div className="themeht-sidebar">
                  {/* Animated Activity Images Widget */}
                  <div
                    className="widget animated-widget clickable-widget"
                    style={{
                      boxShadow: '0 10px 30px 5px rgba(115, 113, 255, .06)',
                      padding: '30px',
                      borderRadius: '24px',
                      marginBottom: '50px',
                      background: 'linear-gradient(135deg, rgba(0,0,0,0.1), rgba(0,0,0,0.5)), url("/images/blog/bg-01.webp")',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      color: 'white',
                      position: 'relative',
                      overflow: 'hidden',
                      cursor: 'pointer'
                    }}
                    onClick={() => window.location.href = '/library'}
                  >
                    <div
                      className="animated-bg"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                        animation: 'pulse 3s ease-in-out infinite'
                      }}
                    />
                    <div style={{ position: 'relative', zIndex: 2 }}>
                      <h4 className="widget-title mb-3 fw-bold text-white">
                        <i className="bi bi-images me-2"></i>
                        {language === 'vi' ? 'Hình ảnh hoạt động' : 'Activity Gallery'}
                      </h4>
                      <p className="text-white-50 mb-0">
                      </p>
                    </div>
                  </div>

                  {/* Animated Products & Services Widget */}
                  <div
                    className="widget animated-widget clickable-widget"
                    style={{
                      boxShadow: '0 10px 30px 5px rgba(115, 113, 255, .06)',
                      padding: '30px',
                      borderRadius: '24px',
                      marginBottom: '50px',
                      background: 'linear-gradient(135deg, rgba(0,0,0,0.1), rgba(0,0,0,0.5)), url("/images/blog/bg-02.webp")',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      color: 'white',
                      position: 'relative',
                      overflow: 'hidden',
                      cursor: 'pointer'
                    }}
                    onClick={() => window.location.href = '/products'}
                  >
                    <div
                      className="animated-bg"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                        animation: 'pulse 3s ease-in-out infinite'
                      }}
                    />
                    <div style={{ position: 'relative', zIndex: 2 }}>
                      <h4 className="widget-title mb-3 fw-bold text-white">
                        <i className="bi bi-box-seam me-2"></i>
                        {language === 'vi' ? 'Sản phẩm & Dịch vụ' : 'Products & Services'}
                      </h4>
                    </div>
                  </div>

                  {/* Categories Widget */}
                  <div
                    className="widget widget-categories"
                    style={{
                      boxShadow: '0 10px 30px 5px rgba(115, 113, 255, .06)',
                      padding: '30px',
                      borderRadius: '24px',
                      marginBottom: '50px',
                      background: 'var(--themeht-white-color)'
                    }}
                  >
                    <h4 className="widget-title mb-3 fw-bold">
                      <i className="bi bi-tags me-2"></i>
                      {language === 'vi' ? 'Danh mục bài viết' : 'Article Categories'}
                    </h4>
                    <ul className="widget-categories list-unstyled">
                      <li>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleCategoryChange('');
                          }}
                          className={`d-flex align-items-center justify-content-between text-decoration-none py-2 ${
                            !selectedCategory ? 'active' : ''
                          }`}
                          style={{
                            borderBottom: '1px dashed #e0e0e0',
                            color: !selectedCategory ? '#1253be' : '#6c757d',
                            transition: 'all 0.3s ease',
                            fontWeight: !selectedCategory ? '700' : '600'
                          }}
                          onMouseEnter={(e) => {
                            if (selectedCategory) {
                              const linkElement = e.currentTarget as HTMLElement;
                              linkElement.style.color = '#1253be';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectedCategory) {
                              const linkElement = e.currentTarget as HTMLElement;
                              linkElement.style.color = '#6c757d';
                            }
                          }}
                        >
                          <div className="d-flex align-items-center">
                            <span
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                backgroundColor: '#1253be',
                                marginRight: '10px',
                                flexShrink: 0
                              }}
                            ></span>
                            <span>{t('blog.allCategories')}</span>
                          </div>
                          <i className="bi bi-chevron-right ms-1" style={{ fontSize: '14px', color: '#1253be' }}></i>
                        </a>
                      </li>
                      {categories.map((category) => (
                        <li key={category.id}>
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handleCategoryChange(category.slug);
                            }}
                            className={`d-flex align-items-center justify-content-between text-decoration-none py-2 ${
                              selectedCategory === category.slug ? 'active' : ''
                            }`}
                            style={{
                              borderBottom: '1px dashed #e0e0e0',
                              color: selectedCategory === category.slug ? '#1253be' : '#6c757d',
                              transition: 'all 0.3s ease',
                              fontWeight: selectedCategory === category.slug ? '700' : '600'
                            }}
                            onMouseEnter={(e) => {
                              if (selectedCategory !== category.slug) {
                                const linkElement = e.currentTarget as HTMLElement;
                                linkElement.style.color = '#1253be';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (selectedCategory !== category.slug) {
                                const linkElement = e.currentTarget as HTMLElement;
                                linkElement.style.color = '#6c757d';
                              }
                            }}
                          >
                            <div className="d-flex align-items-center">
                              <span
                                style={{
                                  width: '6px',
                                  height: '6px',
                                  borderRadius: '50%',
                                  backgroundColor: '#1253be',
                                  marginRight: '10px',
                                  flexShrink: 0
                                }}
                              ></span>
                              <span>{category.name}</span>
                            </div>
                            <i className="bi bi-chevron-right ms-1" style={{ fontSize: '14px', color: '#1253be' }}></i>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recent Posts Widget */}
                  <div
                    className="widget"
                    style={{
                      boxShadow: '0 10px 30px 5px rgba(115, 113, 255, .06)',
                      padding: '30px',
                      borderRadius: '24px',
                      marginBottom: '50px',
                      background: 'var(--themeht-white-color)'
                    }}
                  >
                    <h5 className="widget-title">
                      <i className="bi bi-clock-history me-2"></i>
                      {language === 'vi' ? 'Bài viết gần đây' : 'Recent Posts'}
                    </h5>

                    <div className="recent-post">
                      <ul className="list-unstyled">
                        {(!isSearchMode ? posts : []).slice(0, 3).map((post) => (
                          <li key={post.id} className="mb-3">
                            <div className="recent-post-thumb">
                              <OptimizedImage
                                src={post.image_url || "/images/blog/01.jpg"}
                                className="img-fluid"
                                alt={post.title}
                                width={80}
                                height={60}
                                context="blog-thumb"
                              />
                            </div>
                            <div className="recent-post-desc">
                              <a href={`/blog/${post.slug}`}>{post.title}</a>
                              <div className="post-date-small">{formatDate(post.created_at)}</div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.02);
          }
          100% {
            opacity: 0.6;
            transform: scale(1);
          }
        }

        .animated-widget {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .animated-widget:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px 10px rgba(115, 113, 255, .15) !important;
        }

        .post-card {
          margin-bottom: 2rem;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          overflow: hidden;
          background: white;
          padding: 1.5rem;
          transition: all 0.3s ease;
        }

        .post-card:hover {
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          transform: translateY(-2px);
        }

        .post-horizontal .post-image {
          height: 180px;
          overflow: hidden;
          border-radius: 8px;
        }

        .post-title h4 {
          font-size: 1.2rem;
          line-height: 1.4;
          font-weight: 600;
        }

        .post-title h4 a {
          color: #212529;
          text-decoration: none;
        }

        .post-title h4 a:hover {
          color: var(--themeht-primary-color);
        }

        .post-meta {
          font-size: 0.875rem;
        }

        .post-meta .list-inline-item {
          margin-right: 1rem;
        }

        .post-excerpt {
          font-size: 0.925rem;
          line-height: 1.5;
        }

        .read-more-link {
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .read-more-link:hover {
          color: var(--themeht-primary-color) !important;
          transform: translateX(3px);
        }
        
        .themeht-btn.primary-btn {
          background-color: var(--themeht-primary-color);
          border-color: var(--themeht-primary-color);
          color: white;
          padding: 0.75rem 1.5rem;
          text-decoration: none;
          border-radius: 4px;
          display: inline-block;
          border: 1px solid transparent;
          transition: all 0.3s ease;
        }
        
        .themeht-btn.primary-btn:hover {
          background-color: transparent;
          border-color: var(--themeht-primary-color);
          color: var(--themeht-primary-color);
        }
        
        .widget {
          margin-bottom: 2rem;
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 1.5rem;
        }
        
        .widget-title {
          margin-bottom: 1rem;
          color: #212529;
          font-weight: 600;
        }
        
        .widget-searchbox {
          position: relative;
        }
        
        .widget-searchbox input {
          padding-right: 3rem;
        }
        
        .search-btn {
          position: absolute;
          right: 0.5rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--themeht-primary-color);
        }
        
        .recent-post-thumb {
          width: 80px;
          height: 60px;
          overflow: hidden;
          border-radius: 4px;
          flex-shrink: 0;
        }
        
        .recent-post {
          margin-top: 1rem;
        }
        
        .recent-post li {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }
        
        .recent-post-desc a {
          color: #212529;
          text-decoration: none;
          font-weight: 500;
          line-height: 1.3;
          display: block;
          margin-bottom: 0.5rem;
        }
        
        .recent-post-desc a:hover {
          color: var(--themeht-primary-color);
        }
        
        .post-date-small {
          color: #6c757d;
          font-size: 0.875rem;
        }
        
        .widget-categories li {
          padding: 0.5rem 0;
        }
        
        .widget-categories li:last-child {
          border-bottom: none;
        }
        
        .category-filter-btn {
          color: #212529;
          transition: color 0.3s ease;
        }
        
        .category-filter-btn:hover,
        .category-filter-btn.active {
          color: var(--themeht-primary-color);
        }
        
        .widget-tags li {
          margin-bottom: 0.5rem;
          margin-right: 0.5rem;
        }
        
        .widget-tags a {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          background: #f8f9fa;
          color: #6c757d;
          text-decoration: none;
          border-radius: 4px;
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }
        
        .widget-tags a:hover {
          background: var(--themeht-primary-color);
          color: white;
        }
        
        .pagination {
          justify-content: flex-start;
        }
        
        .pagination .page-link {
          color: #6c757d;
          border-color: #e9ecef;
        }
        
        .pagination .page-item.active .page-link {
          background-color: var(--themeht-primary-color);
          border-color: var(--themeht-primary-color);
        }
        
        .pagination .page-link:hover {
          color: var(--themeht-primary-color);
        }
      `}</style>
    </>
  );
}


