'use client';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchPostBySlug, fetchRelatedPosts, fetchBlogCategories, searchPosts, News, NewsCategory } from '@/utils/api';
import OptimizedImage from '@/components/OptimizedImage';
import { useParams } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function BlogDetailPage() {
  const { language, t } = useLanguage();
  const params = useParams();
  const slug = params.slug as string;
  
  const [post, setPost] = useState<News | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<News[]>([]);
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const postData = await fetchPostBySlug(slug, language);
        setPost(postData);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch post');
      } finally {
        setLoading(false);
      }
    };

    const fetchRelated = async () => {
      if (!slug) return;
      
      setRelatedLoading(true);
      try {
        const [relatedData, categoriesData] = await Promise.all([
          fetchRelatedPosts(slug, language, 3),
          fetchBlogCategories(language)
        ]);
        setRelatedPosts(relatedData);
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error fetching related posts:', err);
        // Don't set error for related posts as it's not critical
      } finally {
        setRelatedLoading(false);
      }
    };

    fetchPost();
    fetchRelated();
  }, [slug, language]);

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
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // Navigate to blog list page with search query
    window.location.href = `/blog?search=${encodeURIComponent(searchQuery)}`;
  };

  if (loading) {
    return (
      <>
        <Breadcrumb
          title={{ vi: t('blog.breadcrumb.loading'), en: t('blog.breadcrumb.loading') }}
          items={[
            { label: { vi: 'Trang chủ', en: 'Home' }, href: '/' },
            { label: { vi: 'Tin tức', en: 'News' }, href: '/blog' },
            { label: { vi: t('blog.breadcrumb.loading'), en: t('blog.breadcrumb.loading') }, active: true }
          ]}
        />

        <div className="page-content">
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
        </div>
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Breadcrumb
          title={{ vi: t('blog.breadcrumb.error'), en: t('blog.breadcrumb.error') }}
          items={[
            { label: { vi: 'Trang chủ', en: 'Home' }, href: '/' },
            { label: { vi: 'Tin tức', en: 'News' }, href: '/blog' },
            { label: { vi: t('blog.breadcrumb.error'), en: t('blog.breadcrumb.error') }, active: true }
          ]}
        />

        <div className="page-content">
          <section>
            <Container>
              <Row>
                <Col>
                  <Alert variant="danger">
                    <Alert.Heading>{t('organization.error')}</Alert.Heading>
                    <p>{error || t('blog.postNotFound')}</p>
                  </Alert>
                </Col>
              </Row>
            </Container>
          </section>
        </div>
      </>
    );
  }

  const breadcrumbItems = [
    {
      label: { vi: 'Trang chủ', en: 'Home' },
      href: '/'
    },
    {
      label: { vi: 'Tin tức', en: 'News' },
      href: '/blog'
    },
    {
      label: { vi: post.title, en: post.title },
      active: true
    }
  ];

  return (
    <>
      <Breadcrumb
        title={{ vi: post.title, en: post.title }}
        items={breadcrumbItems}
      />
      
      <div className="page-content">
        <section className="post-single-page">
          <Container>
            <Row>
              {/* Main Content */}
              <Col lg={8} md={12}>
                <div className="post-card">
                  <div className="post-desc">
                    {/* Post Title */}
                    <div className="post-title mb-4">
                      <h1 className="mb-3">{post.title}</h1>
                    </div>

                    {/* Post Meta */}
                    <div className="post-meta mb-4">
                      <ul className="list-inline mb-0">
                        <li className="list-inline-item">
                          <i className="bi bi-person-circle me-1"></i>
                          <span>{t('blog.admin')}</span>
                        </li>
                        <li className="list-inline-item">
                          <i className="bi bi-calendar3 me-1"></i>
                          <span>{formatDate(post.created_at)}</span>
                        </li>
                        <li className="list-inline-item">
                          <i className="bi bi-eye me-1"></i>
                          <span>0 {language === 'vi' ? 'bình luận' : 'comments'}</span>
                        </li>
                        {post.categories && post.categories.length > 0 && (
                          <li className="list-inline-item">
                            <span className="badge bg-primary">
                              { post.categories[0].name }
                            </span>
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Post Content */}
                    {post.description && (
                      <div className="post-content mb-4">
                        <p className="lead">
                          {post.description}
                        </p>
                      </div>
                    )}

                    {post.content && (
                      <div
                        className="content-body mb-4"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                      />
                    )}

                    {/* Post Image - moved to bottom */}
                    {post.image_url && (
                      <div className="post-image mb-4">
                        <OptimizedImage
                          src={post.image_url}
                          className="img-fluid w-100"
                          alt={post.title}
                          width={800}
                          height={400}
                          context="blog-detail"
                          style={{
                            borderRadius: '8px'
                          }}
                        />
                      </div>
                    )}

                    {/* Tags */}
                    {post.tags && (
                      <div className="theme-tags blog-tag-link tags-links">
                        {t('blog.tags')}:
                        {(() => {
                          try {
                            const tagsArray = JSON.parse(post.tags);
                            return Array.isArray(tagsArray) ? tagsArray.map((tag, index) => (
                              <a key={index} href="#">{tag}</a>
                            )) : null;
                          } catch (e) {
                            return post.tags.split(',').map((tag, index) => (
                              <a key={index} href="#">{tag.trim()}</a>
                            ));
                          }
                        })()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Comments Section */}
                <div className="post-comment">
                  <h2 className="comments-title mb-7">
                    {t('blog.comments.title')} &ldquo;<span>{post.title}</span>&rdquo;
                  </h2>
                  <div className="text-center py-4 text-muted">
                    <i className="bi bi-chat-dots display-4"></i>
                    <p className="mt-2">{t('blog.comments.noComments')}</p>
                  </div>
                </div>

                {/* Comment Form */}
                <div className="post-comments mt-10 box-shadow white-bg p-5 rounded">
                  <h3 className="comment-reply-title">{t('blog.comments.leaveReply')}</h3>
                  <form>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>{t('blog.comments.name')} *</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder={t('blog.comments.namePlaceholder')} 
                            required 
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>{t('blog.comments.email')} *</label>
                          <input 
                            type="email" 
                            className="form-control" 
                            placeholder={t('blog.comments.emailPlaceholder')} 
                            required 
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form-group mb-0">
                      <label>{t('blog.comments.comment')} *</label>
                      <textarea 
                        className="form-control h-100" 
                        placeholder={t('blog.comments.commentPlaceholder')} 
                        rows={4} 
                        required
                      ></textarea>
                    </div>
                    <button className="themeht-btn primary-btn mt-5" type="button">
                      {t('blog.comments.postComment')}
                    </button>
                  </form>
                </div>
              </Col>

              {/* Sidebar */}
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
                      background: 'linear-gradient(135deg, rgba(0,0,0,0.7), rgba(0,0,0,0.5)), url("/images/bg/02.jpg")',
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
                        {language === 'vi'
                          ? 'Khám phá những hình ảnh hoạt động tại viện'
                          : 'Explore activity images at the institute'
                        }
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
                      background: 'linear-gradient(135deg, rgba(0,0,0,0.7), rgba(0,0,0,0.5)), url("/images/bg/02.jpg")',
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
                      <p className="text-white-50 mb-0">
                        {language === 'vi'
                          ? 'Tìm hiểu về các sản phẩm và dịch vụ của chúng tôi'
                          : 'Learn about our products and services'
                        }
                      </p>
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
                          href="/blog"
                          className={`d-flex align-items-center justify-content-between text-decoration-none py-2`}
                          style={{
                            borderBottom: '1px dashed #e0e0e0',
                            color: '#6c757d',
                            transition: 'all 0.3s ease',
                            fontWeight: '600'
                          }}
                          onMouseEnter={(e) => {
                            const linkElement = e.currentTarget as HTMLElement;
                            linkElement.style.color = '#1253be';
                          }}
                          onMouseLeave={(e) => {
                            const linkElement = e.currentTarget as HTMLElement;
                            linkElement.style.color = '#6c757d';
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
                            href={`/blog?category=${category.slug}`}
                            className={`d-flex align-items-center justify-content-between text-decoration-none py-2`}
                            style={{
                              borderBottom: '1px dashed #e0e0e0',
                              color: '#6c757d',
                              transition: 'all 0.3s ease',
                              fontWeight: '600'
                            }}
                            onMouseEnter={(e) => {
                              const linkElement = e.currentTarget as HTMLElement;
                              linkElement.style.color = '#1253be';
                            }}
                            onMouseLeave={(e) => {
                              const linkElement = e.currentTarget as HTMLElement;
                              linkElement.style.color = '#6c757d';
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
                        {relatedPosts.slice(0, 3).map((relatedPost) => (
                          <li key={relatedPost.id} className="mb-3">
                            <div className="recent-post-thumb">
                              <OptimizedImage
                                src={relatedPost.image_url || "/images/blog/01.jpg"}
                                className="img-fluid"
                                alt={relatedPost.title}
                                width={80}
                                height={60}
                                context="blog-thumb"
                              />
                            </div>
                            <div className="recent-post-desc">
                              <a href={`/blog/${relatedPost.slug}`}>{relatedPost.title}</a>
                              <div className="post-date-small">{formatDate(relatedPost.created_at)}</div>
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
        }

        .post-desc {
          padding: 2rem;
        }

        .post-title h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #212529;
          line-height: 1.3;
        }

        .post-meta ul {
          color: #6c757d;
          font-size: 0.875rem;
        }

        .post-meta .list-inline-item {
          margin-right: 1.5rem;
        }

        .post-meta .badge {
          font-size: 0.75rem;
          padding: 0.375rem 0.75rem;
        }

        .post-content .lead {
          font-size: 1.125rem;
          font-weight: 400;
          line-height: 1.6;
          color: #495057;
        }

        .ht-first-letter:first-letter {
          font-size: 3em;
          font-weight: bold;
          float: left;
          line-height: 1;
          margin-right: 8px;
          margin-top: 4px;
          color: var(--themeht-primary-color);
        }

        .theme-tags {
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid #e9ecef;
        }

        .theme-tags a {
          display: inline-block;
          margin: 0 0.5rem 0.5rem 0;
          padding: 0.25rem 0.75rem;
          background: #f8f9fa;
          color: #6c757d;
          text-decoration: none;
          border-radius: 4px;
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }

        .theme-tags a:hover {
          background: var(--themeht-primary-color);
          color: white;
        }

        .post-comment {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #e9ecef;
        }

        .comments-title {
          font-size: 1.5rem;
          margin-bottom: 2rem;
        }

        .post-comments {
          background: white;
          box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
        }

        .comment-reply-title {
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
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
      `}</style>
    </>
  );
}
