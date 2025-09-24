'use client';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchProductBySlug, fetchProducts, fetchContactSettingsCached, Product, ContactSettings } from '../../../src/utils/api';
import Breadcrumb from '@/components/Breadcrumb';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function ProductDetailPage() {
  const { language, t } = useLanguage();
  const params = useParams();
  const slug = params.slug as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [contactSettings, setContactSettings] = useState<ContactSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const [productData, relatedData, contactData] = await Promise.all([
          fetchProductBySlug(slug, language),
          fetchProducts(language, 1, 5), // Fetch 5 products for related products
          fetchContactSettingsCached(language)
        ]);
        
        setProduct(productData);
        setRelatedProducts(relatedData.products.filter(p => p.slug !== slug).slice(0, 5));
        setContactSettings(contactData);
        setError(null);
      } catch (err) {
        console.error('Error fetching product data:', err);
        setError(t('products.errorLoading'));
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProductData();
    }
  }, [slug, language]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-theme" role="status">
          <span className="visually-hidden">{t('common.loading')}</span>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: '3rem' }}></i>
          <h4 className="mt-3">{t('products.notFound')}</h4>
          <p className="text-muted">{error || t('products.notFoundDescription')}</p>
          <a href="/products" className="btn btn-theme">{t('products.backToList')}</a>
        </div>
      </div>
    );
  }

  const allImages = [product.image_url, ...(product?.gallery_images || [])].filter(Boolean);

  const breadcrumbItems = [
    {
      label: { vi: 'Trang chủ', en: 'Home' },
      href: '/'
    },
    {
      label: { vi: 'Sản phẩm & Dịch vụ', en: 'Products & Services' },
      href: '/products'
    },
    {
      label: {
        vi: product.product_category.name,
        en: product.product_category.name || product.product_category.name
      },
      href: `/products?category=${product.product_category.slug}`
    },
    {
      label: { vi: product.name, en: product.name || product.name },
      active: true
    }
  ];

  return (
    <>
      <Breadcrumb
        title={{ vi: product.name, en: product.name || product.name }}
        items={breadcrumbItems}
      />

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
              <h2 className="mb-3">{language === 'vi' ? product.name : (product.name || product.name)}</h2>

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
                <h4>{t('products.productDescription')}</h4>
                <div className="card">
                  <div className="card-body">
                    {product.description && (
                      <p className="mb-3">{ product.description}</p>
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
                  <h4>{t('products.specifications')}</h4>
                  <div className="card">
                    <div className="card-body">
                      <Row>
                        {product.weight && (
                          <Col md={6}>
                            <p><strong>{t('products.weight')}:</strong> {product.weight}</p>
                          </Col>
                        )}
                        {product.dimensions && (
                          <Col md={6}>
                            <p><strong>{t('products.dimensions')}:</strong> {product.dimensions}</p>
                          </Col>
                        )}
                        {product.specifications && (
                          <Col md={12}>
                            <p><strong>{t('products.specs')}:</strong></p>
                            <div dangerouslySetInnerHTML={{ __html:  product.specifications }} />
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
                  <h5 className="mb-0 text-white">{t('products.contactAdvice')}</h5>
                </div>
                <div className="card-body">
                  {contactSettings ? (
                    <>
                      <div className="text-center mb-3">
                        <img src="/images/logo.png" alt={contactSettings.company_info.company_name} style={{ maxHeight: '60px' }} />
                        <h6 className="mt-2">{contactSettings.company_info.company_name}</h6>
                        <p className="text-muted small">{contactSettings.company_info.company_subtitle}</p>
                      </div>

                      <div className="mb-3">
                        <p className="mb-1"><strong>{t('products.mainOffice')}:</strong></p>
                        {contactSettings.company_info.address_main && (
                          <p className="small mb-1">{contactSettings.company_info.address_main}</p>
                        )}
                        {contactSettings.company_info.address_branch && (
                          <p className="small mb-1">{contactSettings.company_info.address_branch}</p>
                        )}
                      </div>

                      <div className="mb-3">
                        {contactSettings.company_info.email && (
                          <p className="mb-1"><strong>Email:</strong> {contactSettings.company_info.email}</p>
                        )}
                        {contactSettings.company_info.phone && (
                          <p className="mb-1"><strong>{t('products.phone')}:</strong> {contactSettings.company_info.phone}</p>
                        )}
                        {contactSettings.company_info.fax && (
                          <p className="mb-1"><strong>Fax:</strong> {contactSettings.company_info.fax}</p>
                        )}
                      </div>

                      <div className="d-flex justify-content-around">
                        <div className="text-center">
                          <a
                            href={`tel:${contactSettings.company_info.phone}`}
                            className="btn btn-outline-theme rounded-circle mb-2 d-flex align-items-center justify-content-center text-decoration-none"
                            style={{ width: '50px', height: '50px' }}
                          >
                            <i className="bi bi-telephone"></i>
                          </a>
                          <p className="small mb-0">{t('products.callPhone')}</p>
                        </div>
                        <div className="text-center">
                          <a
                            href={`mailto:${contactSettings.company_info.email}`}
                            className="btn btn-outline-theme rounded-circle mb-2 d-flex align-items-center justify-content-center text-decoration-none"
                            style={{ width: '50px', height: '50px' }}
                          >
                            <i className="bi bi-envelope"></i>
                          </a>
                          <p className="small mb-0">{t('products.sendEmail')}</p>
                        </div>
                        <div className="text-center">
                          <a
                            href={contactSettings.company_info.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline-theme rounded-circle mb-2 d-flex align-items-center justify-content-center text-decoration-none"
                            style={{ width: '50px', height: '50px' }}
                          >
                            <i className="bi bi-geo-alt"></i>
                          </a>
                          <p className="small mb-0">Website</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center">
                      <div className="spinner-border spinner-border-sm text-theme" role="status">
                        <span className="visually-hidden">{t('common.loading')}</span>
                      </div>
                      <p className="small mt-2 mb-0">{t('products.loadingContact')}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Related Products */}
              <div className="card">
                <div className="card-header bg-theme text-white">
                  <h5 className="mb-0 text-white">{t('products.otherProducts')}</h5>
                </div>
                <div className="card-body">
                  {relatedProducts.map((relatedProduct) => (
                    <div key={relatedProduct.id} className="d-flex gap-3 mb-3">
                      <img
                        src={relatedProduct.image_url || relatedProduct.product_category.image_url || '/images/product/01.jpg'}
                        alt={relatedProduct.name}
                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                      />
                      <div className="flex-grow-1">
                        <h6 className="mb-1">
                          <a href={`/products/${relatedProduct.slug}`} className="text-decoration-none text-dark">
                            { relatedProduct.name}
                          </a>
                        </h6>
                        <p className="text-muted small mb-0">
                          {new Date(relatedProduct.created_at).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US')}
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="text-center mt-3">
                    <a href="/library" className="btn btn-outline-theme btn-sm">
                      {t('products.activityGallery')}
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
