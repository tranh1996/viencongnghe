'use client';

import type { Metadata } from 'next';
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert, Pagination, Form } from 'react-bootstrap';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchPosts, fetchBlogCategories, News, NewsCategory } from '@/utils/api';
import OptimizedImage from '@/components/OptimizedImage';
import { useSearchParams, useRouter } from 'next/navigation';

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
  
  const currentPage = parseInt(searchParams.get('page') || '1');
  const currentCategory = searchParams.get('category') || '';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [postsData, categoriesData] = await Promise.all([
          fetchPosts(language, currentPage, 10, currentCategory || undefined),
          fetchBlogCategories(language)
        ]);
        
        setPosts(postsData.posts);
        setPagination(postsData.pagination);
        setCategories(categoriesData);
        setSelectedCategory(currentCategory);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [language, currentPage, currentCategory]);

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
    params.set('page', page.toString());
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
          <Row className="text-center mb-5">
            <Col lg={8} className="mx-auto">
              <h6 className="text-theme mb-3">{t('blog.title')}</h6>
              <h2 className="mb-4">{t('blog.heading')}</h2>
              <p>
                {t('blog.description')}
              </p>
            </Col>
          </Row>

          {/* Category Filter */}
          <Row className="mb-4">
            <Col lg={6} md={8} className="mx-auto">
              <Form.Select 
                value={selectedCategory} 
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="form-select-lg"
              >
                <option value="">{t('blog.allCategories')}</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {language === 'vi' ? category.name : (category.name_en || category.name)}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>

          {/* Posts Grid */}
          {posts.length > 0 ? (
            <>
              <Row>
                {posts.map((post) => (
                  <Col key={post.id} lg={4} md={6} className="mb-4">
                    <div className="card h-100">
                      <OptimizedImage 
                        src={post.image_url || "/images/blog/01.jpg"} 
                        className="card-img-top" 
                        alt={post.title}
                        width={400}
                        height={250}
                        context="blog-list"
                      />
                      <div className="card-body d-flex flex-column">
                        <div className="mb-2">
                          {post.categories && post.categories.length > 0 ? (
                            post.categories.map((category) => (
                              <span key={category.id} className="badge bg-theme me-1">
                                {language === 'vi' ? category.name : (category.name_en || category.name)}
                              </span>
                            ))
                          ) : (
                            <span className="badge bg-secondary me-1">
                              {t('blog.noCategory')}
                            </span>
                          )}
                        </div>
                        <h6 className="text-muted mb-2">
                          {formatDate(post.created_at)}
                        </h6>
                        <h5 className="card-title">{post.title}</h5>
                        <p className="card-text flex-grow-1">
                          {post.description ? truncateText(post.description, 120) : ''}
                        </p>
                        <a href={`/blog/${post.slug}`} className="text-theme text-decoration-none mt-auto">
                          {t('blog.readMore')} <i className="bi bi-arrow-right ms-1"></i>
                        </a>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>

              {/* Pagination */}
              {renderPagination()}
            </>
          ) : (
            <Row>
              <Col>
                <div className="text-center py-5">
                  <h4 className="text-muted">{t('blog.noPosts')}</h4>
                  <p className="text-muted">{t('blog.noPostsDescription')}</p>
                </div>
              </Col>
            </Row>
          )}
        </Container>
      </section>
    </>
  );
}
