'use client';

import type { Metadata } from 'next';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import OptimizedImage from '@/components/OptimizedImage';
import { Container, Row, Col } from 'react-bootstrap';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { fetchProducts, fetchProductCategories, searchProducts, Product, ProductCategory } from '../../src/utils/api';
import { useLanguage } from '../../src/contexts/LanguageContext';
import Breadcrumb from '@/components/Breadcrumb';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function ProductsPage() {
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<string>('default');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOption, setSortOption] = useState<string>('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    from: 0,
    to: 0,
    itemsPerPage: 20
  });
  
  // Search functionality states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearchSubmitted, setIsSearchSubmitted] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  // Group suggestions by category
  const groupedSuggestions = searchSuggestions.reduce((acc, product) => {
    const categoryName = product.product_category.name;
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  // Flatten suggestions for keyboard navigation
  const flattenedSuggestions = searchSuggestions;
  
  // Popular search terms
  const popularSearchTerms = React.useMemo(() => [
    t('products.popular.juicer'),
    t('products.popular.tea'),
    t('products.popular.household'),
    t('products.popular.medical'),
    t('products.popular.technology'),
    t('products.popular.research')
  ], [t]);

  useEffect(() => {
    // Get URL parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category') || null;
    const sort = searchParams.get('sort') || 'default';
    const search = searchParams.get('search') || '';

    setSelectedCategory(category);
    setSortOrder(sort);
    setSearchQuery(search);
    setPagination(prev => ({ ...prev, currentPage: page, itemsPerPage: limit }));

    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsResponse, categoriesData] = await Promise.all([
          fetchProducts(language, page, limit, category),
          fetchProductCategories(language)
        ]);
        
        setProducts(productsResponse.products);
        setCategories(categoriesData);
        
        // Update pagination info from API response
        if (productsResponse.pagination) {
          setPagination({
            currentPage: productsResponse.pagination.current_page,
            totalPages: productsResponse.pagination.last_page,
            total: productsResponse.pagination.total,
            from: productsResponse.pagination.from,
            to: productsResponse.pagination.to,
            itemsPerPage: productsResponse.pagination.per_page
          });
        }
        
        // If there's a search parameter, perform the search
        if (search.trim()) {
          try {
            const searchResults = await searchProducts(search, language);
            setSearchResults(searchResults);
            setIsSearchSubmitted(true);
          } catch (error) {
            console.error('Error performing initial search:', error);
            setSearchResults([]);
          }
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(t('products.results.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams, language, t]);

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

  // Search functionality
  const handleSearchInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSelectedSuggestionIndex(-1); // Reset selection when typing
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (query.trim().length >= 2) {
      // Debounce search requests
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          setIsSearching(true);
          const suggestions = await searchProducts(query, language);
          setSearchSuggestions(suggestions);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching search suggestions:', error);
          setSearchSuggestions([]);
        } finally {
          setIsSearching(false);
        }
      }, 300);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [language]);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        setIsSearching(true);
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        setIsSearchSubmitted(true);
        
        // Perform the actual search
        const results = await searchProducts(searchQuery, language);
        setSearchResults(results);
        
        // Update URL with search parameter
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.set('search', searchQuery);
        newSearchParams.set('page', '1');
        router.push(`${pathname}?${newSearchParams.toString()}`);
        
      } catch (error) {
        console.error('Error performing search:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }
  };

  const handleSuggestionClick = async (product: Product) => {
    setSearchQuery(product.name);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    
    try {
      setIsSearching(true);
      setIsSearchSubmitted(true);
      
                             // Perform search with the selected product name
         const results = await searchProducts(product.name, language);
      setSearchResults(results);
      
      // Update URL with search parameter
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set('search', product.name);
      newSearchParams.set('page', '1');
      router.push(`${pathname}?${newSearchParams.toString()}`);
      
    } catch (error) {
      console.error('Error performing search:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || searchSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < searchSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < searchSuggestions.length) {
          handleSuggestionClick(searchSuggestions[selectedSuggestionIndex]);
        } else {
          handleSearchSubmit(e as any);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      searchInputRef.current && 
      !searchInputRef.current.contains(event.target as Node) &&
      suggestionsRef.current && 
      !suggestionsRef.current.contains(event.target as Node)
    ) {
      setShowSuggestions(false);
    }
  }, []);

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchSubmitted(false);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    
    // Remove search parameter from URL
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete('search');
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  // Add click outside listener
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Function to get product count for a category
  const getProductCountForCategory = (categorySlug: string): number => {
    return products.filter(product => product.product_category.slug === categorySlug).length;
  };

  // Determine which products to display
  let displayProducts: Product[] = [];

  if (isSearchSubmitted && searchResults.length > 0) {
    // Show search results
    displayProducts = searchResults;
  } else {
    // Show products from API (already filtered by category if selected)
    displayProducts = products;
  }

  // Apply sorting
  const sortedProducts = [...displayProducts].sort((a, b) => {
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
          <span className="visually-hidden">{t('products.results.loading')}</span>
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

  const breadcrumbItems = [
    {
      label: { vi: 'Trang chủ', en: 'Home' },
      href: '/'
    },
    {
      label: { vi: 'Sản phẩm', en: 'Products' },
      active: true
    }
  ];

  return (
    <>
      <Breadcrumb
        title={{ vi: 'Sản phẩm', en: 'Products' }}
        backgroundImage="/images/bg/bg__banner-05.webp"
        items={breadcrumbItems}
      />
      
      {/* Product Categories Section */}
      <section className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
        <Container>
          <div className="text-center mb-5">
            <h4 className="fw-bold mb-3 category-section-title">{t('products.categories.title')}</h4>
            <div className="category-title-underline mx-auto"></div>
          </div>
          <Row className="g-4">
            {categories.map((category) => (
              <Col key={category.id} lg={3} md={6} sm={6} xs={12}>
                <div
                  className="category-card position-relative overflow-hidden rounded-3"
                  onClick={() => handleCategorySelect(category.slug)}
                  style={{
                    height: '250px',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    const card = e.currentTarget;
                    card.style.transform = 'translateY(-10px)';
                    card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    const card = e.currentTarget;
                    card.style.transform = 'translateY(0)';
                    card.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                  }}
                >
                  {/* Background Image */}
                  <OptimizedImage
                    src={category.image_url || '/images/categories/default.jpg'}
                    alt={category.name}
                    width={300}
                    height={250}
                    className="w-100 h-100"
                    style={{
                      objectFit: 'cover',
                      objectPosition: 'center'
                    }}
                    sizes="(max-width: 576px) 100vw, (max-width: 768px) 50vw, (max-width: 992px) 50vw, 25vw"
                  />

                  {/* Overlay */}
                  <div
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{
                      background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)'
                    }}
                  ></div>

                  {/* Category Name */}
                  <div className="position-absolute bottom-0 start-0 w-100 p-4">
                    <h6 className="text-white fw-bold mb-0 text-center text-uppercase category-name" style={{ fontSize: '0.9rem' }}>
                      {category.name}
                    </h6>
                    <div className="text-white text-center category-count" style={{
                      fontSize: '0.75rem',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      marginTop: '5px'
                    }}>
                      {getProductCountForCategory(category.slug)} {t('products.categories.productCount')}
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section>
        <Container>
          {/* Filter/Sort Toolbar */}
          <Row className="mb-5">
            <Col>
              <div className="border border-light rounded p-3">
                <Row className="align-items-center">
                  <Col md={5} className="mb-3 mb-md-0">
                    <span>
                      {t('products.results.showing')} {pagination.from}-{pagination.to} {t('products.results.of')} {pagination.total} {t('products.results.total')}
                    </span>
                  </Col>
                  <Col md={7} className="d-flex align-items-center justify-content-md-end">
                    <div className="sort-filter d-flex align-items-center">
                      <select
                        className="form-select"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                      >
                        <option value="">{t('products.sort.default')}</option>
                        <option value="newest">{t('products.sort.newest')}</option>
                        <option value="popular">{t('products.sort.popular')}</option>
                        <option value="name">{t('products.sort.name')}</option>
                      </select>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
          
          <Row>
            <Col xs={12}>
              {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                  <div className="spinner-border text-theme" role="status">
                    <span className="visually-hidden">{t('products.results.loading')}</span>
                  </div>
                </div>
              ) : products.length === 0 ? (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                  <div className="text-center">
                    <i className="bi bi-search display-1 text-muted mb-3"></i>
                    <h4 className="text-muted">{t('products.results.noProducts')}</h4>
                    <p className="text-muted">{t('products.results.tryDifferentSearch')}</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Product Grid */}
                  <Row className="g-4">
                    {sortedProducts.map((product) => (
                      <Col key={product.id} lg={3} md={6} sm={6} xs={12}>
                        <div className="product-card-new h-100 border rounded-3 overflow-hidden shadow-sm">
                          {/* Product Image */}
                          <div className="product-image-container">
                            <Link href={`/products/${product.slug}`}>
                              <OptimizedImage
                                src={product.image_url || '/images/product/01.jpg'}
                                className="w-100 product-image-new"
                                alt={product.name}
                                context="product-grid-new"
                                width={300}
                                height={200}
                                style={{
                                  width: '100%',
                                  height: '200px',
                                  objectFit: 'cover',
                                  cursor: 'pointer'
                                }}
                                sizes="(max-width: 576px) 100vw, (max-width: 768px) 50vw, (max-width: 992px) 50vw, 25vw"
                                priority={false}
                              />
                            </Link>
                          </div>

                          {/* Product Content */}
                          <div className="p-3 d-flex flex-column">
                            {/* Category Tag */}
                            <div className="mb-2">
                              <span className="badge bg-primary px-2 py-1 small text-white rounded-2">
                                {language === 'vi' ? product.product_category.name : (product.product_category.name || product.product_category.name)}
                              </span>
                            </div>

                            {/* Product Title */}
                            <Link href={`/products/${product.slug}`} className="text-decoration-none">
                              <h6 className="product-title-new fw-bold mb-2 text-dark">
                                {language === 'vi' ? product.name : (product.name || product.name)}
                              </h6>
                            </Link>

                            {/* Product Subtitle */}
                            <p className="product-subtitle text-muted small mb-3">
                               {language === 'vi' ? product.description : (product.description || product.description)}
                            </p>

                            {/* View Details Button */}
                            <div className="mt-auto">
                              <Link
                                href={`/products/${product.slug}`}
                                className="btn btn-primary btn-sm product-detail-btn"
                              >
                                {t('products.viewDetails')}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <nav aria-label="Page navigation" className="mt-5">
                      <ul className="pagination justify-content-center">
                        <li className={`page-item ${pagination.currentPage === 1 ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => updateURL({ page: pagination.currentPage - 1 })}
                            disabled={pagination.currentPage === 1}
                          >
                            <i className="bi bi-chevron-left"></i>
                          </button>
                        </li>

                        {/* Show page numbers */}
                        {(() => {
                          const pages = [];
                          const totalPages = pagination.totalPages;
                          const currentPage = pagination.currentPage;

                          // Always show first page
                          if (currentPage > 3) {
                            pages.push(1);
                            if (currentPage > 4) pages.push('...');
                          }

                          // Show pages around current page
                          for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
                            pages.push(i);
                          }

                          // Always show last page
                          if (currentPage < totalPages - 2) {
                            if (currentPage < totalPages - 3) pages.push('...');
                            pages.push(totalPages);
                          }

                          return pages.map((page, index) => (
                            page === '...' ? (
                              <li key={`ellipsis-${index}`} className="page-item disabled">
                                <span className="page-link">...</span>
                              </li>
                            ) : (
                              <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                                <button
                                  className="page-link"
                                  onClick={() => updateURL({ page: page as number })}
                                >
                                  {page}
                                </button>
                              </li>
                            )
                          ));
                        })()}

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
                  )}
                </>
              )}
            </Col>
          </Row>
        </Container>
      </section>

      <style jsx global>{`
        /* Category Section Title Styles */
        .category-section-title {
          color: #333;
          font-size: 1.5rem;
          position: relative;
        }

        .category-title-underline {
          width: 60px;
          height: 3px;
          background-color: var(--themeht-primary-color);
          border-radius: 2px;
        }

        /* Category Cards Styles */
        .category-card {
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          border-radius: 20px !important;
          overflow: hidden;
          position: relative;
        }

        .category-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%);
          z-index: 1;
          transition: opacity 0.3s ease;
        }

        .category-card:hover::before {
          opacity: 0.9;
        }

        .category-card:hover .category-count {
          opacity: 1 !important;
        }

        .category-card h6 {
          position: relative;
          z-index: 2;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
          letter-spacing: 1px;
        }

        .category-count {
          position: relative;
          z-index: 2;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
        }

        /* Product Cards Styles */
        .product-card-new {
          transition: all 0.3s ease;
          background: white;
          border: 1px solid #e0e0e0 !important;
        }

        .product-card-new:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.1) !important;
          border-color: var(--themeht-primary-color) !important;
        }

        .product-image-new {
          transition: transform 0.3s ease;
        }

        .product-card-new:hover .product-image-new {
          transform: scale(1.05);
        }

        .product-title-new {
          color: #333;
          font-size: 1rem;
          line-height: 1.3;
          min-height: 2.6em;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .product-subtitle {
          font-size: 0.85rem;
          color: #666;
        }

        .product-description {
          line-height: 1.4;
          color: #777;
        }

        .product-detail-btn {
          background-color: var(--themeht-primary-color);
          border-color: var(--themeht-primary-color);
          font-weight: 500;
          padding: 8px 16px;
          border-radius: 6px;
          transition: all 0.3s ease;
          width: auto;
          display: inline-block;
        }

        .product-detail-btn:hover {
          background-color: transparent;
          color: var(--themeht-primary-color);
          border-color: var(--themeht-primary-color);
          transform: translateY(-1px);
        }

        .badge.bg-primary {
          background-color: var(--themeht-primary-color) !important;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .product-title-new:hover {
          color: var(--themeht-primary-color) !important;
          transition: color 0.3s ease;
        }

        /* Product Cards Styles */
        .btn-primary-custom {
          display: inline-flex;
          align-items: center;
          padding: 5px 20px;
          background-color: var(--themeht-primary-color);
          color: white;
          text-decoration: none;
          border-radius: 4px;
          font-weight: 500;
          font-size: 14px;
          transition: all 0.3s ease;
          border: 2px solid var(--themeht-primary-color);
        }

        .btn-primary-custom:hover {
          background-color: transparent;
          color: var(--themeht-primary-color);
          text-decoration: none;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .product-link {
          text-align: left;
        }

        .add-cart {
          width: auto;
          display: inline-flex;
        }

        .product-item {
          min-height: 250px;
        }

        .product-item .row {
          min-height: 250px;
        }

        .product-img {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 250px;
          overflow: hidden;
          background-color: #f8f9fa;
          border-radius: 8px;
        }

        .product-image-fixed {
          width: 100%;
          height: 250px;
          object-fit: cover;
          object-position: center;
        }

        .product-desc {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 1rem 0;
        }

        .btn-primary,
        button[type="submit"] {
          background-color: var(--themeht-primary-color) !important;
          border-color: var(--themeht-primary-color) !important;
          color: white !important;
        }

        .btn-primary:hover,
        button[type="submit"]:hover {
          background-color: transparent !important;
          border-color: var(--themeht-primary-color) !important;
          color: var(--themeht-primary-color) !important;
        }

        .btn-outline-primary {
          background-color: var(--themeht-primary-color) !important;
          border-color: var(--themeht-primary-color) !important;
          color: white !important;
        }

        .btn-outline-primary:hover {
          background-color: transparent !important;
          border-color: var(--themeht-primary-color) !important;
          color: var(--themeht-primary-color) !important;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .category-card {
            height: 200px !important;
          }

          .category-card h6 {
            font-size: 0.8rem !important;
          }

          .category-count {
            font-size: 0.65rem !important;
          }

          .product-title-new {
            font-size: 0.9rem;
            min-height: 2.4em;
          }

          .product-subtitle {
            font-size: 0.8rem;
          }
        }

        @media (max-width: 576px) {
          .category-card {
            height: 180px !important;
          }

          .category-card h6 {
            font-size: 0.75rem !important;
          }

          .category-count {
            font-size: 0.6rem !important;
          }

          .product-title-new {
            font-size: 0.85rem;
            min-height: 2.2em;
          }

          .product-subtitle {
            font-size: 0.75rem;
          }

          .product-description {
            font-size: 0.75rem !important;
          }
        }
      `}</style>
    </>
  );
}
