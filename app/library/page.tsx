'use client';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useLanguage } from '@/contexts/LanguageContext';
import Breadcrumb from '@/components/Breadcrumb';
import { fetchAlbumImages, AlbumData } from '@/utils/api';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function LibraryPage() {
  const { t, language } = useLanguage();
  const [albumData, setAlbumData] = useState<AlbumData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingImages, setLoadingImages] = useState<{[key: number]: boolean}>({});
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [showLightbox, setShowLightbox] = useState(false);

  // Fetch album images when language changes
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadAlbumImages = async () => {
      try {
        setLoading(true);
        setError(null);

        const albumImagesData = await fetchAlbumImages(language, controller.signal);

        if (isMounted) {
          setAlbumData(albumImagesData);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error loading album images:', err);
          setError('Failed to load album images. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadAlbumImages();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [language]);

  // Handle image loading states
  const handleImageLoad = (imageId: number) => {
    setLoadingImages(prev => ({ ...prev, [imageId]: false }));
  };

  const handleImageLoadStart = (imageId: number) => {
    setLoadingImages(prev => ({ ...prev, [imageId]: true }));
  };

  // Handle lightbox
  const openLightbox = (image: any) => {
    setSelectedImage(image);
    setShowLightbox(true);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeLightbox = () => {
    setShowLightbox(false);
    setSelectedImage(null);
    document.body.style.overflow = 'unset'; // Restore scrolling
  };

  // Handle keyboard events for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showLightbox) {
        closeLightbox();
      }
    };

    if (showLightbox) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showLightbox]);

  const breadcrumbItems = [
    {
      label: { vi: 'Trang chủ', en: 'Home' },
      href: '/'
    },
    {
      label: { vi: 'Hình ảnh hoạt động', en: 'Activity Images' },
      active: true
    }
  ];

  return (
    <>
      <Breadcrumb
        title={{ vi: 'Hình ảnh hoạt động', en: 'Activity Images' }}
        items={breadcrumbItems}
      />

      <section>
        <Container>
          {/* Gallery Section */}

            {loading && (
              <Row className="text-center">
                <Col>
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </Col>
              </Row>
            )}

            {error && (
              <Row className="text-center">
                <Col>
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                </Col>
              </Row>
            )}

            {!loading && !error && albumData && (
              <Row>
                {albumData.images.map((image) => (
                  <Col lg={4} md={4} sm={6} className="mb-3" key={image.id}>
                    <div
                      className="position-relative image-hover-container"
                      style={{
                        overflow: 'hidden',
                        borderRadius: '0.375rem'
                      }}
                    >
                      {/* Skeleton loader */}
                      {loadingImages[image.id] !== false && (
                        <div
                          className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-light"
                          style={{
                            height: '300px',
                            zIndex: 1
                          }}
                        >
                          <div className="spinner-border text-secondary" role="status" style={{ width: '2rem', height: '2rem' }}>
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      )}

                      <img
                        src={image.thumbnail_url || image.url}
                        className="img-fluid"
                        alt={image.title}
                        loading="lazy"
                        style={{
                          width: '100%',
                          height: '300px',
                          objectFit: 'cover',
                          cursor: 'pointer',
                          transition: 'transform 0.3s ease, opacity 0.3s ease',
                          opacity: loadingImages[image.id] === false ? 1 : 0
                        }}
                        onLoadStart={() => handleImageLoadStart(image.id)}
                        onLoad={() => handleImageLoad(image.id)}
                        onClick={() => openLightbox(image)}
                        onError={(e) => {
                          // Fallback if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/placeholder.jpg';
                          handleImageLoad(image.id);
                        }}
                      />
                      {image.title && (
                        <div
                          className="position-absolute bottom-0 start-0 end-0 bg-dark bg-opacity-75 text-white p-2 image-title-overlay"
                          style={{
                            transform: 'translateY(100%)',
                            transition: 'transform 0.3s ease'
                          }}
                        >
                          <small>{image.title}</small>
                        </div>
                      )}
                    </div>
                  </Col>
                ))}
              </Row>
            )}

            {!loading && !error && (!albumData || albumData.images.length === 0) && (
              <Row className="text-center">
                <Col>
                  <p className="text-muted">Không có hình ảnh nào để hiển thị.</p>
                </Col>
              </Row>
            )}
        </Container>
      </section>

      {/* Lightbox Modal */}
      {showLightbox && selectedImage && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center lightbox-overlay"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            zIndex: 9999,
            cursor: 'pointer'
          }}
          onClick={closeLightbox}
        >
          <div className="position-relative lightbox-content" style={{ maxWidth: '90vw', maxHeight: '90vh' }}>
            {/* Close button */}
            <button
              className="btn-close btn-close-white position-absolute"
              style={{
                top: '-40px',
                right: '0px',
                zIndex: 10000
              }}
              onClick={closeLightbox}
              aria-label="Close"
            ></button>

            {/* Image */}
            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              className="img-fluid"
              style={{
                maxWidth: '100%',
                maxHeight: '90vh',
                objectFit: 'contain',
                borderRadius: '8px'
              }}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on image
            />

            {/* Image info - only show on hover/tap for mobile */}
            {selectedImage.title && (
              <div
                className="position-absolute bottom-0 start-0 end-0 bg-dark bg-opacity-75 text-white p-3 lightbox-info"
                style={{
                  borderRadius: '0 0 8px 8px',
                  transform: 'translateY(100%)',
                  transition: 'transform 0.3s ease'
                }}
              >
                <h5 className="mb-1">{selectedImage.title}</h5>
                {selectedImage.description && (
                  <p className="mb-0 small">{selectedImage.description}</p>
                )}
              </div>
            )}

            {/* Toggle info button for mobile */}
            <button
              className="btn btn-light position-absolute bottom-0 end-0 me-3 mb-3 d-md-none lightbox-info-toggle"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                opacity: 0.8
              }}
              onClick={(e) => {
                e.stopPropagation();
                const infoEl = document.querySelector('.lightbox-info') as HTMLElement;
                if (infoEl) {
                  const isVisible = infoEl.style.transform === 'translateY(0px)';
                  infoEl.style.transform = isVisible ? 'translateY(100%)' : 'translateY(0px)';
                }
              }}
            >
              <i className="bi bi-info-circle"></i>
            </button>

            {/* Navigation arrows (if you want to add next/prev functionality later) */}
            {albumData && albumData.images.length > 1 && (
              <>
                <button
                  className="btn btn-light position-absolute top-50 start-0 translate-middle-y ms-3 lightbox-nav-btn"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    opacity: 0.8
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    const currentIndex = albumData.images.findIndex(img => img.id === selectedImage.id);
                    const prevIndex = currentIndex > 0 ? currentIndex - 1 : albumData.images.length - 1;
                    setSelectedImage(albumData.images[prevIndex]);
                  }}
                >
                  <i className="bi bi-chevron-left"></i>
                </button>

                <button
                  className="btn btn-light position-absolute top-50 end-0 translate-middle-y me-3 lightbox-nav-btn"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    opacity: 0.8
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    const currentIndex = albumData.images.findIndex(img => img.id === selectedImage.id);
                    const nextIndex = currentIndex < albumData.images.length - 1 ? currentIndex + 1 : 0;
                    setSelectedImage(albumData.images[nextIndex]);
                  }}
                >
                  <i className="bi bi-chevron-right"></i>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* CSS for hover effects and lightbox */}
      <style jsx>{`
        :global(.image-hover-container:hover .image-title-overlay) {
          transform: translateY(0) !important;
        }

        :global(.image-hover-container:hover img) {
          transform: scale(1.1);
        }

        /* Lightbox animations */
        :global(.lightbox-overlay) {
          animation: fadeIn 0.3s ease-in-out;
        }

        :global(.lightbox-content) {
          animation: zoomIn 0.3s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes zoomIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        /* Smooth transitions for navigation arrows */
        :global(.lightbox-nav-btn) {
          transition: opacity 0.3s ease, transform 0.2s ease;
        }

        :global(.lightbox-nav-btn:hover) {
          opacity: 1 !important;
          transform: scale(1.1);
        }

        /* Lightbox info behavior */
        /* On desktop: show info on hover */
        @media (min-width: 768px) {
          :global(.lightbox-content:hover .lightbox-info) {
            transform: translateY(0) !important;
          }
        }

        /* Info toggle button */
        :global(.lightbox-info-toggle) {
          transition: opacity 0.3s ease, transform 0.2s ease;
        }

        :global(.lightbox-info-toggle:hover) {
          opacity: 1 !important;
          transform: scale(1.1);
        }
      `}</style>
    </>
  );
}
