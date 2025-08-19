'use client';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert, Breadcrumb, Card } from 'react-bootstrap';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchPostBySlug, fetchRelatedPosts, News } from '@/utils/api';
import OptimizedImage from '@/components/OptimizedImage';
import { useParams } from 'next/navigation';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function BlogDetailPage() {
  const { language, t } = useLanguage();
  const params = useParams();
  const slug = params.slug as string;
  
  const [post, setPost] = useState<News | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        const relatedData = await fetchRelatedPosts(slug, language, 5);
        setRelatedPosts(relatedData);
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
                    <li className="breadcrumb-item">
                      <a href="/blog">{t('blog.breadcrumb.news')}</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      {t('blog.breadcrumb.loading')}
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

  if (error || !post) {
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
                    <li className="breadcrumb-item">
                      <a href="/blog">{t('blog.breadcrumb.news')}</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      {t('blog.breadcrumb.error')}
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
                  <p>{error || t('blog.postNotFound')}</p>
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
                  <li className="breadcrumb-item">
                    <a href="/blog">{t('blog.breadcrumb.news')}</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {post.title}
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
            <Col lg={8} className="mx-auto">
              {/* Post Header */}
              <div className="mb-4">
                <div className="mb-3">
                  {post.categories && post.categories.length > 0 ? (
                    post.categories.map((category) => (
                      <span key={category.id} className="badge bg-theme me-2">
                        {language === 'vi' ? category.name : (category.name_en || category.name)}
                      </span>
                    ))
                  ) : (
                    <span className="badge bg-secondary me-2">
                      {t('blog.noCategory')}
                    </span>
                  )}
                </div>
                <h1 className="mb-3">{post.title}</h1>
                <div className="d-flex align-items-center text-muted mb-4">
                  <i className="bi bi-calendar3 me-2"></i>
                  <span>{formatDate(post.created_at)}</span>
                  {post.author && (
                    <>
                      <i className="bi bi-person ms-3 me-2"></i>
                      <span>{post.author}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Featured Image */}
              {post.image_url && (
                <div className="mb-4">
                  <OptimizedImage 
                    src={post.image_url} 
                    className="img-fluid rounded" 
                    alt={post.title}
                    width={800}
                    height={400}
                    context="blog-detail"
                  />
                </div>
              )}

              {/* Post Content */}
              <div className="post-content">
                {post.description && (
                  <div className="lead mb-4">
                    {post.description}
                  </div>
                )}
                
                {post.content && (
                  <div 
                    className="content-body"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                )}
              </div>

              {/* Tags */}
              {post.tags && (
                <div className="mt-5 pt-4 border-top">
                  <h6 className="mb-3">
                    <i className="bi bi-tags me-2"></i>
                    {t('blog.tags')}
                  </h6>
                  <div>
                    {(() => {
                      try {
                        const tagsArray = JSON.parse(post.tags);
                        return Array.isArray(tagsArray) ? tagsArray.map((tag, index) => (
                          <span key={index} className="badge bg-light text-dark me-2 mb-2">
                            {tag}
                          </span>
                        )) : null;
                      } catch (e) {
                        // Fallback to comma-separated parsing
                        return post.tags.split(',').map((tag, index) => (
                          <span key={index} className="badge bg-light text-dark me-2 mb-2">
                            {tag.trim()}
                          </span>
                        ));
                      }
                    })()}
                  </div>
                </div>
              )}

              {/* Related Posts */}
              <div className="mt-5 pt-4 border-top">
                <h4 className="mb-4">
                  <i className="bi bi-arrow-right-circle me-2"></i>
                  {t('blog.relatedPosts') || 'Related Posts'}
                </h4>
                
                {relatedLoading ? (
                  <div className="text-center py-4">
                    <Spinner animation="border" size="sm" role="status">
                      <span className="visually-hidden">Loading related posts...</span>
                    </Spinner>
                    <p className="mt-2 text-muted">Loading related posts...</p>
                  </div>
                ) : relatedPosts.length > 0 ? (
                  <Row>
                    {relatedPosts.map((relatedPost) => (
                      <Col key={relatedPost.id} lg={6} md={6} sm={12} className="mb-4">
                        <Card className="h-100 shadow-sm">
                          {relatedPost.image_url && (
                            <div className="position-relative">
                              <OptimizedImage
                                src={relatedPost.image_url}
                                className="card-img-top"
                                alt={relatedPost.title}
                                width={400}
                                height={250}
                                context="blog-related"
                              />
                              {relatedPost.categories && relatedPost.categories.length > 0 && (
                                <div className="position-absolute top-0 start-0 m-2">
                                  <span className="badge bg-theme">
                                    {language === 'vi' 
                                      ? relatedPost.categories[0].name 
                                      : (relatedPost.categories[0].name_en || relatedPost.categories[0].name)
                                    }
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                          <Card.Body className="d-flex flex-column">
                            <div className="mb-2">
                              <small className="text-muted">
                                <i className="bi bi-calendar3 me-1"></i>
                                {formatDate(relatedPost.created_at)}
                              </small>
                            </div>
                            <Card.Title className="h6 mb-3">
                              <a 
                                href={`/blog/${relatedPost.slug}`} 
                                className="text-decoration-none text-dark"
                              >
                                {relatedPost.title}
                              </a>
                            </Card.Title>
                            {relatedPost.description && (
                              <Card.Text className="text-muted small flex-grow-1">
                                {relatedPost.description.length > 100 
                                  ? `${relatedPost.description.substring(0, 100)}...` 
                                  : relatedPost.description
                                }
                              </Card.Text>
                            )}
                            <div className="mt-auto">
                              <a 
                                href={`/blog/${relatedPost.slug}`} 
                                className="btn btn-sm btn-outline-theme"
                              >
                                {t('blog.readMore') || 'Read More'}
                                <i className="bi bi-arrow-right ms-1"></i>
                              </a>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <div className="text-center py-4">
                    <i className="bi bi-newspaper display-4 text-muted"></i>
                    <p className="mt-2 text-muted">
                      {t('blog.noRelatedPosts') || 'No related posts found'}
                    </p>
                  </div>
                )}
              </div>

              {/* Back to Blog */}
              <div className="mt-5 pt-4 border-top text-center">
                <a href="/blog" className="btn btn-outline-theme">
                  <i className="bi bi-arrow-left me-2"></i>
                  {t('blog.backToBlog')}
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}
