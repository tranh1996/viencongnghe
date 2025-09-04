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
                  {/* Post Image */}
                  {post.image_url && (
                    <div className="post-image">
                      <OptimizedImage 
                        src={post.image_url} 
                        className="img-fluid" 
                        alt={post.title}
                        width={800}
                        height={400}
                        context="blog-detail"
                      />
                    </div>
                  )}
                  
                  <div className="post-desc">
                    {/* Post Meta */}
                    <div className="post-bottom">
                      <ul className="list-inline">
                        <li className="list-inline-item">
                          <i className="bi bi-person"></i> {t('blog.admin')}
                        </li>
                        <li className="list-inline-item">
                          <i className="bi bi-calendar3"></i> {formatDate(post.created_at)}
                        </li>
                        <li className="list-inline-item">
                          <i className="bi bi-tag"></i> 
                          {post.categories && post.categories.length > 0 ? (
                            post.categories.map((category, index) => (
                              <span key={category.id}>
                                {language === 'vi' ? category.name : (category.name_en || category.name)}
                                {index < post.categories.length - 1 ? ', ' : ''}
                              </span>
                            ))
                          ) : (
                            t('blog.noCategory')
                          )}
                        </li>
                      </ul>
                    </div>

                    {/* Post Content */}
                    {post.description && (
                      <p className="ht-first-letter">
                        {post.description}
                      </p>
                    )}
                    
                    {post.content && (
                      <div 
                        className="content-body"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                      />
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
              <Col lg={4} md={12} className="mt-7 mt-lg-0 ps-lg-10">
                <div className="themeht-sidebar">
                  {/* Search Widget */}
                  <div 
                    className="widget widget-search"
                    style={{
                      boxShadow: '0 10px 30px 5px rgba(115, 113, 255, .06)',
                      padding: '30px',
                      borderRadius: '24px',
                      marginBottom: '50px',
                      background: 'var(--themeht-white-color)'
                    }}
                  >
                    <h4 className="widget-title mb-3 fw-bold">{t('blog.searchTitle')}</h4>
                    <div className="widget-search">
                      <form onSubmit={handleSearch}>
                        <div className="widget-searchbox">
                          <input 
                            type="text" 
                            placeholder={t('blog.searchPlaceholder')} 
                            className="form-control"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                          <button type="submit" className="search-btn">
                            <i className="bi bi-search"></i>
                          </button>
                        </div>
                      </form>
                    </div>
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
                    <h5 className="widget-title">{t('blog.recentPosts')}</h5>
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
                    <h4 className="widget-title mb-3 fw-bold">{t('blog.categories')}</h4>
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
                              <span>{language === 'vi' ? category.name : (category.name_en || category.name)}</span>
                            </div>
                            <i className="bi bi-chevron-right ms-1" style={{ fontSize: '14px', color: '#1253be' }}></i>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Popular Tags Widget */}
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
                    <h5 className="widget-title">{t('blog.popularTags')}</h5>
                    <ul className="widget-tags list-inline">
                      <li><a href="#">{t('blog.tags.laboratory')}</a></li>
                      <li><a href="#">{t('blog.tags.research')}</a></li>
                      <li><a href="#">{t('blog.tags.technology')}</a></li>
                      <li><a href="#">{t('blog.tags.science')}</a></li>
                      <li><a href="#">{t('blog.tags.innovation')}</a></li>
                      <li><a href="#">{t('blog.tags.development')}</a></li>
                    </ul>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </div>

      <style jsx>{`
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
        
        .post-bottom ul {
          margin-bottom: 1rem;
          color: #6c757d;
          font-size: 0.875rem;
        }
        
        .post-bottom .list-inline-item {
          margin-right: 1.5rem;
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
        
        .widget-categories a {
          color: #212529;
          text-decoration: none;
          transition: color 0.3s ease;
        }
        
        .widget-categories a:hover {
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
      `}</style>
    </>
  );
}
